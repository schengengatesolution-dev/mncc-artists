"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-full border border-theater-border px-4 py-2 text-sm hover:border-theater-gold"
    >
      Print / PDF
    </button>
  );
}
