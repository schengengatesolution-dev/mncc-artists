import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { parseJsonArray } from "@/lib/json";
import { AdminLogout } from "@/components/AdminLogout";
import { DeleteArtistButton } from "@/components/DeleteArtistButton";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const artists = await prisma.artist.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-theater-cream">
            Artists
          </h1>
          <p className="text-sm text-theater-muted mt-1">
            {artists.length} registered
          </p>
        </div>
        <AdminLogout />
      </div>

      <div className="mt-6 rounded-xl border border-theater-gold/40 bg-theater-gold/10 px-4 py-3 text-sm text-theater-gold-soft">
        <strong>Contact artist (admin only)</strong> — email &amp; phone below are private.
        Public dossiers never show them. / Доорх имэйл, утас зөвхөн админд.
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-theater-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-theater-elevated text-theater-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Act</th>
              <th className="px-4 py-3 font-medium">Types</th>
              <th className="px-4 py-3 font-medium">Private email</th>
              <th className="px-4 py-3 font-medium">Private phone</th>
              <th className="px-4 py-3 font-medium">CV</th>
              <th className="px-4 py-3 font-medium">Dossier</th>
            </tr>
          </thead>
          <tbody>
            {artists.map((a) => (
              <tr key={a.id} className="border-t border-theater-border">
                <td className="px-4 py-3">
                  {a.stageName || a.fullLegalName}
                </td>
                <td className="px-4 py-3 text-theater-muted">{a.actTitle}</td>
                <td className="px-4 py-3 text-theater-muted">
                  {parseJsonArray(a.actTypes).join(", ")}
                </td>
                <td className="px-4 py-3">
                  <a
                    href={`mailto:${a.email}`}
                    className="text-theater-gold-soft hover:underline break-all"
                  >
                    {a.email}
                  </a>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <a
                    href={`tel:${a.phone.replace(/\s/g, "")}`}
                    className="text-theater-gold-soft hover:underline"
                  >
                    {a.phone}
                  </a>
                </td>
                <td className="px-4 py-3">
                  {a.resumeUrl ? (
                    <span
                      className="rounded-full border border-theater-gold/40 px-2 py-0.5 text-xs text-theater-gold-soft"
                      title="Resume / CV on file"
                    >
                      CV
                    </span>
                  ) : (
                    <span className="text-theater-muted">—</span>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <Link
                    href={`/admin/artists/${a.slug}`}
                    className="text-theater-gold-soft hover:underline"
                  >
                    Open
                  </Link>
                  {" · "}
                  <Link
                    href={`/artists/${a.slug}`}
                    className="text-theater-muted hover:underline"
                    target="_blank"
                  >
                    Public
                  </Link>
                  {" · "}
                  <DeleteArtistButton slug={a.slug} />
                </td>
              </tr>
            ))}
            {artists.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-theater-muted"
                >
                  No artists yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
