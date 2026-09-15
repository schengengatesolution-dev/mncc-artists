import Link from "next/link";
import Image from "next/image";
import { MNCC_EMAIL, MNCC_FACEBOOK } from "@/lib/constants";

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <Image
            src="/mncc-poster.jpg"
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-theater-bg/70 via-theater-bg/85 to-theater-bg" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 py-20 sm:py-28">
          <p className="text-theater-gold text-sm font-semibold tracking-[0.2em] uppercase">
            Mongolian New Circus Center
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl sm:text-5xl font-semibold tracking-tight text-theater-cream text-balance">
            Circus Artist Resource
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-theater-gold-soft/90 text-balance">
            Register once; MNCC presents you to festivals and contracts
            worldwide.
          </p>
          <p className="mt-3 max-w-2xl text-base text-theater-muted text-balance">
            Нэг удаа бүртгүүлээд — МНСС таныг дэлхийн фестиваль, гэрээ хэлэлцээрүүдэд
            танилцуулна.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/register"
              className="rounded-full bg-theater-gold px-6 py-3 text-base font-semibold text-theater-bg hover:bg-theater-gold-soft transition"
            >
              Register as artist / Уран бүтээлчээр бүртгүүлэх
            </Link>
            <a
              href={`mailto:${MNCC_EMAIL}`}
              className="rounded-full border border-theater-border px-6 py-3 text-base text-theater-cream hover:border-theater-gold transition"
            >
              Contact MNCC
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 grid gap-8 sm:grid-cols-3">
        {[
          {
            en: "One registration",
            mn: "Нэг бүртгэл",
            body: "Bio, videos, photos, and CV in one shareable dossier.",
          },
          {
            en: "Festival & casting ready",
            mn: "Фестиваль, кастингд бэлэн",
            body: "MNCC sends your pack to partners worldwide.",
          },
          {
            en: "Privacy first",
            mn: "Хувийн мэдээлэл хамгаалалттай",
            body: "Public dossiers hide your phone — contact via MNCC only.",
          },
        ].map((card) => (
          <div
            key={card.en}
            className="rounded-2xl border border-theater-border bg-theater-elevated/60 p-6"
          >
            <h2 className="text-lg font-semibold text-theater-gold-soft">
              {card.en}
            </h2>
            <p className="text-sm text-theater-muted mt-1">{card.mn}</p>
            <p className="mt-3 text-sm text-theater-cream/80">{card.body}</p>
          </div>
        ))}
      </section>

      <section className="border-t border-theater-border bg-theater-elevated/40">
        <div className="mx-auto max-w-5xl px-4 py-12 text-center">
          <p className="text-theater-muted text-sm">
            Questions?{" "}
            <a
              href={`mailto:${MNCC_EMAIL}`}
              className="text-theater-gold-soft hover:underline"
            >
              {MNCC_EMAIL}
            </a>{" "}
            ·{" "}
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
      </section>
    </div>
  );
}
