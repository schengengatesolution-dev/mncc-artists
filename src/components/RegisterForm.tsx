"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ACT_TYPES,
  BIO_EN_MAX,
  PREFERRED_REGIONS,
} from "@/lib/constants";
import {
  DRIVE_SHARE_GUIDE_EN,
  DRIVE_SHARE_GUIDE_MN,
  isBlockedVideoHost,
  isGoogleDriveUrl,
  validateGoogleDriveUrl,
} from "@/lib/drive";

const PHOTO_MAX = 1.5 * 1024 * 1024; // 1.5MB
const RESUME_MAX = 4 * 1024 * 1024; // 4MB
const COMPRESS_TARGET = 1.2 * 1024 * 1024; // 1.2MB JPEG target
const MAX_PHOTOS = 8;

function formatMb(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

/** Compress an image to JPEG under target size via canvas. Keeps original name. */
async function compressImageToJpeg(
  file: File,
  targetBytes = COMPRESS_TARGET
): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") {
    return file;
  }
  if (file.size <= targetBytes && file.type === "image/jpeg") {
    return file;
  }

  try {
    const source = await createImageBitmap(file);
    let width = source.width;
    let height = source.height;
    source.close();

    const maxDim = 2000;
    if (width > maxDim || height > maxDim) {
      const scale = maxDim / Math.max(width, height);
      width = Math.round(width * scale);
      height = Math.round(height * scale);
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;

    let best: Blob | null = null;

    for (let attempt = 0; attempt < 6; attempt++) {
      canvas.width = width;
      canvas.height = height;
      const bmp = await createImageBitmap(file);
      ctx.drawImage(bmp, 0, 0, width, height);
      bmp.close();

      let quality = 0.85;
      for (let q = 0; q < 6; q++) {
        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, "image/jpeg", quality)
        );
        if (!blob) break;
        if (!best || blob.size < best.size) best = blob;
        if (blob.size <= targetBytes) {
          return new File([blob], file.name, {
            type: "image/jpeg",
            lastModified: Date.now(),
          });
        }
        quality -= 0.1;
      }

      width = Math.round(width * 0.75);
      height = Math.round(height * 0.75);
      if (width < 400 || height < 400) break;
    }

    if (best && best.size < file.size) {
      return new File([best], file.name, {
        type: "image/jpeg",
        lastModified: Date.now(),
      });
    }
    return file;
  } catch {
    return file;
  }
}

function collectVideoUrls(raw: FormData): string[] {
  const urls: string[] = [];
  for (let i = 1; i <= 6; i++) {
    const v = String(raw.get(`videoUrl${i}`) || "").trim();
    if (v) urls.push(v);
  }
  return urls;
}

