"use client";

import { useMemo, useState } from "react";
import { Panel, SectionTitle } from "./Frame";
import { FESTIVALS, daysUntil, type Festival } from "@/lib/festivals";
import type { CalendarEvent } from "@/lib/store";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DOW = ["S", "M", "T", "W", "T", "F", "S"];

const iso = (y: number, m: number, d: number) =>
  `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

export default function CalendarClient({
  initialEvents,
  todayISO,
}: {
  initialEvents: CalendarEvent[];
  todayISO: string;
}) {
  const [events, setEvents] = useState(initialEvents);
  const [cursor, setCursor] = useState(() => {
    const [y, m] = todayISO.split("-").map(Number);
    return { year: y, month: m - 1 };
  });
  const [selected, setSelected] = useState<string | null>(todayISO);
  const [form, setForm] = useState({ title: "", note: "", addedBy: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const festivalsByDate = useMemo(() => {
    const map = new Map<string, Festival[]>();
    for (const f of FESTIVALS) {
      map.set(f.date, [...(map.get(f.date) ?? []), f]);
    }
    return map;
  }, []);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const e of events) {
      map.set(e.date, [...(map.get(e.date) ?? []), e]);
    }
    return map;
  }, [events]);

  const { year, month } = cursor;
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array.from({ length: firstDow }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  function shift(delta: number) {
    setCursor(({ year, month }) => {
      const m = month + delta;
      if (m < 0) return { year: year - 1, month: 11 };
      if (m > 11) return { year: year + 1, month: 0 };
      return { year, month: m };
    });
  }

  const selFestivals = selected ? (festivalsByDate.get(selected) ?? []) : [];
  const selEvents = selected ? (eventsByDate.get(selected) ?? []) : [];

  const upcoming = useMemo(
    () =>
      [
        ...FESTIVALS.map((f) => ({
          date: f.date,
          title: f.name,
          approx: f.approx,
          kind: "festival" as const,
        })),
        ...events.map((e) => ({
          date: e.date,
          title: e.title,
          approx: false,
          kind: "event" as const,
        })),
      ]
        .filter((x) => x.date >= todayISO)
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, 4),
    [events, todayISO],
  );

  async function addEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || !form.title.trim()) {
      setError("Pick a day and give it a name.");
      return;
    }

    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, date: selected }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not save.");

      setEvents((prev) => [...prev, data.event]);
      setForm({ title: "", note: "", addedBy: form.addedBy });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setBusy(false);
    }
  }

  async function removeEvent(id: string) {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    await fetch(`/api/events?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    }).catch(() => {});
  }

  return (
    <div>
      <SectionTitle sub="Festivals from home, and whatever else matters.">
        The Calendar
      </SectionTitle>

      {/* Countdown strip */}
      {upcoming.length > 0 && (
        <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
          {upcoming.map((u, i) => {
            const days = daysUntil(todayISO, u.date);
            return (
              <div
                key={`${u.date}-${i}`}
                className="min-w-[8.5rem] shrink-0 rounded-xl border border-gilt/25 bg-plum/60 px-3 py-2"
              >
                <p className="text-[10px] tracking-[0.14em] text-lilac/45">
                  {days === 0 ? "TODAY" : `IN ${days} DAY${days === 1 ? "" : "S"}`}
                </p>
                <p className="mt-0.5 truncate text-sm text-blossom">
                  {u.approx && <span className="text-lilac/50">~ </span>}
                  {u.title}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        {/* Month grid */}
        <Panel dark className="p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between">
            <button
              onClick={() => shift(-1)}
              aria-label="Previous month"
              className="rounded-full border border-gilt/30 px-3 py-1 text-lilac transition-colors hover:border-gilt"
            >
              ‹
            </button>
            <p className="font-display text-xl text-gilt">
              {MONTHS[month]} {year}
            </p>
            <button
              onClick={() => shift(1)}
              aria-label="Next month"
              className="rounded-full border border-gilt/30 px-3 py-1 text-lilac transition-colors hover:border-gilt"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {DOW.map((d, i) => (
              <div
                key={i}
                className="pb-1 text-[10px] tracking-widest text-lilac/35"
              >
                {d}
              </div>
            ))}

            {cells.map((day, i) => {
              if (day === null) return <div key={`b${i}`} />;

              const date = iso(year, month, day);
              const fests = festivalsByDate.get(date) ?? [];
              const evs = eventsByDate.get(date) ?? [];
              const isToday = date === todayISO;
              const isSel = date === selected;

              return (
                <button
                  key={date}
                  onClick={() => setSelected(date)}
                  className={`relative aspect-square rounded-lg border text-xs transition-all ${
                    isSel
                      ? "border-lilac bg-violet/25 text-blossom"
                      : isToday
                        ? "border-moss/70 text-blossom"
                        : "border-transparent text-blossom/65 hover:border-gilt/40"
                  }`}
                >
                  <span className="absolute inset-x-0 top-1.5">{day}</span>

                  <span className="absolute inset-x-0 bottom-1.5 flex justify-center gap-0.5">
                    {fests.slice(0, 2).map((f, k) => (
                      <span
                        key={k}
                        className="h-1.5 w-1.5 rounded-full"
                        style={{
                          background: `var(--color-seal-${f.seal})`,
                        }}
                      />
                    ))}
                    {evs.length > 0 && (
                      <span className="h-1.5 w-1.5 rounded-full bg-lilac" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="mt-3 text-center text-[10px] text-lilac/35">
            Coloured dots are festivals · lilac dots are yours · ~ means the
            lunar date shifts yearly, so check a patro
          </p>
        </Panel>

        {/* Selected day */}
        <Panel dark className="p-4 sm:p-5">
          <p className="font-display text-lg text-gilt">
            {selected
              ? new Date(`${selected}T00:00:00`).toLocaleDateString(undefined, {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })
              : "Pick a day"}
          </p>

          <div className="gilt-rule my-3" />

          {selFestivals.map((f) => (
            <div key={f.date + f.name} className="mb-3">
              <p className="text-sm text-blossom">
                {f.approx && <span className="text-lilac/50">~ </span>}
                {f.name}
                {f.patan && (
                  <span className="ml-2 rounded-full bg-seal-brick/25 px-2 py-0.5 text-[10px] text-seal-brick">
                    Patan
                  </span>
                )}
                {!f.patan && f.newari && (
                  <span className="ml-2 rounded-full bg-seal-plum/25 px-2 py-0.5 text-[10px] text-lilac">
                    Newari
                  </span>
                )}
              </p>
              <p className="text-[11px] text-moss/75">{f.local}</p>
              {f.note && (
                <p className="mt-1 text-xs leading-relaxed text-blossom/60">
                  {f.note}
                </p>
              )}
            </div>
          ))}

          {selEvents.map((e) => (
            <div key={e.id} className="group mb-3 flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-lilac" />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-blossom">{e.title}</p>
                {e.note && (
                  <p className="text-xs text-blossom/55">{e.note}</p>
                )}
                {e.addedBy && (
                  <p className="text-[10px] text-lilac/35">— {e.addedBy}</p>
                )}
              </div>
              <button
                onClick={() => removeEvent(e.id)}
                aria-label="Remove"
                className="text-xs text-seal-brick/0 transition-colors group-hover:text-seal-brick/70"
              >
                ✕
              </button>
            </div>
          ))}

          {selFestivals.length === 0 && selEvents.length === 0 && (
            <p className="mb-3 text-xs text-blossom/40">
              Nothing marked. Add something.
            </p>
          )}

          <form onSubmit={addEvent} className="mt-4 space-y-2">
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="What's happening?"
              maxLength={160}
              className="field w-full px-3 py-2 text-sm"
            />
            <input
              value={form.note}
              onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
              placeholder="Note (optional)"
              maxLength={500}
              className="field w-full px-3 py-2 text-sm"
            />
            <div className="flex gap-2">
              <input
                value={form.addedBy}
                onChange={(e) =>
                  setForm((f) => ({ ...f, addedBy: e.target.value }))
                }
                placeholder="your name"
                maxLength={80}
                className="field min-w-0 flex-1 px-3 py-2 text-sm"
              />
              <button
                type="submit"
                disabled={busy || !selected}
                className="btn-violet shrink-0 px-4 py-2 text-sm"
              >
                Add
              </button>
            </div>
            {error && <p className="text-xs text-seal-brick">{error}</p>}
          </form>
        </Panel>
      </div>
    </div>
  );
}
