"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import TulipLoaderScreen from "./TulipLoaderScreen";

/**
 * Between-page transition: the tulip loader is held on screen for a beat, then
 * fades to reveal the new page rising in under it.
 *
 * Why the hold exists. Next tears `app/loading.tsx` down the instant the
 * server render arrives, and locally that is often under a second — so the
 * bracelet appeared as a flash and cut straight to the page, never completing
 * a bloom. A server component cannot keep itself mounted, so the minimum
 * duration has to be enforced from the client, here.
 *
 * `HOLD_MS` is not arbitrary: the last flower in the ring starts blooming at
 * 9 x 0.09s and each bloom runs 1.8s, so the ring finishes at about 2.6s.
 * Holding to 2800ms means every tulip has opened at least once before the
 * page is revealed. Changing the stagger or the bloom duration in globals.css
 * means changing this too.
 */
const HOLD_MS = 2800;
const FADE_MS = 600;

type Phase = "idle" | "holding" | "fading";

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const [reduced, setReduced] = useState(false);

  // The first paint of a session is already covered by OpeningGate's flight,
  // so the loader should only appear on subsequent navigations.
  const firstRender = useRef(true);

  useEffect(() => {
    setReduced(
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
    );
  }, []);

  useEffect(() => {
    if (reduced) return;

    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    setPhase("holding");
    const hold = setTimeout(() => setPhase("fading"), HOLD_MS);
    const done = setTimeout(() => setPhase("idle"), HOLD_MS + FADE_MS);

    return () => {
      clearTimeout(hold);
      clearTimeout(done);
    };
  }, [pathname, reduced]);

  if (reduced) return <>{children}</>;

  return (
    <>
      {phase !== "idle" && (
        <div
          aria-hidden
          className="pointer-events-none"
          style={{
            opacity: phase === "fading" ? 0 : 1,
            transition: `opacity ${FADE_MS}ms ease-out`,
          }}
        >
          <TulipLoaderScreen overlay />
        </div>
      )}

      {/* Keyed on pathname so the rise-in restarts for each page. */}
      <div key={pathname} className="anim-page-in">
        {children}
      </div>
    </>
  );
}
