import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "2026 Cirque Du Soleil Audition",
  description:
    "2026 Cirque Du Soleil Audition / Нарны Цирк 2026 Сонгон Шалгаруулалт — details coming soon from MNCC.",
};

export default function Cirque2026AuditionPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <p className="text-theater-gold text-xs font-semibold tracking-[0.2em] uppercase">
        Auditions / Сонгон шалгаруулалт
      </p>
      <h1 className="mt-3 text-3xl sm:text-4xl font-semibold text-theater-cream text-balance">
        2026 Cirque Du Soleil Audition
      </h1>
      <p className="mt-2 text-lg text-theater-gold-soft/90 text-balance">
        Нарны Цирк 2026 Сонгон Шалгаруулалт
      </p>
      <p className="mt-6 text-theater-muted leading-relaxed">
        Details coming soon. / Дэлгэрэнгүй мэдээлэл удахгүй.
      </p>
      <p className="mt-2 text-sm text-theater-muted/80">
        Content placeholders below — official registration, location, and dates
        will be published by MNCC. Do not treat empty sections as confirmed
        facts.
      </p>

      <div className="mt-10 space-y-6">
        <section className="rounded-2xl border border-theater-border bg-theater-elevated/60 p-6">
          <h2 className="text-sm uppercase tracking-wider text-theater-gold">
            Registration / Бүртгэл
          </h2>
          <p className="mt-3 text-sm text-theater-muted italic">
            [PLACEHOLDER — registration details TBD]
          </p>
        </section>

        <section className="rounded-2xl border border-theater-border bg-theater-elevated/60 p-6">
          <h2 className="text-sm uppercase tracking-wider text-theater-gold">
            Location / Байршил
          </h2>
          <p className="mt-3 text-sm text-theater-muted italic">
            [PLACEHOLDER — location TBD]
          </p>
        </section>

        <section className="rounded-2xl border border-theater-border bg-theater-elevated/60 p-6">
          <h2 className="text-sm uppercase tracking-wider text-theater-gold">
            Dates / Огноо
          </h2>
          <p className="mt-3 text-sm text-theater-muted italic">
            [PLACEHOLDER — dates TBD]
          </p>
        </section>
      </div>

      <p className="mt-10 text-sm text-theater-muted">
        <Link href="/" className="text-theater-gold-soft hover:underline">
          ← Back to home
        </Link>
        {" · "}
        <Link
          href="/register"
          className="text-theater-gold-soft hover:underline"
        >
          Artist registration / Уран бүтээлчийн бүртгэл
        </Link>
      </p>
    </div>
  );
}
