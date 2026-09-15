"use client";

type Props = {
  url: string;
  label?: string;
  className?: string;
};

function filenameFromMime(mime: string): string {
  const m = mime.toLowerCase().split(";")[0].trim();
  if (m === "application/pdf") return "resume.pdf";
  if (
    m ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    m === "application/docx"
  ) {
    return "resume.docx";
  }
  if (m === "application/msword" || m === "application/doc") {
    return "resume.doc";
  }
  if (m.startsWith("image/")) {
    const ext = m.split("/")[1]?.replace("jpeg", "jpg") || "bin";
    return `resume.${ext}`;
  }
  return "resume.bin";
}

function downloadDataUrl(dataUrl: string) {
  const match = /^data:([^;,]+)?((?:;[^;,]+)*);base64,([\s\S]*)$/i.exec(
    dataUrl
  );
  if (!match) {
    // Non-base64 data URL — open/navigate as last resort
    window.open(dataUrl, "_blank", "noopener,noreferrer");
    return;
  }
  const mime = (match[1] || "application/octet-stream").trim();
  const b64 = match[3];
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const blob = new Blob([bytes], { type: mime });
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filenameFromMime(mime);
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Revoke after the browser has started the download
  setTimeout(() => URL.revokeObjectURL(objectUrl), 2_000);
}

export function ResumeDownloadButton({
  url,
  label = "Download resume / CV / Намтар",
  className = "inline-flex items-center rounded-full border border-theater-gold/50 bg-theater-gold/10 px-4 py-2 text-sm text-theater-gold-soft hover:border-theater-gold hover:bg-theater-gold/20",
}: Props) {
  const isHttp =
    url.startsWith("https://") ||
    url.startsWith("http://") ||
    url.startsWith("/");
  const isData = url.startsWith("data:");

  if (isHttp) {
    return (
      <a
        href={url}
        download
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {label}
      </a>
    );
  }

  if (isData) {
    return (
      <button
        type="button"
        onClick={() => downloadDataUrl(url)}
        className={className}
      >
        {label}
      </button>
    );
  }

  // Unknown scheme — still try as link
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {label}
    </a>
  );
}
