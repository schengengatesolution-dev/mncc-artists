"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  slug: string;
  /** Compact text link for table rows; button style for detail page */
  variant?: "link" | "button";
};

export function DeleteArtistButton({ slug, variant = "link" }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    if (!confirm("Delete this artist?")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/artists/${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || `Delete failed (${res.status})`);
        setBusy(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      alert("Delete failed");
      setBusy(false);
    }
  }

  if (variant === "button") {
    return (
      <button
        type="button"
        disabled={busy}
        onClick={onDelete}
        className="rounded-full border border-red-800/60 bg-red-950/40 px-4 py-2 text-sm text-red-300 hover:bg-red-900/50 disabled:opacity-50"
      >
        {busy ? "Deleting…" : "Delete"}
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled={busy}
      onClick={onDelete}
      className="text-red-400 hover:underline disabled:opacity-50"
    >
      {busy ? "…" : "Delete"}
    </button>
  );
}
