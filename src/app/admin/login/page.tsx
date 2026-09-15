"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Login failed");
      setBusy(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-20">
      <h1 className="text-2xl font-semibold text-theater-cream">Admin login</h1>
      <p className="mt-2 text-sm text-theater-muted">
        Password from ADMIN_PASSWORD env.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        {error && (
          <p className="text-sm text-red-300 border border-red-500/30 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Admin password"
          className="w-full rounded-lg border border-theater-border bg-theater-bg px-3 py-2"
          required
        />
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-theater-gold py-2.5 font-semibold text-theater-bg disabled:opacity-50"
        >
          {busy ? "…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
