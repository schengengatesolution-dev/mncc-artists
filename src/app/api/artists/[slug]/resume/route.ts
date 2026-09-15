import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Ctx = { params: { slug: string } };

function filenameFromMime(mime: string): string {
  const m = mime.toLowerCase().split(";")[0].trim();
  if (m === "application/pdf") return "resume.pdf";
  if (
    m ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return "resume.docx";
  }
  if (m === "application/msword") return "resume.doc";
  return "resume.bin";
}

/**
 * GET /api/artists/[slug]/resume
 * Redirects to blob/http URLs, or streams data:-URL bytes with Content-Disposition.
 */
export async function GET(_req: Request, { params }: Ctx) {
  const artist = await prisma.artist.findUnique({
    where: { slug: params.slug },
    select: { resumeUrl: true, slug: true },
  });
  if (!artist?.resumeUrl) {
    return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  }

  const url = artist.resumeUrl;

  if (url.startsWith("https://") || url.startsWith("http://")) {
    return NextResponse.redirect(url);
  }
  if (url.startsWith("/")) {
    return NextResponse.redirect(new URL(url, _req.url));
  }

  if (url.startsWith("data:")) {
    const match = /^data:([^;,]+)?((?:;[^;,]+)*);base64,([\s\S]*)$/i.exec(url);
    if (!match) {
      return NextResponse.json(
        { error: "Unsupported data URL encoding" },
        { status: 415 }
      );
    }
    const mime = (match[1] || "application/octet-stream").trim();
    const buf = Buffer.from(match[3], "base64");
    const filename = filenameFromMime(mime);
    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": mime,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(buf.length),
        "Cache-Control": "private, max-age=3600",
      },
    });
  }

  return NextResponse.json({ error: "Unsupported resume URL" }, { status: 415 });
}
