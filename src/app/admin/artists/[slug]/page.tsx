import { notFound, redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { ArtistDossier } from "@/components/ArtistDossier";

export const dynamic = "force-dynamic";

type Props = { params: { slug: string } };

export default async function AdminArtistPage({ params }: Props) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const artist = await prisma.artist.findUnique({ where: { slug: params.slug } });
  if (!artist) notFound();

  return <ArtistDossier artist={artist} showPrivateContact />;
}
