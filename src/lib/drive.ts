/** Google Drive share-link helpers for MNCC artist registration. */

const BLOCKED_VIDEO_HOSTS = ["youtube.com", "youtu.be", "vimeo.com"];

export function hostnameOf(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

/** True if URL is YouTube, youtu.be, or Vimeo (rejected for video fields). */
export function isBlockedVideoHost(url: string): boolean {
  const host = hostnameOf(url);
  if (!host) return false;
  return BLOCKED_VIDEO_HOSTS.some(
    (b) => host === b || host.endsWith(`.${b}`)
  );
}

/**
 * Accept drive.google.com / docs.google.com file or folder share links.
 * Examples:
 * - https://drive.google.com/file/d/ID/view?usp=sharing
 * - https://drive.google.com/drive/folders/ID?usp=sharing
 * - https://docs.google.com/document/d/ID/edit
 */
export function isGoogleDriveUrl(url: string): boolean {
  const host = hostnameOf(url);
  if (!host) return false;
  return (
    host === "drive.google.com" ||
    host === "docs.google.com" ||
    host.endsWith(".drive.google.com") ||
    host.endsWith(".docs.google.com")
  );
}

export function validateGoogleDriveUrl(
  url: string,
  label = "Google Drive link"
): string | null {
  const trimmed = url.trim();
  if (!trimmed) return `${label} is required.`;
  if (isBlockedVideoHost(trimmed)) {
    return (
      "YouTube and Vimeo links are not accepted. Use a Google Drive link to the original file. " +
      "/ YouTube, Vimeo холбоос хүлээн авахгүй. Google Drive-ийн эх файл/фолдерын холбоос оруулна уу."
    );
  }
  if (!isGoogleDriveUrl(trimmed)) {
    return (
      `${label} must be a Google Drive / Docs share link (drive.google.com or docs.google.com). ` +
      `/ Google Drive / Docs (drive.google.com эсвэл docs.google.com) холбоос байх ёстой.`
    );
  }
  return null;
}

export const DRIVE_SHARE_GUIDE_EN = [
  "Upload the original video file to Google Drive",
  "Share → General access → Anyone with the link → Viewer",
  "Copy the link and paste it below",
  "If access is Restricted, clients cannot open it",
] as const;

export const DRIVE_SHARE_GUIDE_MN = [
  "Эх видео файлыг Google Drive руу байршуулна",
  "Share → General access → Anyone with the link → Viewer",
  "Холбоосыг хуулаад доор буулгана",
  "Restricted болсон бол үйлчлүүлэгч нээж чадахгүй",
] as const;
