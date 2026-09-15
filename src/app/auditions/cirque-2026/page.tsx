import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "2026 Cirque Du Soleil Audition",
  description:
    "2026 Cirque Du Soleil Audition / Нарны Цирк 2026 Сонгон Шалгаруулалт — public audition dates 28–29 November 2026, Ulaanbaatar. Register with New Circus Center (MNCC).",
};

const ANNOUNCE_IG = "https://www.instagram.com/p/DWj-9q0D1tx/";
const ANNOUNCE_FB = "https://www.facebook.com/share/p/18QkeCGBZY/";

const VENUE_EN =
  "Technical Committee of Sports Gymnastics hall, 8th khoroo, Sukhbaatar District, Ulaanbaatar";
const VENUE_MN =
  "Спорт гимнастикийн техникийн хорооны заал, Сүхбаатар дүүрэг, 8-р хороо, Улаанбаатар";

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
      <p className="mt-4 text-sm text-theater-muted">
        Organized with Cirque du Soleil Casting · Cirque du Soleil Casting-тай
        хамтран зохион байгуулж байна
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/register"
          className="rounded-full bg-theater-gold px-5 py-2.5 text-sm font-semibold text-theater-bg hover:bg-theater-gold-soft transition"
        >
          Register with New Circus Center / Шинэ цирк төвд бүртгүүлэх
        </Link>
      </div>

      <div className="mt-10 space-y-6">
        {/* Audition dates + venue (one box) */}
        <section className="rounded-2xl border border-theater-border bg-theater-elevated/60 p-6">
          <h2 className="text-sm uppercase tracking-wider text-theater-gold">
            Audition dates / Сонгон шалгаруулалтын огноо
          </h2>
          <p className="mt-3 text-theater-cream/90 leading-relaxed">
            Public audition dates are{" "}
            <span className="text-theater-gold-soft font-medium">
              28–29 November 2026
            </span>{" "}
            at {VENUE_EN}.
          </p>
          <p className="mt-3 text-theater-cream/90 leading-relaxed">
            Олон нийтийн сонгон шалгаруулалтын огноо{" "}
            <span className="text-theater-gold-soft font-medium">
              2026 оны 11-р сарын 28–29
            </span>
            , байршил: {VENUE_MN}.
          </p>
          <p className="mt-4 text-sm text-theater-muted leading-relaxed">
            Sports gymnastics hall of the Technical Committee of Sports
            Gymnastics · Спорт гимнастикийн техникийн хорооны заал
          </p>
          <p className="mt-1 text-sm text-theater-muted">
            8th khoroo, Sukhbaatar District, Ulaanbaatar · Сүхбаатар дүүрэг,
            8-р хороо, Улаанбаатар
          </p>
        </section>

        {/* Register via MNCC */}
        <section className="rounded-2xl border border-theater-border bg-theater-elevated/60 p-6">
          <h2 className="text-sm uppercase tracking-wider text-theater-gold">
            Register / Бүртгэл
          </h2>
          <p className="mt-3 text-sm text-theater-cream/90 leading-relaxed">
            Register with New Circus Center (Шинэ цирк төв) with your bio and
            videos. Artists who register enter MNCC’s process supporting the
            Cirque du Soleil Mongolia audition.
          </p>
          <p className="mt-2 text-sm text-theater-muted leading-relaxed">
            Шинэ цирк төвд намтар, видео бичлэгтэйгээ бүртгүүлнэ үү. Бүртгэлээр
            та Cirque du Soleil-ийн Монгол дахь сонгон шалгаруулалтыг дэмжих Шинэ
            цирк төвийн үйл явцад орно.
          </p>

          <Link
            href="/register"
            className="mt-5 inline-flex rounded-full bg-theater-gold px-5 py-2.5 text-sm font-semibold text-theater-bg hover:bg-theater-gold-soft transition"
          >
            Go to registration / Бүртгэлийн хуудас руу
          </Link>

          <p className="mt-6 text-sm text-theater-muted">
            Announcement posts / Зарлалын нийтлэл:
          </p>
          <p className="mt-2 text-sm text-theater-cream/90 leading-relaxed">
            First announced around 26 April 2026; now scheduled 28–29 November
            2026.
          </p>
          <p className="mt-1 text-sm text-theater-muted leading-relaxed">
            Анх 2026 оны 4-р сарын 26 орчим зарлагдсан; одоо 2026 оны 11-р сарын
            28–29-нд товлогдсон.
          </p>
          <ul className="mt-3 space-y-1 text-sm">
            <li>
              Instagram:{" "}
              <a
                href={ANNOUNCE_IG}
                target="_blank"
                rel="noopener noreferrer"
                className="text-theater-gold-soft hover:underline break-all"
              >
                {ANNOUNCE_IG}
              </a>
            </li>
            <li>
              Facebook:{" "}
              <a
                href={ANNOUNCE_FB}
                target="_blank"
                rel="noopener noreferrer"
                className="text-theater-gold-soft hover:underline break-all"
              >
                {ANNOUNCE_FB}
              </a>
            </li>
          </ul>
        </section>

        {/* Expect / bring */}
        <section className="rounded-2xl border border-theater-border bg-theater-elevated/60 p-6">
          <h2 className="text-sm uppercase tracking-wider text-theater-gold">
            What to expect / Юу хүлээх вэ
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-theater-cream/90 list-disc pl-5">
            <li>Live audition / workshop · Амьд сонсгол / воркшоп</li>
            <li>
              What to bring: TBA — follow Cirque du Soleil Casting instructions ·
              Юу авчрах: удахгүй — Cirque Casting-ийн зааврыг дагана
            </li>
            <li>
              External recording is usually not allowed · Гаднаас бичлэг хийхийг
              ихэвчлэн зөвшөөрдөггүй
            </li>
          </ul>
        </section>
      </div>

      <p className="mt-10 text-sm text-theater-muted">
        <Link href="/" className="text-theater-gold-soft hover:underline">
          ← Back to home
        </Link>
      </p>
    </div>
  );
}
