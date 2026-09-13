"use client";

import { useMemo, useState } from "react";
import { Panel, SectionTitle } from "./Frame";
import { bingoGrid, bingoLines } from "@/lib/bingo";
import type { ChecklistItem, ListName } from "@/lib/types";

const bingoRowId = (squareId: string) => `bingo:${squareId}`;

export default function BingoClient({
  initialItems,
}: {
  initialItems: ChecklistItem[];
}) {
  const [items, setItems] = useState(initialItems);

  const grid = useMemo(() => bingoGrid(), []);
  const doneIds = useMemo(
    () => new Set(items.filter((i) => i.done).map((i) => i.id)),
    [items],
  );

  const ticked = grid.map((sq) => doneIds.has(bingoRowId(sq.id)));
  const lines = useMemo(() => bingoLines(), []);
  const completedLines = lines.filter((line) => line.every((i) => ticked[i]));
  const wonIndexes = new Set(completedLines.flat());

  /** Optimistic toggle — the grid should feel instant. */
  async function toggle(
    id: string,
    next: boolean,
    list: ListName,
    text: string,
  ) {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) => (i.id === id ? { ...i, done: next } : i));
      }
      return [
        ...prev,
        {
          id,
          list,
          text,
          addedBy: "",
          done: next,
          createdAt: new Date().toISOString(),
        },
      ];
    });

    await fetch("/api/checklist", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, done: next, list, text }),
    }).catch(() => {
      // Roll back so the UI doesn't claim a tick that never saved.
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, done: !next } : i)),
      );
    });
  }

  return (
    <div className="space-y-12">
      {/* ---------------- Bingo card ---------------- */}
      <section>
        <SectionTitle sub="It will all happen. It's just a matter of when.">
          UK Bingo
        </SectionTitle>

        {completedLines.length > 0 && (
          <p className="anim-rise mb-4 text-center font-display text-2xl text-gilt">
            BINGO ×{completedLines.length} — you've been fully Britained 🇬🇧
          </p>
        )}

        {/*
          The board scrolls sideways on a phone rather than shrinking. Squeezing
          a full sentence into a ~60px square at 8px type is unreadable and
          overflows the cell; a 520px board that pans is not.
        */}
        <div className="-mx-1 overflow-x-auto px-1 pb-2">
          <div className="grid min-w-[30rem] grid-cols-5 gap-1.5 sm:min-w-0 sm:gap-2">
            {grid.map((sq, i) => {
              const id = bingoRowId(sq.id);
              const on = ticked[i];
              const inLine = wonIndexes.has(i);
              return (
                <button
                  key={sq.id}
                  onClick={() => toggle(id, !on, "bingo", sq.text)}
                  aria-pressed={on}
                  className={`relative aspect-square overflow-hidden rounded-lg border p-2 text-left transition-all duration-200 sm:p-2.5 ${
                    on
                      ? "border-violet bg-violet/25"
                      : "border-gilt/25 bg-plum/50 hover:border-gilt/60"
                  } ${inLine ? "ring-2 ring-gilt" : ""}`}
                >
                  <span
                    className={`block text-[10px] leading-tight sm:text-[11px] ${
                      on ? "text-blossom" : "text-blossom/60"
                    }`}
                  >
                    {sq.text}
                  </span>
                  {on && (
                    <span
                      aria-hidden
                      className="anim-sparkle absolute right-1 top-1 text-xs"
                    >
                      ✦
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <p className="mt-1 text-center text-xs text-lilac/45">
          {ticked.filter(Boolean).length} / 25 ticked
          <span className="ml-2 sm:hidden">· swipe the board</span>
        </p>
      </section>

      {/* ---------------- The two lists ---------------- */}
      <ChecklistSection
        list="ours"
        title="The list we made you"
        sub="Things we decided you have to do. Non-negotiable."
        emptyText="Nothing here yet — go add something for her."
        addLabel="Add something for her to do"
        items={items}
        setItems={setItems}
        onToggle={toggle}
      />

      <ChecklistSection
        list="hers"
        title="Your own list"
        sub="Your section. Build it however you want."
        emptyText="Empty. Make it yours."
        addLabel="Add your own"
        items={items}
        setItems={setItems}
        onToggle={toggle}
      />
    </div>
  );
}

function ChecklistSection({
  list,
  title,
  sub,
  emptyText,
  addLabel,
  items,
  setItems,
  onToggle,
}: {
  list: ListName;
  title: string;
  sub: string;
  emptyText: string;
  addLabel: string;
  items: ChecklistItem[];
  setItems: React.Dispatch<React.SetStateAction<ChecklistItem[]>>;
  onToggle: (
    id: string,
    next: boolean,
    list: ListName,
    text: string,
  ) => Promise<void>;
}) {
  const [text, setText] = useState("");
  const [addedBy, setAddedBy] = useState("");
  const [busy, setBusy] = useState(false);

  const rows = items.filter((i) => i.list === list);
  const done = rows.filter((i) => i.done).length;

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;

    setBusy(true);
    try {
      const res = await fetch("/api/checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ list, text, addedBy }),
      });
      const data = await res.json();
      if (res.ok) {
        setItems((prev) => [...prev, data.item]);
        setText("");
      }
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
    await fetch(`/api/checklist?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  }

  return (
    <section>
      <SectionTitle sub={sub}>{title}</SectionTitle>

      <Panel dark className="p-5 sm:p-6">
        {rows.length === 0 ? (
          <p className="py-6 text-center text-sm text-blossom/45">
            {emptyText}
          </p>
        ) : (
          <>
            <p className="mb-3 text-[11px] tracking-[0.16em] text-lilac/45">
              {done} / {rows.length} DONE
            </p>
            <ul className="space-y-1">
              {rows.map((item) => (
                <li key={item.id} className="group flex items-start gap-3">
                  <button
                    onClick={() => onToggle(item.id, !item.done, list, item.text)}
                    aria-pressed={item.done}
                    className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded border text-[11px] transition-all ${
                      item.done
                        ? "border-moss bg-moss/30 text-moss"
                        : "border-gilt/40 hover:border-gilt"
                    }`}
                  >
                    {item.done ? "✓" : ""}
                  </button>

                  <span
                    className={`flex-1 py-0.5 text-sm ${
                      item.done
                        ? "text-blossom/40 line-through"
                        : "text-blossom/85"
                    }`}
                  >
                    {item.text}
                    {item.addedBy && (
                      <span className="ml-2 text-[11px] text-lilac/35">
                        — {item.addedBy}
                      </span>
                    )}
                  </span>

                  <button
                    onClick={() => remove(item.id)}
                    aria-label="Remove item"
                    className="shrink-0 text-xs text-seal-brick/0 transition-colors group-hover:text-seal-brick/70"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

        <form onSubmit={add} className="mt-5 space-y-2">
          <div className="gilt-rule mb-4" />
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={addLabel}
              maxLength={300}
              className="field flex-1 px-3 py-2 text-sm"
            />
            <input
              value={addedBy}
              onChange={(e) => setAddedBy(e.target.value)}
              placeholder="your name"
              maxLength={80}
              className="field px-3 py-2 text-sm sm:w-32"
            />
            <button
              type="submit"
              disabled={busy || !text.trim()}
              className="btn-violet px-5 py-2 text-sm"
            >
              Add
            </button>
          </div>
        </form>
      </Panel>
    </section>
  );
}
