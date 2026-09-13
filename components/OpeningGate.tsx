"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Motes, { Leaves, Stars } from "./Motes";
import { ScenePatan, SceneClouds, SceneLondon } from "./Journey";
import { SITE_WORDMARK } from "@/lib/site";

type Phase = "patan" | "clouds" | "london" | "burst" | "open" | "done";

const SEEN_KEY = "rizzu:opened";

/**
 * How long each shot holds, in milliseconds. The scenes' own CSS animations
 * are timed to be still moving when the cut comes — a shot that finishes
 * animating before it is cut away goes visibly dead.
 */
const SHOT: Record<"patan" | "clouds" | "london", number> = {
  patan: 2600,
  clouds: 2400,
  london: 2800,
};

const BURST_MS = 800;
const CURTAIN_MS = 1100;
const TOTAL_MS = SHOT.patan + SHOT.clouds + SHOT.london + BURST_MS + CURTAIN_MS;

/**
 * Routes that skip the entry sequence: the login screen and the public write
 * page have their own framing, and the gate would overlay their content.
 */
const UNGATED = ["/login", "/write"];

/**
 * The flight home-to-here, played once after login: Patan Durbar Square at
 * dawn, the climb out over the jungle, cloud at altitude, then the descent
 * into London — and the site behind it, revealed as two curtains part.
 *
 * Plays once per browser session so moving between pages isn't gated by a
 * ten-second film every time.
 */
export default function OpeningGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const ungated = UNGATED.some((p) => pathname?.startsWith(p));

  const [phase, setPhase] = useState<Phase>("patan");
  const [elapsed, setElapsed] = useState(0);

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

  // Advance shot to shot. Each phase schedules only its own successor, so a
  // skip mid-sequence cancels everything still pending.
  useEffect(() => {
    if (phase === "done") return;

    const next: Partial<Record<Phase, [Phase, number]>> = {
      patan: ["clouds", SHOT.patan],
      clouds: ["london", SHOT.clouds],
      london: ["burst", SHOT.london],
      burst: ["open", BURST_MS],
      open: ["done", CURTAIN_MS],
    };

    const step = next[phase];
    if (!step) return;

    const t = setTimeout(() => setPhase(step[0]), step[1]);
    return () => clearTimeout(t);
  }, [phase]);

  // Progress along the route line, for the rail at the foot of the screen.
  useEffect(() => {
    if (phase === "done" || ungated) return;
    const started = Date.now();
    const id = setInterval(() => setElapsed(Date.now() - started), 80);
    return () => clearInterval(id);
  }, [phase === "done", ungated]); // eslint-disable-line react-hooks/exhaustive-deps

  /*
   * Safety net. Browsers throttle timers in background tabs, so the chain
   * above can stall and strand someone on the loading screen. Nothing about
   * this animation is worth blocking the site for, so force it open well after
   * the sequence should have finished on its own.
   */
  useEffect(() => {
    if (ungated) return;
    const bail = setTimeout(() => setPhase("done"), TOTAL_MS + 4000);
    return () => clearTimeout(bail);
  }, [ungated]);

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
  const flying = phase === "patan" || phase === "clouds" || phase === "london";
  const progress = Math.min(100, (elapsed / (TOTAL_MS - CURTAIN_MS)) * 100);

  return (
    <>
      {/* Content sits underneath, revealed as the curtains slide away. */}
      <div aria-hidden={!parting}>{children}</div>

      <div className="fixed inset-0 z-50">
        {/* The film. Only the current shot is mounted, so each cut restarts
            that scene's animations from their first frame. */}
        {flying && (
          /*
           * bg-night is load-bearing, not decoration. Each scene fades in from
           * opacity 0, so without an opaque layer beneath them the site itself
           * shows through the first frames of every cut.
           */
          <div className="absolute inset-0 overflow-hidden bg-night">
            {phase === "patan" && <ScenePatan />}
            {phase === "clouds" && <SceneClouds />}
            {phase === "london" && <SceneLondon />}

            {/* Letterbox bars — the cheapest possible "this is a film" cue */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[6vh] bg-night/85" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[6vh] bg-night/85" />

            {/* Route rail */}
            <div className="absolute inset-x-0 bottom-0 z-20 flex h-[6vh] items-center gap-3 px-5">
              <span className="text-[9px] tracking-[0.2em] text-moss/70">KTM</span>
              <div className="relative h-px flex-1 bg-blossom/15">
                <div
                  className="h-full bg-gradient-to-r from-moss via-lilac to-seal-sky transition-[width] duration-150 ease-linear"
                  style={{ width: `${progress}%` }}
                />
                <span
                  className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] text-gilt transition-[left] duration-150 ease-linear"
                  style={{ left: `${progress}%` }}
                  aria-hidden
                >
                  ✈
                </span>
              </div>
              <span className="text-[9px] tracking-[0.2em] text-seal-sky/70">UK</span>
            </div>

            {/* Wordmark, held quietly in the top bar the whole way */}
            <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex h-[6vh] items-center justify-center">
              <span className="font-display text-sm tracking-[0.4em] text-gilt/70">
                {SITE_WORDMARK}
              </span>
            </div>

            <button
              onClick={() => setPhase("done")}
              className="absolute right-4 top-[7vh] z-20 rounded-full border border-gilt/25 px-3 py-1 text-[10px] tracking-[0.14em] text-lilac/50 transition-colors hover:border-gilt/60 hover:text-lilac"
            >
              skip
            </button>
          </div>
        )}

        {/*
          Curtains. The lattice sits on its own child layer: putting
          .ankhi-jhyal on the same element as .rizzu-sky lets its
          background-image override the sky's, leaving the curtain transparent.
        */}
        {(phase === "burst" || parting) && (
          <>
            <div
              className={`absolute inset-x-0 top-0 h-1/2 overflow-hidden rizzu-sky ${
                parting ? "anim-curtain-up" : ""
              }`}
            >
              <div className="ankhi-jhyal absolute inset-0" aria-hidden />
              <Stars count={40} />
              <Leaves count={6} />
              <div className="absolute inset-x-0 bottom-0 h-px bg-gilt/70" />
            </div>

            <div
              className={`absolute inset-x-0 bottom-0 h-1/2 overflow-hidden rizzu-sky ${
                parting ? "anim-curtain-down" : ""
              }`}
            >
              <div className="ankhi-jhyal absolute inset-0" aria-hidden />
              <Motes count={18} />
              <div className="absolute inset-x-0 top-0 h-px bg-gilt/70" />
            </div>
          </>
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
            <p className="absolute bottom-[22%] text-[11px] tracking-[0.3em] text-blossom/60">
              WELCOME HOME
            </p>
          </div>
        )}
      </div>
    </>
  );
}


