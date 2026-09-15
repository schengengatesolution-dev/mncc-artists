import { MNCC_CITY, MNCC_EMAIL, MNCC_FACEBOOK, MNCC_ORG } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="no-print border-t border-theater-border mt-auto">
      <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-theater-muted">
        <p className="text-theater-cream/90 font-medium">
          {MNCC_ORG} · {MNCC_CITY}
        </p>
        <p className="mt-2">
          <a
            href={`mailto:${MNCC_EMAIL}`}
            className="text-theater-gold-soft hover:underline"
          >
            {MNCC_EMAIL}
          </a>
          {" · "}
          <a
            href={MNCC_FACEBOOK}
            target="_blank"
            rel="noopener noreferrer"
            className="text-theater-gold-soft hover:underline"
          >
            Facebook
          </a>
        </p>
        <p className="mt-3 text-xs opacity-70">
          Mongolian New Circus Center — Artist Resource Bank
        </p>
      </div>
    </footer>
  );
}