function validateClient(
  videoUrls: string[],
  photosDriveUrl: string,
  resumeDriveUrl: string,
  photos: File[],
  resume: File | null
): string | null {
  if (videoUrls.length === 0) {
    return (
      "At least one Google Drive video link is required. / " +
      "Google Drive видео холбоос заавал оруулна уу."
    );
  }
  for (const url of videoUrls) {
    if (isBlockedVideoHost(url)) {
      return (
        "YouTube and Vimeo are not accepted. Paste a Google Drive link to the original video file. / " +
        "YouTube, Vimeo хүлээн авахгүй — эх видео файлын Google Drive холбоос оруулна уу."
      );
    }
    if (!isGoogleDriveUrl(url)) {
      return (
        "Video links must be Google Drive share links (drive.google.com / docs.google.com). / " +
        "Видео холбоос Google Drive байх ёстой."
      );
    }
  }

  if (photosDriveUrl) {
    const err = validateGoogleDriveUrl(photosDriveUrl, "Photos Drive link");
    if (err) return err;
  }
  if (resumeDriveUrl) {
    const err = validateGoogleDriveUrl(resumeDriveUrl, "Resume Drive link");
    if (err) return err;
  }

  if (!photosDriveUrl && photos.length === 0) {
    return (
      "Add a Google Drive photos folder link (preferred), or upload at least one photo. / " +
      "Зургийн Google Drive фолдер холбоос (илүү дээр) эсвэл зураг оруулна уу."
    );
  }
  if (photos.length > MAX_PHOTOS) {
    return `Maximum ${MAX_PHOTOS} photos. / Хамгийн ихдээ ${MAX_PHOTOS} зураг.`;
  }
  for (const f of photos) {
    if (f.size > PHOTO_MAX) {
      return (
        `Photo "${f.name}" is too large (${formatMb(f.size)}). Max ${formatMb(PHOTO_MAX)} each. ` +
        `/ Зураг хэт том байна. Зураг бүрийг ${formatMb(PHOTO_MAX)}-аас бага болгоно уу.`
      );
    }
  }

  if (!resumeDriveUrl && (!resume || resume.size === 0)) {
    return (
      "Add a Google Drive resume/CV link (preferred), or upload a resume file. / " +
      "CV-ийн Google Drive холбоос (илүү дээр) эсвэл файл оруулна уу."
    );
  }
  if (resume && resume.size > RESUME_MAX) {
    return (
      `Resume is too large (${formatMb(resume.size)}). Max ${formatMb(RESUME_MAX)}. ` +
      `/ CV хэт том байна. Хамгийн ихдээ ${formatMb(RESUME_MAX)}.`
    );
  }
  return null;
}

