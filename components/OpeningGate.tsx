"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Sigil from "./Sigil";
import Motes, { Leaves, Stars } from "./Motes";

type Phase = "loading" | "burst" | "open" | "done";

const SEEN_KEY = "rijuko:opened";

/**
 * Routes that skip the entry sequence: the login screen and the public write
 * page have their own framing, and the gate would overlay their content.
 */
const UNGATED = ["/login", "/write"];

/**
 * The Genshin-style entry sequence: a spinning sigil over a loading bar, a
 * starlight burst, then two curtains parting to reveal the site.
 *
 * Plays once per browser session so moving between pages isn't gated by a
 * ten-second animation every time.
 */
export default function OpeningGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const ungated = UNGATED.some((p) => pathname?.startsWith(p));

  const [phase, setPhase] = useState<Phase>("loading");
  const [progress, setProgress] = useState(0);

  // Skip the sequence if this route is ungated, if it already played this
  // session, or if the visitor asked for reduced motion.
  useEffect(() => {
    if (ungated) {
      setPhase("done");
      return;
    }
    const seen =
      typeof window !== "undefined" && sessionStorage.getItem(SEEN_KEY);
    const reduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (seen || reduced) setPhase("done");
  }, [ungated]);

  // Fill the loading bar, then advance through burst -> curtains -> done.
  useEffect(() => {
    if (phase !== "loading") return;

    const tick = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) return 100;
        // Ease out so it slows near the end, like a real load.
        return Math.min(100, p + Math.max(4, (100 - p) * 0.16));
      });
    }, 45);

    return () => clearInterval(tick);
  }, [phase]);

  /*
   * Safety net. Browsers throttle timers in background tabs, so the interval
   * above can crawl and strand someone on the loading screen. Nothing about
   * this animation is worth blocking the site for, so force it open.
   */
  useEffect(() => {
    if (ungated) return;
    const bail = setTimeout(() => setPhase("done"), 6000);
    return () => clearTimeout(bail);
  }, [ungated]);

  useEffect(() => {
    if (phase !== "loading" || progress < 100) return;
    const t = setTimeout(() => setPhase("burst"), 350);
    return () => clearTimeout(t);
  }, [phase, progress]);

  useEffect(() => {
    if (phase === "burst") {
      const t = setTimeout(() => setPhase("open"), 900);
      return () => clearTimeout(t);
    }
    if (phase === "open") {
      const t = setTimeout(() => setPhase("done"), 1100);
      return () => clearTimeout(t);
    }
  }, [phase]);

  // Remember it played however it finished — including via skip or the bail-out
  // timer — so navigating around doesn't replay it.
  useEffect(() => {
    if (phase !== "done" || ungated) return;
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // Private browsing can block storage; replaying the intro is fine.
    }
  }, [phase, ungated]);

  if (ungated || phase === "done") return <>{children}</>;

  const parting = phase === "open";

  return (
    <>
      {/* Content sits underneath, revealed as the curtains slide away. */}
      <div aria-hidden={!parting}>{children}</div>

      <div className="fixed inset-0 z-50">
        {/*
          The lattice sits on its own child layer. Putting .ankhi-jhyal on the
          same element as .rijuko-sky lets its background-image override the
          sky's, leaving the curtain transparent.
        */}

        {/* Top curtain */}
        <div
          className={`absolute inset-x-0 top-0 h-1/2 overflow-hidden rijuko-sky ${
            parting ? "anim-curtain-up" : ""
          }`}
        >
          <div className="ankhi-jhyal absolute inset-0" aria-hidden />
          <Stars count={40} />
          <Leaves count={6} />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gilt/70" />
        </div>

        {/* Bottom curtain */}
        <div
          className={`absolute inset-x-0 bottom-0 h-1/2 overflow-hidden rijuko-sky ${
            parting ? "anim-curtain-down" : ""
          }`}
        >
          <div className="ankhi-jhyal absolute inset-0" aria-hidden />
          <Motes count={18} />
          <div className="absolute inset-x-0 top-0 h-px bg-gilt/70" />
        </div>

        {/* Sigil + loading bar, hidden once the curtains start moving */}
        {!parting && (
          <div className="absolute inset-0 grid place-items-center">
            <div className="flex flex-col items-center gap-6 px-6">
              <Sigil size={140} />

              <div className="text-center">
                <p className="mb-2 text-[11px] tracking-[0.3em] text-moss/70">
                  ज्वजलपा
                </p>
                <h1 className="font-display text-3xl tracking-[0.3em] text-gilt">
                  RIJUKO
                </h1>
                <p className="mt-1 text-[10px] tracking-[0.22em] text-lilac/50 sm:text-xs">
                  A PIECE OF PIMBAHAL, WHEREVER YOU ARE
                </p>
              </div>

              <div className="relative h-[3px] w-56 overflow-hidden rounded-full bg-blossom/15 sm:w-64">
                <div
                  className="h-full bg-gradient-to-r from-violet to-lilac transition-[width] duration-100 ease-out"
                  style={{ width: `${progress}%` }}
                />
                <div className="gilt-shimmer absolute inset-0" />
              </div>

              <p className="text-[11px] tracking-[0.2em] text-blossom/40">
                {progress < 100 ? "OPENING THE GATE..." : "WELCOME HOME"}
              </p>

              <button
                onClick={() => setPhase("done")}
                className="mt-1 text-[11px] tracking-[0.14em] text-lilac/35 underline underline-offset-4 transition-colors hover:text-lilac"
              >
                skip
              </button>
            </div>
          </div>
        )}

        {/* Starlight burst at the seam */}
        {phase === "burst" && (
          <div className="absolute inset-0 grid place-items-center">
            <div
              className="anim-burst rounded-full"
              style={{
                width: 240,
                height: 240,
                background:
                  "radial-gradient(circle, rgba(255,250,235,0.95) 0%, rgba(211,188,142,0.6) 35%, rgba(76,194,241,0.25) 60%, transparent 72%)",
              }}
            />
          </div>
        )}
      </div>
    </>
  );
}
