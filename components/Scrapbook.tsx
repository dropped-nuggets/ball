"use client";

import { useEffect, useRef, useState } from "react";
import { resizeToDataUrl } from "@/lib/resizeImage";
import type { Photo, Sticker } from "@/lib/types";

/**
 * A free-form photo board for a diary entry.
 *
 * Photos are positioned as percentages of the board rather than pixels, so a
 * layout arranged on a laptop still reads correctly on a phone. Dragging uses
 * pointer events with capture, which covers mouse, touch and pen in one path.
 */
export default function Scrapbook({
  entryId,
  initial,
  albumPhotos,
  blobEnabled,
}: {
  entryId: string;
  initial: Sticker[];
  albumPhotos: Photo[];
  blobEnabled: boolean;
}) {
  const [stickers, setStickers] = useState<Sticker[]>(initial);
  const [selected, setSelected] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [picking, setPicking] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [busy, setBusy] = useState(false);

  const boardRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<{ id: string; dx: number; dy: number } | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dirty = useRef(false);

  const sel = stickers.find((s) => s.id === selected) ?? null;
  const topZ = stickers.reduce((m, s) => Math.max(m, s.z), 0);

  /** Debounced save — dragging fires constantly, so don't PATCH per frame. */
  function queueSave(next: Sticker[]) {
    dirty.current = true;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => void save(next), 700);
  }

  async function save(next: Sticker[]) {
    setStatus("saving");
    try {
      await fetch("/api/diary", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: entryId, stickers: next }),
      });
      dirty.current = false;
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 1600);
    } catch {
      setStatus("idle");
    }
  }

  // Flush any pending layout change if she closes the entry mid-drag.
  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  function update(id: string, patch: Partial<Sticker>) {
    setStickers((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, ...patch } : s));
      queueSave(next);
      return next;
    });
  }

  function addSticker(url: string) {
    const sticker: Sticker = {
      id: `s${Date.now().toString(36)}${Math.floor(Math.random() * 1e4)}`,
      url,
      // Slight offset per photo so a stack doesn't hide underneath itself.
      x: 42 + ((stickers.length * 9) % 22),
      y: 40 + ((stickers.length * 7) % 20),
      w: 34,
      rotate: ((stickers.length * 7) % 17) - 8,
      z: topZ + 1,
      caption: "",
      frame: "polaroid",
    };
    setStickers((prev) => {
      const next = [...prev, sticker];
      queueSave(next);
      return next;
    });
    setSelected(sticker.id);
    setEditing(true);
    setPicking(false);
  }

  function removeSticker(id: string) {
    setStickers((prev) => {
      const next = prev.filter((s) => s.id !== id);
      queueSave(next);
      return next;
    });
    setSelected(null);
  }

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setBusy(true);
    try {
      let url: string;
      if (blobEnabled) {
        const { upload } = await import("@vercel/blob/client");
        const blob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/photos/upload",
        });
        url = blob.url;
      } else {
        url = await resizeToDataUrl(file, 1200, 0.8);
      }
      addSticker(url);
    } catch {
      // Nothing gets added; she can try another photo.
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  /* -------------------------- dragging -------------------------- */

  function onPointerDown(e: React.PointerEvent, sticker: Sticker) {
    if (!editing) return;
    const board = boardRef.current?.getBoundingClientRect();
    if (!board) return;

    e.currentTarget.setPointerCapture(e.pointerId);
    setSelected(sticker.id);

    // Remember the grab offset so the photo doesn't snap its centre to the cursor.
    dragRef.current = {
      id: sticker.id,
      dx: ((e.clientX - board.left) / board.width) * 100 - sticker.x,
      dy: ((e.clientY - board.top) / board.height) * 100 - sticker.y,
    };
  }

  function onPointerMove(e: React.PointerEvent) {
    const drag = dragRef.current;
    const board = boardRef.current?.getBoundingClientRect();
    if (!drag || !board) return;

    const x = ((e.clientX - board.left) / board.width) * 100 - drag.dx;
    const y = ((e.clientY - board.top) / board.height) * 100 - drag.dy;

    setStickers((prev) =>
      prev.map((s) =>
        s.id === drag.id
          ? {
              ...s,
              x: Math.min(105, Math.max(-5, x)),
              y: Math.min(105, Math.max(-5, y)),
            }
          : s,
      ),
    );
  }

  function onPointerUp() {
    if (dragRef.current) {
      dragRef.current = null;
      setStickers((prev) => {
        queueSave(prev);
        return prev;
      });
    }
  }

  /* -------------------------- render -------------------------- */

  const empty = stickers.length === 0;

  if (empty && !editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="mt-4 w-full rounded-xl border border-dashed border-gilt/30 py-4 text-xs text-lilac/50 transition-colors hover:border-gilt/60 hover:text-lilac"
      >
        ＋ stick photos on this entry
      </button>
    );
  }

  return (
    <div className="mt-5">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] tracking-[0.16em] text-lilac/45">
          SCRAPBOOK
          {status === "saving" && " · saving..."}
          {status === "saved" && " · saved ✓"}
        </p>
        <div className="flex items-center gap-2">
          {editing && (
            <>
              <button
                onClick={() => setPicking((p) => !p)}
                className="rounded-full border border-gilt/40 px-3 py-1 text-[11px] text-lilac transition-colors hover:border-gilt"
              >
                from album
              </button>
              <button
                onClick={() => fileRef.current?.click()}
                disabled={busy}
                className="rounded-full border border-gilt/40 px-3 py-1 text-[11px] text-lilac transition-colors hover:border-gilt disabled:opacity-40"
              >
                {busy ? "adding..." : "upload"}
              </button>
            </>
          )}
          <button
            onClick={() => {
              setEditing((v) => !v);
              setSelected(null);
              setPicking(false);
            }}
            className="rounded-full border border-violet/60 bg-violet/20 px-3 py-1 text-[11px] text-lilac transition-colors hover:bg-violet/35"
          >
            {editing ? "done" : "arrange"}
          </button>
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={onUpload}
        className="hidden"
      />

      {/* Album picker */}
      {picking && (
        <div className="mb-3 rounded-xl border border-gilt/25 bg-night/40 p-3">
          {albumPhotos.length === 0 ? (
            <p className="py-2 text-center text-[11px] text-blossom/40">
              Album's empty — upload one instead.
            </p>
          ) : (
            <div className="flex gap-2 overflow-x-auto">
              {albumPhotos.map((p) => (
                <button
                  key={p.id}
                  onClick={() => addSticker(p.url)}
                  className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gilt/30 transition-transform hover:scale-105"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* The board */}
      <div
        ref={boardRef}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClick={(e) => {
          if (e.target === e.currentTarget) setSelected(null);
        }}
        className={`relative aspect-[4/3] w-full overflow-hidden rounded-xl sm:aspect-[16/10] ${
          editing
            ? "border border-dashed border-gilt/40 bg-night/30"
            : "border border-transparent"
        }`}
        style={{ touchAction: editing ? "none" : "auto" }}
      >
        {empty && editing && (
          <p className="absolute inset-0 grid place-items-center px-6 text-center text-xs text-blossom/35">
            Add a photo, then drag it wherever you like.
          </p>
        )}

        {stickers.map((s) => {
          const isSel = editing && s.id === selected;
          return (
            <div
              key={s.id}
              onPointerDown={(e) => onPointerDown(e, s)}
              className={`absolute select-none ${
                editing ? "cursor-grab active:cursor-grabbing" : ""
              }`}
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: `${s.w}%`,
                transform: `translate(-50%, -50%) rotate(${s.rotate}deg)`,
                zIndex: s.z,
              }}
            >
              <div
                className={
                  s.frame === "polaroid"
                    ? "bg-parchment-2 p-[5%] pb-[12%] shadow-lg"
                    : "shadow-lg"
                }
                style={{
                  borderRadius: s.frame === "polaroid" ? 3 : 6,
                  outline: isSel ? "2px solid var(--color-lilac)" : "none",
                  outlineOffset: 2,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.url}
                  alt={s.caption || ""}
                  draggable={false}
                  className="pointer-events-none block w-full object-cover"
                  style={{ aspectRatio: "1 / 1", borderRadius: 2 }}
                />
                {s.frame === "polaroid" && s.caption && (
                  <p className="mt-[4%] text-center font-display text-[max(9px,1.6cqw)] leading-tight text-ink/80">
                    {s.caption}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Toolbar for the selected photo */}
      {editing && sel && (
        <div className="mt-3 rounded-xl border border-gilt/25 bg-night/40 p-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <ToolBtn onClick={() => update(sel.id, { w: Math.max(8, sel.w - 4) })}>
              −
            </ToolBtn>
            <span className="px-1 text-[11px] text-lilac/45">size</span>
            <ToolBtn onClick={() => update(sel.id, { w: Math.min(90, sel.w + 4) })}>
              ＋
            </ToolBtn>

            <span className="mx-1 h-4 w-px bg-gilt/20" />

            <ToolBtn onClick={() => update(sel.id, { rotate: sel.rotate - 7 })}>
              ↺
            </ToolBtn>
            <span className="px-1 text-[11px] text-lilac/45">turn</span>
            <ToolBtn onClick={() => update(sel.id, { rotate: sel.rotate + 7 })}>
              ↻
            </ToolBtn>

            <span className="mx-1 h-4 w-px bg-gilt/20" />

            <ToolBtn onClick={() => update(sel.id, { z: topZ + 1 })}>
              bring to front
            </ToolBtn>
            <ToolBtn
              onClick={() =>
                update(sel.id, {
                  frame: sel.frame === "polaroid" ? "plain" : "polaroid",
                })
              }
            >
              {sel.frame === "polaroid" ? "no frame" : "polaroid"}
            </ToolBtn>
            <ToolBtn onClick={() => removeSticker(sel.id)} danger>
              remove
            </ToolBtn>
          </div>

          {sel.frame === "polaroid" && (
            <input
              value={sel.caption}
              onChange={(e) => update(sel.id, { caption: e.target.value })}
              placeholder="write under the photo..."
              maxLength={120}
              className="field mt-2.5 w-full px-3 py-1.5 text-xs"
            />
          )}
        </div>
      )}
    </div>
  );
}

function ToolBtn({
  children,
  onClick,
  danger = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-2.5 py-1 text-[11px] transition-colors ${
        danger
          ? "border-seal-brick/40 text-seal-brick/80 hover:border-seal-brick hover:text-seal-brick"
          : "border-gilt/35 text-lilac/85 hover:border-gilt hover:text-lilac"
      }`}
    >
      {children}
    </button>
  );
}
