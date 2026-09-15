import { put } from "@vercel/blob";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";

function safeName(original: string): string {
  const base = original.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
  const id = randomBytes(6).toString("hex");
  return `${id}-${base || "file"}`;
}

/** Upload to Vercel Blob when token set; else local public/uploads. */
export async function uploadFile(
  file: File,
  folder = "artists"
): Promise<string> {
  const name = safeName(file.name);
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (token) {
    const blob = await put(`${folder}/${name}`, file, {
      access: "public",
      token,
    });
    return blob.url;
  }

  const dir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(dir, { recursive: true });
  const buf = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, name), buf);
  return `/uploads/${folder}/${name}`;
}
