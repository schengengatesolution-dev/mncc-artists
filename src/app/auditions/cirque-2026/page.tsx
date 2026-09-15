import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "2026 Cirque Du Soleil Audition",
  description:
    "2026 Cirque Du Soleil Audition / Нарны Цирк 2026 Сонгон Шалгаруулалт — working dates 28–29 November 2026, Ulaanbaatar. Apply via Cirque du Soleil Casting.",
};

const CDS_CASTING = "https://casting.cirquedusoleil.com/";
const CDS_DIRECT_APPLY =
  "https://casting.my.salesforce-sites.com/ene/ts2mmx__JobDetails?jobId=a0xOF00000PeRRJYA3&tSource=";
const ANNOUNCE_IG = "https://www.instagram.com/p/DWj-9q0D1tx/";
const ANNOUNCE_FB = "https://www.facebook.com/share/p/18QkeCGBZY/";

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
        <a
          href={CDS_CASTING}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-theater-gold px-5 py-2.5 text-sm font-semibold text-theater-bg hover:bg-theater-gold-soft transition"
        >
          Apply on Cirque Casting / CDS Casting-д бүртгүүлэх
        </a>
        <Link
          href="/register"
          className="rounded-full border border-theater-border px-5 py-2.5 text-sm text-theater-cream hover:border-theater-gold transition"
        >
          Also register MNCC dossier / МНСС досье бүртгүүлэх
        </Link>
      </div>

      <div className="mt-10 space-y-6">
        {/* Dates */}
        <section className="rounded-2xl border border-theater-border bg-theater-elevated/60 p-6">
          <h2 className="text-sm uppercase tracking-wider text-theater-gold">
            Dates / Огноо
          </h2>
          <p className="mt-3 text-theater-cream/90 font-medium">
            Working public dates:{" "}
            <span className="text-theater-gold-soft">
              28–29 November 2026 (Saturday–Sunday)
            </span>
          </p>
          <p className="mt-2 text-theater-cream/90 font-medium">
            Ажиллаж буй олон нийтийн огноо:{" "}
            <span className="text-theater-gold-soft">
              2026 оны 11-р сарын 28–29 (Бямба–Ням)
            </span>
          </p>
          <p className="mt-4 text-sm text-theater-muted leading-relaxed">
            Venue agreement is still being finalized with Cirque du Soleil;
            MNCC is promoting these working dates. The earlier July 2026 timing
            was postponed to November.
          </p>
          <p className="mt-2 text-sm text-theater-muted leading-relaxed">
            Байршлын гэрээ Cirque du Soleil-тай эцэслэгдэж байна; МНСС эдгээр
            огноог сурталчилж байна. Өмнө төлөвлөсөн 2026 оны 7-р сарын хугацаа
            11-р сар руу хойшилсон.
          </p>
        </section>

        {/* Location */}
        <section className="rounded-2xl border border-theater-border bg-theater-elevated/60 p-6">
          <h2 className="text-sm uppercase tracking-wider text-theater-gold">
            Location / Байршил
          </h2>
          <p className="mt-3 text-theater-cream/90">
            Ulaanbaatar, Mongolia — gymnasium / arena (same gym previously
            visited for Cirque Casting coordination).
          </p>
          <p className="mt-2 text-theater-cream/90">
            Улаанбаатар, Монгол — биеийн тамирын заал / талбай (Cirque Casting-тай
            зохицуулалт хийхэд зочилсон ижил заал).
          </p>
          <p className="mt-4 text-sm text-theater-gold-soft font-medium">
            Exact venue name & street: TBA / to be announced
          </p>
          <p className="mt-1 text-sm text-theater-gold-soft font-medium">
            Нарийн байршлын нэр, гудамж: удахгүй зарлана (TBA)
          </p>
        </section>

        {/* Register / apply */}
        <section className="rounded-2xl border border-theater-border bg-theater-elevated/60 p-6">
          <h2 className="text-sm uppercase tracking-wider text-theater-gold">
            Register / Apply · Бүртгэл / Өргөдөл
          </h2>
          <p className="mt-3 text-sm text-theater-muted leading-relaxed">
            Primary path: apply through official Cirque du Soleil Casting.
            / Гол зам: Cirque du Soleil Casting албан ёсны сайтаар бүртгүүлнэ.
          </p>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a
                href={CDS_CASTING}
                target="_blank"
                rel="noopener noreferrer"
                className="text-theater-gold-soft hover:underline break-all"
              >
                {CDS_CASTING}
              </a>
              <span className="block text-theater-muted mt-0.5">
                Official Cirque Casting portal / Албан ёсны Casting портал
              </span>
            </li>
            <li>
              <a
                href={CDS_DIRECT_APPLY}
                target="_blank"
                rel="noopener noreferrer"
                className="text-theater-gold-soft hover:underline break-all"
              >
                Direct job application link (from Cirque Casting)
              </a>
              <span className="block text-theater-muted mt-0.5">
                Шууд өргөдлийн холбоос (Cirque Casting-аас). Whether this jobId
                remains valid for the November dates is unknown — please confirm
                on CDS Casting and watch MNCC updates. / Энэ jobId 11-р сарын
                огноонд хүчинтэй эсэх тодорхойгүй — CDS Casting болон МНСС
                шинэчлэлтийг шалгана уу.
              </span>
            </li>
          </ul>

          <div className="mt-5 rounded-xl border border-theater-border/80 bg-theater-bg/40 p-4 text-sm text-theater-muted leading-relaxed space-y-2">
            <p>
              The April 2026 deadline (26 Apr) applied to the{" "}
              <em>previous July</em> timing and is superseded. Applicants already
              accepted for that earlier round will be re-contacted (per Cirque
              Casting). New applicants should use the official apply links above.
            </p>
            <p>
              2026 оны 4-р сарын 26-ны хугацаа нь{" "}
              <em>өмнөх 7-р сарын</em> хуваарьт хамааралтай байсан бөгөөд одоо
              хүчингүй. Тэр үед хүлээн зөвшөөрөгдсөн өргөдөл гаргагчдад дахин
              холбогдох болно (Cirque Casting-ийн дагуу). Шинэ өргөдөл гаргагчид
              дээрх албан ёсны холбоосыг ашиглана.
            </p>
          </div>

          <p className="mt-5 text-sm text-theater-muted">
            Announcement posts / Зарлалын нийтлэл:
          </p>
          <ul className="mt-2 space-y-1 text-sm">
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

          <p className="mt-5 text-sm text-theater-cream/90">
            Secondary: also create your MNCC artist dossier so MNCC can support
            you.{" "}
            <Link
              href="/register"
              className="text-theater-gold-soft hover:underline"
            >
              Register at /register
            </Link>
          </p>
          <p className="mt-1 text-sm text-theater-muted">
            Нэмэлт: МНСС таныг дэмжихийн тулд уран бүтээлчийн досье бүртгүүлнэ үү.{" "}
            <Link
              href="/register"
              className="text-theater-gold-soft hover:underline"
            >
              /register хуудас
            </Link>
          </p>
        </section>

        {/* Expect / bring */}
        <section className="rounded-2xl border border-theater-border bg-theater-elevated/60 p-6">
          <h2 className="text-sm uppercase tracking-wider text-theater-gold">
            What to expect / Юу хүлээх вэ
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-theater-cream/90 list-disc pl-5">
            <li>
              Live audition / workshop · Амьд сонсгол / воркшоп
            </li>
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

        {/* Promotion */}
        <section className="rounded-2xl border border-theater-border bg-theater-elevated/60 p-6">
          <h2 className="text-sm uppercase tracking-wider text-theater-gold">
            Promotion / Сурталчилгаа
          </h2>
          <p className="mt-3 text-sm text-theater-muted leading-relaxed">
            MNCC plans video / Instagram / Facebook promotion in October–November
            (subject to Cirque du Soleil).
          </p>
          <p className="mt-2 text-sm text-theater-muted leading-relaxed">
            МНСС 10–11-р сард видео / Instagram / Facebook сурталчилгаа төлөвлөж
            байна (Cirque du Soleil-ийн зөвшөөрлөөс хамаарна).
          </p>
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
