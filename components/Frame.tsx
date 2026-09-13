import type { ReactNode } from "react";
import { ToranaCrown, Strut } from "./Torana";
import { DurbarSquare } from "./Scenery";

/**
 * Gilt diamond "nail" at each corner — the fixings on a carved Newari frame.
 *
 * Placed INSIDE the corner, on the diagonal of the 20px radius. Sitting them
 * at -4px put them outside the curve entirely, where they read as four stray
 * dots floating near the card rather than as fixings holding it together.
 */
function CornerNails() {
  const spots = [
    "top-[7px] left-[7px]",
    "top-[7px] right-[7px]",
    "bottom-[7px] left-[7px]",
    "bottom-[7px] right-[7px]",
  ];
  return (
    <>
      {spots.map((pos) => (
        <span
          key={pos}
          aria-hidden
          className={`absolute ${pos} h-1.5 w-1.5 rotate-45 bg-gilt/55`}
        />
      ))}
    </>
  );
}

export function Panel({
  children,
  className = "",
  dark = false,
  /** Crown the card with a carved torana arch. */
  torana = false,
  /** Carved eave-strut brackets in the top corners. */
  struts = false,
}: {
  children: ReactNode;
  className?: string;
  dark?: boolean;
  torana?: boolean;
  struts?: boolean;
}) {
  return (
    <div
      className={`relative ${dark ? "panel-dark" : "panel"} ${
        torana ? "pt-0" : ""
      } ${className}`}
    >
      <CornerNails />

      {torana && <ToranaCrown />}

      {struts && (
        <>
          <Strut corner="left" />
          <Strut corner="right" />
        </>
      )}

      {children}
    </div>
  );
}

/**
 * The "nothing here yet" state.
 *
 * An empty panel was just a tall washed-out slab with a sentence floating in
 * the middle of it — the emptiest part of the site looked the least finished.
 * Standing the skyline along the bottom edge gives the block a horizon, so it
 * reads as a view waiting to be filled rather than as a container that failed
 * to load.
 */
export function EmptyState({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div className="relative z-10 grid place-items-center px-6 pb-28 pt-14 text-center">
        <span
          aria-hidden
          className="anim-bob mb-4 h-3 w-3 rotate-45 border border-gilt/60 bg-seal-brick/30"
        />
        <p className="font-display text-2xl text-lilac/75">{title}</p>
        {children && (
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-blossom/50">
            {children}
          </p>
        )}
      </div>

      {/*
       * Patan along the bottom, fading up into the panel. Masked rather than
       * covered with a gradient overlay: an overlay's own top edge showed as a
       * hard horizontal band across the card.
       */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-36 opacity-40"
        style={{
          maskImage: "linear-gradient(to top, black 45%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to top, black 45%, transparent 100%)",
        }}
      >
        <DurbarSquare fit="meet" className="h-full" />
      </div>
    </div>
  );
}

/**
 * Section heading framed the way a Newari doorway is: brick-red diamonds
 * flanking the title, gilt rules running out to either side.
 */
export function SectionTitle({
  children,
  sub,
}: {
  children: ReactNode;
  sub?: string;
}) {
  return (
    <div className="mb-6 text-center">
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        <span aria-hidden className="gilt-rule w-8 sm:w-24" />
        <span
          aria-hidden
          className="h-2.5 w-2.5 rotate-45 border border-gilt bg-seal-brick/50"
        />
        <h2 className="font-display text-xl tracking-wide text-gilt sm:text-3xl">
          {children}
        </h2>
        <span
          aria-hidden
          className="h-2.5 w-2.5 rotate-45 border border-gilt bg-seal-brick/50"
        />
        <span aria-hidden className="gilt-rule w-8 sm:w-24" />
      </div>
      {sub && (
        <p className="mx-auto mt-2 max-w-md text-sm text-blossom/55">{sub}</p>
      )}
    </div>
  );
}
