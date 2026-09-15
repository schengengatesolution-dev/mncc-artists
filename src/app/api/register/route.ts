import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadFile, UploadError } from "@/lib/uploads";
import { toJsonArray } from "@/lib/json";
import { uniqueSlug } from "@/lib/slug";
import { BIO_EN_MAX } from "@/lib/constants";
import {
  isBlockedVideoHost,
  isGoogleDriveUrl,
  validateGoogleDriveUrl,
} from "@/lib/drive";

export const runtime = "nodejs";
export const maxDuration = 60;

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
    const cvNoContact = fd.get("cvNoContact") === "yes";
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

    const photosDriveUrl =
      String(fd.get("photosDriveUrl") || "").trim() || null;
    const resumeDriveUrl =
      String(fd.get("resumeDriveUrl") || "").trim() || null;

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
    if (videoUrls.length === 0) {
      return NextResponse.json(
        {
          error:
            "Provide at least one Google Drive link to your original video file. / Google Drive видео холбоос заавал.",
        },
        { status: 400 }
      );
    }
    for (const url of videoUrls) {
      if (isBlockedVideoHost(url)) {
        return NextResponse.json(
          {
            error:
              "YouTube and Vimeo links are not accepted. Use Google Drive original file links only. / YouTube, Vimeo хүлээн авахгүй — зөвхөн Google Drive.",
          },
          { status: 400 }
        );
      }
      if (!isGoogleDriveUrl(url)) {
        return NextResponse.json(
          {
            error:
              "Video URLs must be Google Drive share links (drive.google.com or docs.google.com). / Видео холбоос Google Drive байх ёстой.",
          },
          { status: 400 }
        );
      }
    }

    if (photosDriveUrl) {
      const err = validateGoogleDriveUrl(photosDriveUrl, "Photos Drive link");
      if (err) {
        return NextResponse.json({ error: err }, { status: 400 });
      }
    }
    if (resumeDriveUrl) {
      const err = validateGoogleDriveUrl(resumeDriveUrl, "Resume Drive link");
      if (err) {
        return NextResponse.json({ error: err }, { status: 400 });
      }
    }

    if (!cvNoContact) {
      return NextResponse.json(
        {
          error:
            "Confirm that your CV has no personal contact details. / CV-д хувийн холбоо барих мэдээлэл байхгүй гэдгийг батална уу.",
        },
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
    if (photoFiles.length > 8) {
      return NextResponse.json(
        { error: "Maximum 8 photos." },
        { status: 400 }
      );
    }
    if (!photosDriveUrl && photoFiles.length === 0) {
      return NextResponse.json(
        {
          error:
            "Provide a Google Drive photos folder link, or upload at least one photo. / Зургийн Google Drive фолдер холбоос эсвэл зураг оруулна уу.",
        },
        { status: 400 }
      );
    }

    const resume = fd.get("resume");
    const hasResumeFile = resume instanceof File && resume.size > 0;
    if (!resumeDriveUrl && !hasResumeFile) {
      return NextResponse.json(
        {
          error:
            "Provide a Google Drive resume/CV link, or upload a resume file. / CV-ийн Google Drive холбоос эсвэл файл оруулна уу.",
        },
        { status: 400 }
      );
    }

    let photoUrls: string[];
    let resumeUrl: string | null = null;
    try {
      photoUrls = [];
      for (const file of photoFiles.slice(0, 8)) {
        photoUrls.push(await uploadFile(file, "photos"));
      }
      if (hasResumeFile) {
        resumeUrl = await uploadFile(resume as File, "resumes");
      }
    } catch (uploadErr) {
      console.error("register upload error", uploadErr);
      if (uploadErr instanceof UploadError) {
        return NextResponse.json(
          { error: uploadErr.message },
          { status: 400 }
        );
      }
      const detail =
        uploadErr instanceof Error ? uploadErr.message : "unknown upload error";
      const hint = detail.slice(0, 180);
      return NextResponse.json(
        {
          error:
            "Upload failed. Prefer Google Drive links for photos/CV, or use smaller files (photos ≤1.5MB, resume ≤4MB), or set BLOB_READ_WRITE_TOKEN." +
            (hint ? ` (${hint})` : ""),
        },
        { status: 500 }
      );
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
        videoFileUrls: toJsonArray([]),
        photoUrls: toJsonArray(photoUrls),
        photosDriveUrl,
        resumeUrl,
        resumeDriveUrl,
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
    const hint =
      err instanceof Error &&
      /upload|EROFS|EACCES|ENOENT|blob|data:/i.test(err.message)
        ? "Upload or storage failed during registration."
        : "Server error during registration.";
    return NextResponse.json({ error: hint }, { status: 500 });
  }
}
