"use client";

import { useState } from "react";
import { Panel } from "./Frame";
import Sigil from "./Sigil";

export default function WriteClient() {
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!author.trim()) {
      setError("Sign it, so she knows who it's from.");
      return;
    }
    if (!body.trim()) {
      setError("Write something first.");
      return;
    }

    setBusy(true);
    setError("");

    try {
      const res = await fetch("/api/letters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author, body, direction: "to-her" }),
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
      <Panel dark className="anim-rise p-10 text-center">
        <div className="flex justify-center">
          <Sigil size={110} />
        </div>
        <h2 className="mt-6 font-display text-3xl text-gilt">Sealed.</h2>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-blossom/60">
          It's waiting for her now. She'll see the wax and know someone from
          home was thinking about her.
        </p>
        <button
          onClick={() => {
            setSent(false);
            setBody("");
          }}
          className="btn-violet mt-7 px-6 py-2.5 text-sm"
        >
          Write another
        </button>
      </Panel>
    );
  }

  return (
    <Panel className="anim-rise p-6 sm:p-8">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="author"
            className="mb-1.5 block text-xs tracking-[0.16em] text-ink/50"
          >
            FROM
          </label>
          <input
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Your name"
            maxLength={80}
            className="field w-full px-3 py-2.5 text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="body"
            className="mb-1.5 block text-xs tracking-[0.16em] text-ink/50"
          >
            THE LETTER
          </label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Riju,&#10;&#10;"
            rows={11}
            maxLength={20000}
            className="field letter-body w-full resize-y px-4 py-3"
          />
          <p className="mt-1.5 text-right text-[11px] text-ink/35">
            {body.length.toLocaleString()} / 20,000
          </p>
        </div>

        {error && <p className="text-sm text-seal-brick">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="btn-violet w-full py-3 text-sm"
        >
          {busy ? "Sealing..." : "Seal and send"}
        </button>

        <p className="text-center text-[11px] leading-relaxed text-ink/40">
          Only she can read this. You can't take it back, so mean it.
        </p>
      </form>
    </Panel>
  );
}
