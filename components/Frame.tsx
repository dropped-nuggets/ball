import type { ReactNode } from "react";
import { Torana, Strut } from "./Torana";

/**
 * Gilt diamond "nail" at each corner — the fixings on a carved Newari frame.
 */
function CornerNails() {
  const spots = [
    "top-[-4px] left-[-4px]",
    "top-[-4px] right-[-4px]",
    "bottom-[-4px] left-[-4px]",
    "bottom-[-4px] right-[-4px]",
  ];
  return (
    <>
      {spots.map((pos) => (
        <span
          key={pos}
          aria-hidden
          className={`absolute ${pos} h-2 w-2 rotate-45 border border-gilt bg-plum`}
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

      {torana && (
        <div className="pointer-events-none absolute inset-x-0 top-0 overflow-hidden rounded-t-[20px]">
          <Torana className="h-8 opacity-80" />
        </div>
      )}

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
