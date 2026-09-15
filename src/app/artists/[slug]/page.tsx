import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ArtistDossier } from "@/components/ArtistDossier";

type Props = { params: { slug: string }; searchParams: { registered?: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const artist = await prisma.artist.findUnique({ where: { slug: params.slug } });
  if (!artist) return { title: "Artist" };
  const name = artist.stageName || artist.fullLegalName;
  return { title: `${name} — Artist dossier` };
}

export default async function ArtistPage({ params, searchParams }: Props) {
  const artist = await prisma.artist.findUnique({ where: { slug: params.slug } });
  if (!artist) notFound();

  return (
    <ArtistDossier
      artist={artist}
      showPrivateContact={false}
      showRegisteredBanner={searchParams.registered === "1"}
    />
  );
}
