"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

/**
 * Between-page transition: a gilt sweep across the screen and the new content
 * rising in under it.
 *
 * The entry sequence in OpeningGate only plays once per session, so without
 * this every navigation after the first was a hard cut.
 *
 * Keyed on pathname — remounting the wrapper restarts the animation, which is
 * why the key is on the inner element and not just a class toggle.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [sweeping, setSweeping] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
    );
  }, []);

  useEffect(() => {
    if (reduced) return;
    setSweeping(true);
    const t = setTimeout(() => setSweeping(false), 620);
    return () => clearTimeout(t);
  }, [pathname, reduced]);

  if (reduced) return <>{children}</>;

  return (
    <>
      {/* The sweep: a band of light crossing the viewport once per navigation */}
      {sweeping && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
        >
          <div className="anim-sweep absolute inset-y-0 w-[45%]" />
        </div>
      )}

      <div key={pathname} className="anim-page-in">
        {children}
      </div>
    </>
  );
}
