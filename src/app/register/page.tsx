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
        Videos: Google Drive original files only (Anyone with the link → Viewer). CV: no personal contact — clients reach MNCC only.
        / Видео: зөвхөн Google Drive эх файл. CV: хувийн холбоо барих мэдээлэлгүй — үйлчлүүлэгч Шинэ цирк төвтэй холбогдоно.
      </p>
      <div className="mt-8">
        <RegisterForm />
      </div>
    </div>
  );
}
