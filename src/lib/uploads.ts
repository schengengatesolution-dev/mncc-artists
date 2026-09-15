import { put } from "@vercel/blob";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";

/** Clear client-facing upload failures (size / storage). */
export class UploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UploadError";
  }
}

/** Without Blob, data-URL fallback must fit Vercel ~4.5MB request + DB size. */
const PHOTO_MAX = 1.5 * 1024 * 1024; // 1.5MB
const RESUME_MAX = 4 * 1024 * 1024; // 4MB
const VIDEO_MAX = 1.5 * 1024 * 1024; // 1.5MB
const DEFAULT_MAX = 1.5 * 1024 * 1024;

function maxBytesForFolder(folder: string): number {
  if (folder === "photos") return PHOTO_MAX;
  if (folder === "resumes") return RESUME_MAX;
  if (folder === "videos") return VIDEO_MAX;
  return DEFAULT_MAX;
}

function maxLabel(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return Number.isInteger(mb) ? `${mb}MB` : `${mb.toFixed(1)}MB`;
}

function safeName(original: string): string {
  const base = original.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
  const id = randomBytes(6).toString("hex");
  return `${id}-${base || "file"}`;
}

function isReadonlyFsError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const code = (err as NodeJS.ErrnoException).code;
  return code === "EROFS" || code === "EACCES" || code === "EPERM";
}

function toDataUrl(file: File, buf: Buffer): string {
  const mime = file.type || "application/octet-stream";
  return `data:${mime};base64,${buf.toString("base64")}`;
}

function assertDataUrlSize(file: File, name: string, buf: Buffer, folder: string) {
  const maxBytes = maxBytesForFolder(folder);
  if (buf.length > maxBytes) {
    throw new UploadError(
      `File "${file.name || name}" is too large (max ${maxLabel(maxBytes)} for ${folder} without Blob). ` +
        `Set BLOB_READ_WRITE_TOKEN on Vercel for larger durable uploads.`
    );
  }
}

/**
 * Upload to Vercel Blob when BLOB_READ_WRITE_TOKEN is set.
 * Otherwise try local public/uploads (dev). On read-only FS (Vercel serverless)
 * or when local write fails with EROFS/EACCES, store a data: URL for MVP sizes.
 */
export async function uploadFile(
  file: File,
  folder = "artists"
): Promise<string> {
  const name = safeName(file.name);
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const buf = Buffer.from(await file.arrayBuffer());

  if (token) {
    const blob = await put(`${folder}/${name}`, file, {
      access: "public",
      token,
    });
    return blob.url;
  }

  try {
    const dir = path.join(process.cwd(), "public", "uploads", folder);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, name), buf);
    return `/uploads/${folder}/${name}`;
  } catch (err) {
    if (isReadonlyFsError(err)) {
      assertDataUrlSize(file, name, buf, folder);
      return toDataUrl(file, buf);
    }
    // Unexpected FS error: prefer data-URL MVP over 500 when size is OK
    console.warn("uploadFile local write failed; using data URL", err);
    assertDataUrlSize(file, name, buf, folder);
    return toDataUrl(file, buf);
  }
}
