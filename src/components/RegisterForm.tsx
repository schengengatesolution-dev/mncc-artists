"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ACT_TYPES,
  BIO_EN_MAX,
  PREFERRED_REGIONS,
} from "@/lib/constants";

const PHOTO_MAX = 1.5 * 1024 * 1024; // 1.5MB
const RESUME_MAX = 4 * 1024 * 1024; // 4MB
const VIDEO_FILE_MAX = 1.5 * 1024 * 1024; // 1.5MB
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

function validateClientFiles(
  photos: File[],
  resume: File | null,
  videoFiles: File[]
): string | null {
  if (photos.length === 0) {
    return "Upload at least one photo. / Хамгийн багадаа 1 зураг оруулна уу.";
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
  if (!resume || resume.size === 0) {
    return "Resume/CV is required. / CV заавал оруулна уу.";
  }
  if (resume.size > RESUME_MAX) {
    return (
      `Resume is too large (${formatMb(resume.size)}). Max ${formatMb(RESUME_MAX)}. ` +
      `/ CV хэт том байна. Хамгийн ихдээ ${formatMb(RESUME_MAX)}.`
    );
  }
  for (const f of videoFiles) {
    if (f.size > VIDEO_FILE_MAX) {
      return (
        `Video file "${f.name}" is too large (${formatMb(f.size)}). Max ${formatMb(VIDEO_FILE_MAX)}. Prefer a YouTube/Vimeo link. ` +
        `/ Видео файл хэт том. YouTube/Vimeo холбоос илүү тохиромжтой.`
      );
    }
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
      const videoList = (raw.getAll("videoFiles") as File[]).filter(
        (f) => f instanceof File && f.size > 0
      );

      const validationError = validateClientFiles(
        photoList,
        resumeFile,
        videoList
      );
      if (validationError) {
        setError(validationError);
        setBusy(false);
        return;
      }

      // Compress photos client-side when possible (JPEG ≤1.2MB)
      const compressedPhotos: File[] = [];
      for (const photo of photoList) {
        compressedPhotos.push(await compressImageToJpeg(photo));
      }
      // Re-check after compression (edge case: still over)
      for (const f of compressedPhotos) {
        if (f.size > PHOTO_MAX) {
          setError(
            `Photo "${f.name}" is still too large after compression (${formatMb(f.size)}). Max ${formatMb(PHOTO_MAX)}. ` +
              `/ Шахасны дараа ч зураг хэт том байна. Жижиг зураг сонгоно уу.`
          );
          setBusy(false);
          return;
        }
      }

      const fd = new FormData();
      Array.from(raw.entries()).forEach(([key, value]) => {
        if (key === "photos" || key === "videoFiles" || key === "resume") return;
        if (key === "actTypes" || key === "preferredRegions") return;
        fd.append(key, value);
      });
      actTypes.forEach((t) => fd.append("actTypes", t));
      regions.forEach((r) => fd.append("preferredRegions", r));
      compressedPhotos.forEach((f) => fd.append("photos", f));
      if (resumeFile) fd.append("resume", resumeFile);
      videoList.forEach((f) => fd.append("videoFiles", f));

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
          `${msg}${res.status === 413 ? " — payload too large; use smaller photos or YouTube/Vimeo links." : ""}`
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

        <div>
          <label className={label} htmlFor="videoUrl1">
            Primary video URL (YouTube / Vimeo) *
          </label>
          <input
            id="videoUrl1"
            name="videoUrl1"
            type="url"
            required
            placeholder="https://youtube.com/..."
            className={field}
          />
        </div>

        <div>
          <label className={label} htmlFor="photos">
            Photos * (≥1, up to 8 · ≤1.5MB each · auto-compressed)
          </label>
          <input
            id="photos"
            name="photos"
            type="file"
            accept="image/*"
            multiple
            required
            className={`${field} file:mr-3 file:rounded file:border-0 file:bg-theater-gold file:px-3 file:py-1 file:text-theater-bg`}
          />
          <p className="mt-1 text-xs text-theater-muted">
            Max 1.5MB per photo. Large images are compressed in your browser. /
            Зураг бүрийг 1.5MB-аас бага байлгана уу.
          </p>
        </div>

        <div>
          <label className={label} htmlFor="resume">
            Resume / CV (PDF or DOC) * · ≤4MB
          </label>
          <input
            id="resume"
            name="resume"
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            required
            className={`${field} file:mr-3 file:rounded file:border-0 file:bg-theater-gold file:px-3 file:py-1 file:text-theater-bg`}
          />
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
          <p className={label}>Extra video links (≤5) — preferred</p>
          {[2, 3, 4, 5, 6].map((n) => (
            <input
              key={n}
              name={`videoUrl${n}`}
              type="url"
              placeholder={`Video URL ${n - 1}`}
              className={field}
            />
          ))}
        </div>

        <div>
          <label className={label} htmlFor="videoFiles">
            Extra video file uploads (optional · ≤1.5MB each — prefer YouTube/Vimeo link)
          </label>
          <input
            id="videoFiles"
            name="videoFiles"
            type="file"
            accept="video/*"
            multiple
            className={`${field} file:mr-3 file:rounded file:border-0 file:bg-theater-gold/80 file:px-3 file:py-1 file:text-theater-bg`}
          />
          <p className="mt-1 text-xs text-theater-muted">
            Prefer a YouTube/Vimeo link above. Large video files often fail on the
            server. / Том видео файлын оронд YouTube/Vimeo холбоос ашиглана уу.
          </p>
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
