"use client";

import { useEffect, useState } from "react";
import { Panel } from "./Frame";
import {
  HOMESICK_CURES,
  STATUS_LINES,
  UK_JOKES,
  dayNumber,
  pickForDay,
} from "@/lib/daily";

type Dose = {
  joke: string;
  cure: string;
  status: string;
  streak: number;
  day: number;
};

const STREAK_KEY = "rijuko:streak";

/**
 * The reason to come back tomorrow: a new UK joke, a new nudge, and a visit
 * streak that quietly judges you.
 *
 * Computed after mount rather than on the server — the server's timezone and
 * hers won't agree, and a date-dependent render would hydrate mismatched.
 */
export default function DailyDose() {
  const [dose, setDose] = useState<Dose | null>(null);

  useEffect(() => {
    const today = dayNumber();

    let streak = 1;
    try {
      const raw = localStorage.getItem(STREAK_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { day: number; streak: number };
        if (saved.day === today) streak = saved.streak;
        else if (saved.day === today - 1) streak = saved.streak + 1;
      }
      localStorage.setItem(STREAK_KEY, JSON.stringify({ day: today, streak }));
    } catch {
      // Private browsing blocks storage; the streak just resets each visit.
    }

    setDose({
      joke: pickForDay(UK_JOKES),
      cure: pickForDay(HOMESICK_CURES, 3),
      status: pickForDay(STATUS_LINES, 7),
      streak,
      day: today,
    });
  }, []);

  return (
    <Panel dark className="relative overflow-hidden p-6 sm:p-7">
      <div className="ankhi-jhyal pointer-events-none absolute inset-0 opacity-60" />

      <div className="relative">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="anim-sparkle inline-block h-3 w-3 rotate-45 bg-gilt"
            />
            <h3 className="font-display text-xl text-gilt">Today's dose</h3>
          </div>

          {dose && (
            <span className="rounded-full border border-violet/50 bg-violet/15 px-3 py-1 text-[11px] tracking-wide text-lilac">
              🔥 {dose.streak} day{dose.streak === 1 ? "" : "s"} in a row
            </span>
          )}
        </div>

        {dose ? (
          <>
            <p className="mt-1 text-[11px] lowercase tracking-[0.14em] text-lilac/45">
              status: {dose.status}
            </p>

            <p className="mt-5 text-[15px] leading-relaxed text-blossom/90">
              {dose.joke}
            </p>

            <div className="gilt-rule my-5" />

            <p className="text-[11px] tracking-[0.18em] text-moss/80">
              IF TODAY IS A HARD ONE
            </p>
            <p className="mt-2 text-sm leading-relaxed text-blossom/70">
              {dose.cure}
            </p>
          </>
        ) : (
          // Matches the loaded height closely enough to avoid a layout jump.
          <div className="mt-5 space-y-3" aria-hidden>
            <div className="h-4 w-full rounded bg-blossom/10" />
            <div className="h-4 w-4/5 rounded bg-blossom/10" />
            <div className="mt-8 h-3 w-1/3 rounded bg-blossom/10" />
            <div className="h-4 w-3/4 rounded bg-blossom/10" />
          </div>
        )}
      </div>
    </Panel>
  );
}