export function RegisterForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bioLen, setBioLen] = useState(0);
  const [actTypes, setActTypes] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);

  function toggle(list: string[], value: string, setter: (v: string[]) => void) {
    setter(
      list.includes(value) ? list.filter((x) => x !== value) : [...list, value]
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const form = e.currentTarget;
      const raw = new FormData(form);

      const photoList = (raw.getAll("photos") as File[]).filter(
        (f) => f instanceof File && f.size > 0
      );
      const resumeFile =
        (raw.get("resume") instanceof File &&
          (raw.get("resume") as File).size > 0 &&
          (raw.get("resume") as File)) ||
        null;
      const videoUrls = collectVideoUrls(raw);
      const photosDriveUrl = String(raw.get("photosDriveUrl") || "").trim();
      const resumeDriveUrl = String(raw.get("resumeDriveUrl") || "").trim();

      const validationError = validateClient(
        videoUrls,
        photosDriveUrl,
        resumeDriveUrl,
        photoList,
        resumeFile
      );
      if (validationError) {
        setError(validationError);
        setBusy(false);
        return;
      }

      const compressedPhotos: File[] = [];
      for (const photo of photoList) {
        compressedPhotos.push(await compressImageToJpeg(photo));
      }
      for (const f of compressedPhotos) {
        if (f.size > PHOTO_MAX) {
          setError(
            `Photo "${f.name}" is still too large after compression (${formatMb(f.size)}). Max ${formatMb(PHOTO_MAX)}. ` +
              `/ Шахасны дараа ч зураг хэт том байна. Google Drive фолдер холбоос ашиглана уу.`
          );
          setBusy(false);
          return;
        }
      }

      const fd = new FormData();
      Array.from(raw.entries()).forEach(([key, value]) => {
        if (key === "photos" || key === "resume") return;
        if (key === "actTypes" || key === "preferredRegions") return;
        fd.append(key, value);
      });
      actTypes.forEach((t) => fd.append("actTypes", t));
      regions.forEach((r) => fd.append("preferredRegions", r));
      compressedPhotos.forEach((f) => fd.append("photos", f));
      if (resumeFile) fd.append("resume", resumeFile);

      const res = await fetch("/api/register", { method: "POST", body: fd });

      const contentType = res.headers.get("content-type") || "";
      let data: { error?: string; detail?: string; slug?: string } = {};
      let bodyText = "";
      if (contentType.includes("application/json")) {
        try {
          data = await res.json();
        } catch {
          bodyText = "";
        }
      } else {
        try {
          bodyText = await res.text();
        } catch {
          bodyText = "";
        }
      }

      if (!res.ok) {
        const msg =
          data.error ||
          (bodyText && bodyText.slice(0, 200)) ||
          `Request failed (HTTP ${res.status})`;
        setError(
          `${msg}${
            res.status === 413
              ? " — payload too large; use Google Drive links for photos/CV instead of large uploads."
              : ""
          }`
        );
        setBusy(false);
        return;
      }

      if (!data.slug) {
        setError("Registration succeeded but no profile slug was returned.");
        setBusy(false);
        return;
      }
      router.push(`/artists/${data.slug}?registered=1`);
    } catch (err) {
      const detail = err instanceof Error ? err.message : "unknown";
      setError(
        `Network error (${detail}). Check your connection and try again. / Сүлжээний алдаа. Дахин оролдоно уу.`
      );
      setBusy(false);
    }
  }

  const field =
    "mt-1 w-full rounded-lg border border-theater-border bg-theater-bg px-3 py-2 text-theater-cream placeholder:text-theater-muted/60 focus:border-theater-gold focus:outline-none";
  const label = "block text-sm font-medium text-theater-gold-soft";

  return (
    <form onSubmit={onSubmit} className="space-y-8" encType="multipart/form-data">
      {error && (
        <div className="rounded-lg border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-theater-cream border-b border-theater-border pb-2">
          Required / Заавал
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="fullLegalName">
              Full legal name *
            </label>
            <input id="fullLegalName" name="fullLegalName" required className={field} />
          </div>
          <div>
            <label className={label} htmlFor="stageName">
              Stage name (optional)
            </label>
            <input id="stageName" name="stageName" className={field} />
          </div>
          <div>
            <label className={label} htmlFor="email">
              Email *
            </label>
            <input id="email" name="email" type="email" required className={field} />
          </div>
          <div>
            <label className={label} htmlFor="phone">
              Phone / WhatsApp *
            </label>
            <input id="phone" name="phone" required className={field} />
          </div>
          <div>
            <label className={label} htmlFor="nationality">
              Nationality *
            </label>
            <input id="nationality" name="nationality" required className={field} />
          </div>
          <div>
            <label className={label} htmlFor="actTitle">
              Act title *
            </label>
            <input id="actTitle" name="actTitle" required className={field} />
          </div>
        </div>

        <div>
          <p className={label}>Act type(s) * — multi-select</p>
          <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {ACT_TYPES.map((t) => (
              <label
                key={t}
                className={`cursor-pointer rounded-lg border px-3 py-2 text-sm ${
                  actTypes.includes(t)
                    ? "border-theater-gold bg-theater-gold/15 text-theater-gold-soft"
                    : "border-theater-border text-theater-muted"
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={actTypes.includes(t)}
                  onChange={() => toggle(actTypes, t, setActTypes)}
                />
                {t}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className={label} htmlFor="bioEn">
            Short bio EN * ({bioLen}/{BIO_EN_MAX})
          </label>
          <textarea
            id="bioEn"
            name="bioEn"
            required
            maxLength={BIO_EN_MAX}
            rows={4}
            className={field}
            onChange={(e) => setBioLen(e.target.value.length)}
          />
        </div>

        {/* Google Drive video — required */}
        <div className="rounded-xl border border-theater-gold/40 bg-theater-gold/5 p-4 space-y-3">
          <label className={label} htmlFor="videoUrl1">
            Primary video — Google Drive original file * / Видео (Google Drive эх файл) *
          </label>
          <p className="text-xs text-theater-cream/90">
            Videos must be Google Drive original files only — not YouTube, Vimeo, or other sites.
            / Зөвхөн Google Drive эх файл — YouTube, Vimeo болон бусад сайт хүлээн авахгүй.
          </p>
          <ol className="list-decimal pl-5 space-y-1 text-xs text-theater-muted">
            {DRIVE_SHARE_GUIDE_EN.map((step, i) => (
              <li key={step}>
                <span className="text-theater-cream/85">{step}</span>
                <span className="block text-theater-muted">{DRIVE_SHARE_GUIDE_MN[i]}</span>
              </li>
            ))}
          </ol>
          <p className="text-xs text-amber-200/90">
            Warning: if the link is Restricted, clients cannot open it. /
            Анхааруулга: Restricted бол үйлчлүүлэгч нээж чадахгүй.
          </p>
          <input
            id="videoUrl1"
            name="videoUrl1"
            type="url"
            required
            placeholder="https://drive.google.com/file/d/…"
            className={field}
          />
        </div>

        <div>
          <label className={label} htmlFor="photosDriveUrl">
            Photos folder — Google Drive * (preferred) / Зургийн фолдер (Google Drive)
          </label>
          <p className="mt-0.5 text-xs text-theater-muted">
            Share a Drive folder with photos · Anyone with the link → Viewer ·
            Фолдерыг Anyone with the link → Viewer болгоно уу
          </p>
          <input
            id="photosDriveUrl"
            name="photosDriveUrl"
            type="url"
            placeholder="https://drive.google.com/drive/folders/…"
            className={field}
          />
        </div>

        <div className="rounded-lg border border-theater-gold/30 bg-theater-gold/5 px-3 py-2 text-xs text-theater-cream/90">
          Prefer Google Drive for large packs. Optional uploads below if you also want a headshot on the dossier. /
          Том багцыг Drive-аар илгээнэ үү. Доорх upload нь нэмэлт (dossier дээрх зураг).
        </div>

        <div>
          <label className={label} htmlFor="photos">
            Photos upload (optional fallback)
          </label>
          <p className="mt-0.5 text-xs text-theater-muted">
            max 1.5MB each · up to 8 · required only if no Drive folder link ·
            Зураг: нэг бүр 1.5MB хүртэл (Drive холбоос байхгүй бол заавал)
          </p>
          <input
            id="photos"
            name="photos"
            type="file"
            accept="image/*"
            multiple
            className={`${field} file:mr-3 file:rounded file:border-0 file:bg-theater-gold file:px-3 file:py-1 file:text-theater-bg`}
          />
          <p className="mt-1 text-xs text-theater-muted">
            Large images are auto-compressed in your browser toward ≤1.2MB JPEG.
          </p>
        </div>

        <div className="rounded-xl border border-theater-border bg-theater-elevated/40 p-4 space-y-3">
          <label className={label} htmlFor="resumeDriveUrl">
            Resume / CV — Google Drive * (preferred) / Намтар (Google Drive)
          </label>
          <p className="mt-0.5 text-xs text-theater-muted">
            Share the CV file · Anyone with the link → Viewer
          </p>
          <div className="rounded-lg border border-amber-500/40 bg-amber-950/30 px-3 py-2 text-xs text-amber-100/95 space-y-1">
            <p>
              <strong>CV must NOT include personal contact</strong> — no phone, email, WeChat,
              social media, address, or personal links. Allowed: name, talent/act, experience,
              festivals, awards.
            </p>
            <p>
              <strong>CV-д хувийн холбоо барих мэдээлэл оруулахгүй</strong> — утас, имэйл, WeChat,
              сошиал, хаяг, хувийн холбоос байж болохгүй. Зөвшөөрөгдөх: нэр, урлаг/акт, туршлага,
              фестиваль, шагнал.
            </p>
            <p className="text-theater-cream/80">
              Clients contact New Circus Center only (mongolcircus@gmail.com / site contact). /
              Үйлчлүүлэгч зөвхөн Шинэ цирк төвтэй холбогдоно.
            </p>
          </div>
          <input
            id="resumeDriveUrl"
            name="resumeDriveUrl"
            type="url"
            placeholder="https://drive.google.com/file/d/…"
            className={field}
          />

          <div>
            <label className={label} htmlFor="resume">
              Resume / CV upload (optional fallback)
            </label>
            <p className="mt-0.5 text-xs text-theater-muted">
              max 4MB · PDF/DOC · required only if no Drive link · Намтар: 4MB хүртэл
            </p>
            <input
              id="resume"
              name="resume"
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className={`${field} file:mr-3 file:rounded file:border-0 file:bg-theater-gold file:px-3 file:py-1 file:text-theater-bg`}
            />
          </div>

          <label className="flex items-start gap-3 text-sm text-theater-cream/90">
            <input
              type="checkbox"
              name="cvNoContact"
              value="yes"
              required
              className="mt-1 accent-theater-gold"
            />
            <span>
              I confirm my CV/resume has <strong>no personal contact</strong> (no phone, email,
              WeChat, social, address, or personal links). Clients contact MNCC only. /
              Миний CV-д <strong>хувийн холбоо барих мэдээлэл байхгүй</strong> гэдгийг баталж байна.
              Үйлчлүүлэгч зөвхөн Шинэ цирк төвтэй холбогдоно. *
            </span>
          </label>
        </div>

        <label className="flex items-start gap-3 text-sm text-theater-cream/90">
          <input
            type="checkbox"
            name="consent"
            value="yes"
            required
            className="mt-1 accent-theater-gold"
          />
          <span>
            I consent that MNCC may use these materials for festival and casting
            outreach. / Шинэ цирк төв эдгээр материалыг фестиваль, кастингийн зорилгоор
            ашиглахыг зөвшөөрч байна. *
          </span>
        </label>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-theater-cream border-b border-theater-border pb-2">
          Optional / Нэмэлт
        </h2>

        <div>
          <label className={label} htmlFor="bioMn">
            Bio MN
          </label>
          <textarea id="bioMn" name="bioMn" rows={3} className={field} />
        </div>

        <div className="space-y-2">
          <p className={label}>Extra Google Drive video links (≤5)</p>
          <p className="text-xs text-theater-muted">
            Same rule: Drive original files only — no YouTube/Vimeo. /
            Зөвхөн Google Drive — YouTube/Vimeo биш.
          </p>
          {[2, 3, 4, 5, 6].map((n) => (
            <input
              key={n}
              name={`videoUrl${n}`}
              type="url"
              placeholder={`https://drive.google.com/… (${n - 1})`}
              className={field}
            />
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="yearsExperience">
              Years experience
            </label>
            <input
              id="yearsExperience"
              name="yearsExperience"
              type="number"
              min={0}
              max={80}
              className={field}
            />
          </div>
          <div>
            <label className={label} htmlFor="availabilityWindow">
              Availability window
            </label>
            <input
              id="availabilityWindow"
              name="availabilityWindow"
              placeholder="e.g. Oct 2026 – Mar 2027"
              className={field}
            />
          </div>
        </div>

        <div>
          <p className={label}>Preferred regions</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {PREFERRED_REGIONS.map((r) => (
              <label
                key={r}
                className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm ${
                  regions.includes(r)
                    ? "border-theater-gold bg-theater-gold/15 text-theater-gold-soft"
                    : "border-theater-border text-theater-muted"
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={regions.includes(r)}
                  onChange={() => toggle(regions, r, setRegions)}
                />
                {r}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className={label} htmlFor="desiredFeeNote">
            Desired fee note
          </label>
          <input id="desiredFeeNote" name="desiredFeeNote" className={field} />
        </div>
        <div>
          <label className={label} htmlFor="techRider">
            Tech rider
          </label>
          <textarea id="techRider" name="techRider" rows={3} className={field} />
        </div>
        <div>
          <label className={label} htmlFor="agency">
            Agency
          </label>
          <input id="agency" name="agency" className={field} />
        </div>
      </section>

      <button
        type="submit"
        disabled={busy || actTypes.length === 0}
        className="w-full sm:w-auto rounded-full bg-theater-gold px-8 py-3 font-semibold text-theater-bg hover:bg-theater-gold-soft disabled:opacity-50 transition"
      >
        {busy ? "Submitting…" : "Submit registration / Илгээх"}
      </button>
      {actTypes.length === 0 && (
        <p className="text-xs text-theater-muted">Select at least one act type.</p>
      )}
    </form>
  );
}
