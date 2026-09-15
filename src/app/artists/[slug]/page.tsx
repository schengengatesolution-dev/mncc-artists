import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ArtistDossier } from "@/components/ArtistDossier";

type Props = { params: { slug: string }; searchParams: { registered?: string } };

/** Fields safe for public dossiers — email/phone intentionally omitted. */
const publicSelect = {
  slug: true,
  fullLegalName: true,
  stageName: true,
  nationality: true,
  actTypes: true,
  actTitle: true,
  bioEn: true,
  bioMn: true,
  videoUrls: true,
  videoFileUrls: true,
  photoUrls: true,
  photosDriveUrl: true,
  resumeUrl: true,
  resumeDriveUrl: true,
  yearsExperience: true,
  availabilityWindow: true,
  preferredRegions: true,
  desiredFeeNote: true,
  techRider: true,
  agency: true,
} as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const artist = await prisma.artist.findUnique({
    where: { slug: params.slug },
    select: { stageName: true, fullLegalName: true },
  });
  if (!artist) return { title: "Artist" };
  const name = artist.stageName || artist.fullLegalName;
  return { title: `${name} — Artist dossier` };
}

export default async function ArtistPage({ params, searchParams }: Props) {
  const artist = await prisma.artist.findUnique({
    where: { slug: params.slug },
    select: publicSelect,
  });
  if (!artist) notFound();

  return (
    <ArtistDossier
      artist={artist}
      showPrivateContact={false}
      showRegisteredBanner={searchParams.registered === "1"}
    />
  );
}
