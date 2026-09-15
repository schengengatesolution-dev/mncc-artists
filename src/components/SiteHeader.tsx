import Link from "next/link";
import Image from "next/image";

export function SiteHeader() {
  return (
    <header className="no-print border-b border-theater-border/80 bg-theater-bg/90 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Image
            src="/logo.png"
            alt="MNCC New Circus Center"
            width={56}
            height={56}
            className="h-14 w-14 object-contain"
            priority
          />
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-wide text-theater-gold-soft">
              MNCC
            </div>
            <div className="text-xs text-theater-muted">
              Circus Artist Resource
            </div>
          </div>
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-2 sm:gap-3 text-sm">
          <Link
            href="/auditions/cirque-2026"
            className="rounded-full border border-theater-gold/50 px-3 py-2 text-[11px] sm:text-xs md:text-sm font-medium text-theater-gold-soft hover:bg-theater-gold/10 hover:border-theater-gold transition text-center leading-snug"
          >
            2026 Cirque Du Soleil Audition / Нарны Цирк 2026 Сонгон
            Шалгаруулалт
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-theater-gold px-4 py-2 font-medium text-theater-bg hover:bg-theater-gold-soft transition whitespace-nowrap"
          >
            Register / Бүртгүүлэх
          </Link>
          <Link
            href="/admin"
            className="hidden sm:inline text-theater-muted hover:text-theater-cream"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
