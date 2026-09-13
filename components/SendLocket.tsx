"use client";

import { useRef, useState } from "react";
import { Panel } from "./Frame";
import { resizeToDataUrl } from "@/lib/resizeImage";

/**
 * Public: anyone with the link can send her a photo.
 *
 * Images are downscaled in the browser and posted as data URLs rather than
 * handing anonymous callers a Blob upload token — an anonymous writer should
 * never be able to run up storage costs (SEC-22).
 */
export default function SendLocket() {
  const [sentBy, setSentBy] = useState("");
  const [note, setNote] = useState("");
  const [preview, setPreview] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    try {
      // Small on purpose: it's a keepsake thumbnail, not an archive copy.
      setPreview(await resizeToDataUrl(file, 900, 0.72));
    } catch {
      setError("Couldn't read that image. Try another?");
    }
  }

  async function send(e: React.FormEvent) {
    e.preventDefault();

    if (!preview) {
      setError("Pick a photo first.");
      return;
    }
    if (!sentBy.trim()) {
      setError("Tell her who it's from.");
      return;
    }

    setBusy(true);
    setError("");

    try {
      const res = await fetch("/api/locket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: preview, note, sentBy }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not send.");
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send.");
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <Panel dark className="anim-rise p-7 text-center">
        <p className="font-display text-2xl text-gilt">Sent 💜</p>
        <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-blossom/60">
          It'll be waiting on her home page. She'll know someone was thinking
          about her without having to ask.
        </p>
        <button
          onClick={() => {
            setSent(false);
            setPreview("");
            setNote("");
            if (fileRef.current) fileRef.current.value = "";
          }}
          className="btn-violet mt-6 px-6 py-2.5 text-sm"
        >
          Send another
        </button>
      </Panel>
    );
  }

  return (
    <Panel dark className="p-6">
      <p className="font-display text-xl text-gilt">Or send her a photo</p>
      <p className="mt-1 text-sm text-blossom/55">
        Whatever you're looking at right now. It lands on her home page.
      </p>

      <form onSubmit={send} className="mt-4 space-y-3">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={onPick}
          className="field w-full px-3 py-2.5 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-violet/20 file:px-3 file:py-1.5 file:text-sm file:text-ink"
        />

        {preview && (
          <div className="overflow-hidden rounded-xl border border-gilt/25">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Your photo"
              className="max-h-56 w-full object-cover"
            />
          </div>
        )}

        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Say something (optional)"
          maxLength={200}
          className="field w-full px-3 py-2.5 text-sm"
        />
        <input
          value={sentBy}
          onChange={(e) => setSentBy(e.target.value)}
          placeholder="Your name"
          maxLength={80}
          className="field w-full px-3 py-2.5 text-sm"
        />

        {error && <p className="text-sm text-seal-brick">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="btn-violet w-full py-2.5 text-sm"
        >
          {busy ? "Sending..." : "Send it"}
        </button>
      </form>
    </Panel>
  );
}
