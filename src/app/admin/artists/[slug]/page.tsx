import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { ArtistDossier } from "@/components/ArtistDossier";
import { DeleteArtistButton } from "@/components/DeleteArtistButton";

export const dynamic = "force-dynamic";

type Props = { params: { slug: string } };

export default async function AdminArtistPage({ params }: Props) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const artist = await prisma.artist.findUnique({ where: { slug: params.slug } });
  if (!artist) notFound();

  return (
    <div>
      <div className="mx-auto max-w-3xl px-4 pt-8 no-print flex flex-wrap items-center gap-3">
        <Link
          href="/admin"
          className="rounded-full border border-theater-border px-4 py-2 text-sm text-theater-muted hover:text-theater-cream"
        >
          ← Artists
        </Link>
        <DeleteArtistButton slug={artist.slug} variant="button" />
      </div>
      <ArtistDossier artist={artist} showPrivateContact />
    </div>
  );
}
