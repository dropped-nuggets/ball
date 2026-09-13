"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Panel } from "./Frame";
import Sigil from "./Sigil";

export default function LoginClient() {
  const router = useRouter();
  const [passphrase, setPassphrase] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passphrase }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "That's not it.");
        return;
      }

      router.replace("/");
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Panel dark className="relative w-full max-w-sm p-8 text-center">
      <div className="flex justify-center">
        <Sigil size={110} />
      </div>

      <p className="mt-5 text-[11px] tracking-[0.3em] text-moss/70">
        ज्वजलपा
      </p>
      <h1 className="mt-2 font-display text-3xl tracking-[0.22em] text-gilt">
        RIJUKO
      </h1>
      <p className="mt-2 text-xs text-blossom/50">
        This part's just for you.
      </p>

      <form onSubmit={onSubmit} className="mt-7 space-y-3">
        <input
          type="password"
          value={passphrase}
          onChange={(e) => setPassphrase(e.target.value)}
          placeholder="passphrase"
          autoFocus
          className="field w-full px-3 py-2.5 text-center text-sm"
        />

        {error && <p className="text-sm text-seal-brick">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="btn-violet w-full py-2.5 text-sm"
        >
          {busy ? "..." : "Come in"}
        </button>
      </form>

      <div className="gilt-rule my-6" />

      <p className="text-xs leading-relaxed text-blossom/45">
        Here to write her a letter?{" "}
        <Link
          href="/write"
          className="text-moss underline underline-offset-2 hover:text-fern"
        >
          That way →
        </Link>
      </p>
    </Panel>
  );
}
