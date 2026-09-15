import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadFile } from "@/lib/uploads";
import { toJsonArray } from "@/lib/json";
import { uniqueSlug } from "@/lib/slug";
import { BIO_EN_MAX } from "@/lib/constants";

export const runtime = "nodejs";

function isVideoUrl(url: string): boolean {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    return (
      host.includes("youtube.com") ||
      host === "youtu.be" ||
      host.includes("vimeo.com")
    );
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  try {
    const fd = await req.formData();

    const fullLegalName = String(fd.get("fullLegalName") || "").trim();
    const stageName = String(fd.get("stageName") || "").trim() || null;
    const email = String(fd.get("email") || "").trim();
    const phone = String(fd.get("phone") || "").trim();
    const nationality = String(fd.get("nationality") || "").trim();
    const actTitle = String(fd.get("actTitle") || "").trim();
    const bioEn = String(fd.get("bioEn") || "").trim();
    const bioMn = String(fd.get("bioMn") || "").trim() || null;
    const consent = fd.get("consent") === "yes";
    const actTypes = fd.getAll("actTypes").map(String).filter(Boolean);
    const preferredRegions = fd
      .getAll("preferredRegions")
      .map(String)
      .filter(Boolean);

    const videoUrls: string[] = [];
    for (let i = 1; i <= 6; i++) {
      const v = String(fd.get(`videoUrl${i}`) || "").trim();
      if (v) videoUrls.push(v);
    }

    const yearsRaw = String(fd.get("yearsExperience") || "").trim();
    const yearsExperience = yearsRaw ? parseInt(yearsRaw, 10) : null;
    const availabilityWindow =
      String(fd.get("availabilityWindow") || "").trim() || null;
    const desiredFeeNote =
      String(fd.get("desiredFeeNote") || "").trim() || null;
    const techRider = String(fd.get("techRider") || "").trim() || null;
    const agency = String(fd.get("agency") || "").trim() || null;

    if (!fullLegalName || !email || !phone || !nationality || !actTitle) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }
    if (actTypes.length === 0) {
      return NextResponse.json(
        { error: "Select at least one act type." },
        { status: 400 }
      );
    }
    if (!bioEn || bioEn.length > BIO_EN_MAX) {
      return NextResponse.json(
        { error: `Bio EN required (max ${BIO_EN_MAX} chars).` },
        { status: 400 }
      );
    }
    if (videoUrls.length === 0 || !isVideoUrl(videoUrls[0])) {
      return NextResponse.json(
        { error: "Provide at least one YouTube or Vimeo URL." },
        { status: 400 }
      );
    }
    if (!consent) {
      return NextResponse.json(
        { error: "Consent is required." },
        { status: 400 }
      );
    }

    const photoFiles = fd
      .getAll("photos")
      .filter((f): f is File => f instanceof File && f.size > 0);
    if (photoFiles.length === 0) {
      return NextResponse.json(
        { error: "Upload at least one photo." },
        { status: 400 }
      );
    }
    if (photoFiles.length > 8) {
      return NextResponse.json(
        { error: "Maximum 8 photos." },
        { status: 400 }
      );
    }

    const resume = fd.get("resume");
    if (!(resume instanceof File) || resume.size === 0) {
      return NextResponse.json(
        { error: "Resume/CV is required." },
        { status: 400 }
      );
    }

    const photoUrls: string[] = [];
    for (const file of photoFiles.slice(0, 8)) {
      photoUrls.push(await uploadFile(file, "photos"));
    }

    const resumeUrl = await uploadFile(resume, "resumes");

    const videoFileInputs = fd
      .getAll("videoFiles")
      .filter((f): f is File => f instanceof File && f.size > 0);
    const videoFileUrls: string[] = [];
    for (const file of videoFileInputs.slice(0, 5)) {
      videoFileUrls.push(await uploadFile(file, "videos"));
    }

    const baseName = stageName || fullLegalName;
    const slug = await uniqueSlug(baseName, async (s) => {
      const found = await prisma.artist.findUnique({ where: { slug: s } });
      return !!found;
    });

    const artist = await prisma.artist.create({
      data: {
        slug,
        fullLegalName,
        stageName,
        email,
        phone,
        nationality,
        actTypes: toJsonArray(actTypes),
        actTitle,
        bioEn,
        bioMn,
        videoUrls: toJsonArray(videoUrls.slice(0, 6)),
        videoFileUrls: toJsonArray(videoFileUrls),
        photoUrls: toJsonArray(photoUrls),
        resumeUrl,
        yearsExperience:
          yearsExperience !== null && !Number.isNaN(yearsExperience)
            ? yearsExperience
            : null,
        availabilityWindow,
        preferredRegions: toJsonArray(preferredRegions),
        desiredFeeNote,
        techRider,
        agency,
        consent: true,
      },
    });

    return NextResponse.json({ slug: artist.slug, id: artist.id });
  } catch (err) {
    console.error("register error", err);
    return NextResponse.json(
      { error: "Server error during registration." },
      { status: 500 }
    );
  }
}
