import type { Metadata } from "next";
import { RegisterForm } from "@/components/RegisterForm";

export const metadata: Metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold text-theater-cream">
        Artist registration
      </h1>
      <p className="mt-2 text-theater-muted">
        Уран бүтээлчийн бүртгэл — fill once; MNCC builds your shareable artist profile.
      </p>
      <p className="mt-3 text-sm text-theater-cream/80">
        Private phone &amp; email go to MNCC admin only — never on the public dossier.
        Videos: Google Drive original files only. CV: no personal contact — clients reach MNCC only.
        / Хувийн утас, имэйл зөвхөн админд. Видео: Google Drive. CV: хувийн холбоо барихгүй.
      </p>
      <div className="mt-8">
        <RegisterForm />
      </div>
    </div>
  );
}
