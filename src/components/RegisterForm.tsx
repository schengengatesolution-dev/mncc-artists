"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ACT_TYPES,
  BIO_EN_MAX,
  PREFERRED_REGIONS,
} from "@/lib/constants";

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
      const fd = new FormData(form);
      fd.delete("actTypes");
      fd.delete("preferredRegions");
      actTypes.forEach((t) => fd.append("actTypes", t));
      regions.forEach((r) => fd.append("preferredRegions", r));

      const res = await fetch("/api/register", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        setBusy(false);
        return;
      }
      router.push(`/artists/${data.slug}?registered=1`);
    } catch {
      setError("Network error. Please try again.");
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
            Photos * (≥1, up to 8)
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
        </div>

        <div>
          <label className={label} htmlFor="resume">
            Resume / CV (PDF or DOC) *
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
            outreach. / МНСС эдгээр материалыг фестиваль, кастингийн зорилгоор
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
          <p className={label}>Extra video links (≤5)</p>
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
            Extra video file uploads
          </label>
          <input
            id="videoFiles"
            name="videoFiles"
            type="file"
            accept="video/*"
            multiple
            className={`${field} file:mr-3 file:rounded file:border-0 file:bg-theater-gold/80 file:px-3 file:py-1 file:text-theater-bg`}
          />
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
