import Image from "next/image";
import { MNCC_CITY, MNCC_EMAIL, MNCC_FACEBOOK, MNCC_ORG } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="no-print border-t border-theater-border mt-auto">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 text-sm text-theater-muted sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="New Circus"
            width={56}
            height={56}
            className="h-14 w-14 object-contain"
          />
          <div>
            <p className="text-theater-cream/90 font-medium">
              {MNCC_ORG} · {MNCC_CITY}
            </p>
            <p className="mt-1 text-xs opacity-70">
              Mongolian New Circus Center — Artist Resource Bank
            </p>
          </div>
        </div>
        <p>
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
      </div>
    </footer>
  );
}
