import Image from "next/image";
import Link from "next/link";
import {
  MNCC_ADDRESS,
  MNCC_CITY,
  MNCC_EMAIL,
  MNCC_ORG,
  MNCC_PHONE_DISPLAY,
  MNCC_PHONE_TEL,
} from "@/lib/constants";
import { parseJsonArray } from "@/lib/json";
import { PrintButton } from "@/components/PrintButton";

export type ArtistDossierData = {
  slug: string;
  fullLegalName: string;
  stageName: string | null;
  email: string;
  phone: string;
  nationality: string;
  actTypes: string;
  actTitle: string;
  bioEn: string;
  bioMn: string | null;
  videoUrls: string;
  videoFileUrls: string;
  photoUrls: string;
  resumeUrl: string | null;
  yearsExperience: number | null;
  availabilityWindow: string | null;
  preferredRegions: string;
  desiredFeeNote: string | null;
  techRider: string | null;
  agency: string | null;
};

type Props = {
  artist: ArtistDossierData;
  /** When true (admin), show personal phone/email */
  showPrivateContact?: boolean;
  showRegisteredBanner?: boolean;
};

export function ArtistDossier({
  artist,
  showPrivateContact = false,
  showRegisteredBanner = false,
}: Props) {
  const displayName = artist.stageName || artist.fullLegalName;
  const actTypes = parseJsonArray(artist.actTypes);
  const videos = parseJsonArray(artist.videoUrls);
  const videoFiles = parseJsonArray(artist.videoFileUrls);
  const photos = parseJsonArray(artist.photoUrls);
  const regions = parseJsonArray(artist.preferredRegions);
  const headshot = photos[0];

  return (
    <article className="dossier-print mx-auto max-w-3xl px-4 py-10">
      {showRegisteredBanner && (
        <div className="no-print mb-6 rounded-lg border border-theater-gold/40 bg-theater-gold/10 px-4 py-3 text-sm text-theater-gold-soft">
          Registration received. Share this dossier link with MNCC partners.
        </div>
      )}

      <div className="no-print mb-6 flex flex-wrap gap-3 print:hidden">
        <PrintButton />
        <Link
          href="/"
          className="rounded-full border border-theater-border px-4 py-2 text-sm text-theater-muted hover:text-theater-cream"
        >
          Home
        </Link>
      </div>

      {/* 1. Header */}
      <header className="dossier-section flex items-center gap-4 border-b border-theater-border pb-6">
        <Image
          src="/logo.png"
          alt="MNCC"
          width={64}
          height={64}
          className="h-16 w-16 object-contain"
        />
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-theater-gold">
            Artist dossier
          </p>
          <p className="text-sm text-theater-muted">
            {MNCC_ORG} · Circus Artist Resource
          </p>
        </div>
      </header>

      {/* 2. Headshot + name + acts */}
      <section className="dossier-section mt-8 flex flex-col sm:flex-row gap-6">
        <div className="relative h-48 w-48 shrink-0 overflow-hidden rounded-2xl border border-theater-border bg-theater-elevated">
          {headshot ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={headshot}
              alt={displayName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-theater-muted text-sm">
              No photo
            </div>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-semibold text-theater-cream">
            {displayName}
          </h1>
          {artist.stageName && (
            <p className="text-sm text-theater-muted mt-1">
              Legal: {artist.fullLegalName}
            </p>
          )}
          <p className="mt-2 text-theater-gold-soft font-medium">
            {artist.actTitle}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {actTypes.map((t) => (
              <span
                key={t}
                className="rounded-full border border-theater-gold/40 px-3 py-0.5 text-xs text-theater-gold-soft"
              >
                {t}
              </span>
            ))}
          </div>
          <p className="mt-3 text-sm text-theater-muted">
            {artist.nationality}
            {artist.yearsExperience != null
              ? ` · ${artist.yearsExperience} yrs experience`
              : ""}
          </p>
        </div>
      </section>

      {/* 3. Bio */}
      <section className="dossier-section mt-10">
        <h2 className="text-sm uppercase tracking-wider text-theater-gold">
          Biography
        </h2>
        <p className="mt-3 whitespace-pre-wrap text-theater-cream/90 leading-relaxed">
          {artist.bioEn}
        </p>
        {artist.bioMn && (
          <p className="mt-4 whitespace-pre-wrap text-theater-muted leading-relaxed">
            {artist.bioMn}
          </p>
        )}
      </section>

      {/* 4. Videos */}
      <section className="dossier-section mt-10">
        <h2 className="text-sm uppercase tracking-wider text-theater-gold">
          Videos
        </h2>
        <ul className="mt-3 space-y-2">
          {videos.map((url) => (
            <li key={url}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-theater-gold-soft hover:underline break-all"
              >
                {url}
              </a>
            </li>
          ))}
          {videoFiles.map((url) => (
            <li key={url}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-theater-gold-soft hover:underline break-all"
              >
                Video file: {url}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* 5. Photos */}
      {photos.length > 0 && (
        <section className="dossier-section mt-10">
          <h2 className="text-sm uppercase tracking-wider text-theater-gold">
            Photos
          </h2>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {photos.map((url) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={url}
                src={url}
                alt=""
                className="aspect-square w-full rounded-xl object-cover border border-theater-border"
              />
            ))}
          </div>
        </section>
      )}

      {/* Extra details */}
      {(regions.length > 0 ||
        artist.availabilityWindow ||
        artist.desiredFeeNote ||
        artist.techRider ||
        artist.agency) && (
        <section className="dossier-section mt-10 space-y-2 text-sm">
          <h2 className="text-sm uppercase tracking-wider text-theater-gold mb-3">
            Details
          </h2>
          {regions.length > 0 && (
            <p>
              <span className="text-theater-muted">Regions: </span>
              {regions.join(", ")}
            </p>
          )}
          {artist.availabilityWindow && (
            <p>
              <span className="text-theater-muted">Availability: </span>
              {artist.availabilityWindow}
            </p>
          )}
          {artist.desiredFeeNote && (
            <p>
              <span className="text-theater-muted">Fee note: </span>
              {artist.desiredFeeNote}
            </p>
          )}
          {artist.agency && (
            <p>
              <span className="text-theater-muted">Agency: </span>
              {artist.agency}
            </p>
          )}
          {artist.techRider && (
            <p className="whitespace-pre-wrap">
              <span className="text-theater-muted">Tech rider: </span>
              {artist.techRider}
            </p>
          )}
        </section>
      )}

      {/* 6. Contact via MNCC only */}
      <section className="dossier-section mt-10 rounded-2xl border border-theater-border bg-theater-elevated/50 p-6">
        <h2 className="text-sm uppercase tracking-wider text-theater-gold">
          Contact
        </h2>
        <p className="mt-2 text-theater-cream/90">
          For bookings and casting, contact MNCC only:
        </p>
        <div className="mt-3 space-y-1 text-theater-gold-soft">
          <p>
            <a
              href={`tel:${MNCC_PHONE_TEL}`}
              className="hover:underline text-lg"
            >
              {MNCC_PHONE_DISPLAY}
            </a>
          </p>
          <p>
            <a
              href={`mailto:${MNCC_EMAIL}`}
              className="hover:underline text-lg"
            >
              {MNCC_EMAIL}
            </a>
          </p>
        </div>
        <p className="mt-3 text-xs text-theater-muted leading-relaxed max-w-xl">
          {MNCC_ADDRESS}
        </p>
        {!showPrivateContact && (
          <p className="mt-3 text-xs text-theater-muted">
            Personal phone is withheld on public dossiers.
          </p>
        )}
        {showPrivateContact && (
          <div className="mt-4 border-t border-theater-border pt-4 text-sm space-y-1">
            <p className="text-theater-muted">Internal (admin only)</p>
            <p>Email: {artist.email}</p>
            <p>Phone: {artist.phone}</p>
            {artist.resumeUrl && (
              <p>
                Resume:{" "}
                <a
                  href={artist.resumeUrl}
                  className="text-theater-gold-soft hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download
                </a>
              </p>
            )}
          </div>
        )}
      </section>

      {/* 7. Footer */}
      <footer className="dossier-section mt-12 border-t border-theater-border pt-6 text-center text-sm text-theater-muted space-y-1">
        <p>
          {MNCC_ORG} · {MNCC_CITY}
        </p>
        <p>
          <a href={`tel:${MNCC_PHONE_TEL}`} className="text-theater-gold-soft hover:underline">
            {MNCC_PHONE_DISPLAY}
          </a>
          {" · "}
          <a href={`mailto:${MNCC_EMAIL}`} className="text-theater-gold-soft hover:underline">
            {MNCC_EMAIL}
          </a>
        </p>
        <p className="text-xs max-w-xl mx-auto leading-relaxed">{MNCC_ADDRESS}</p>
      </footer>
    </article>
  );
}

