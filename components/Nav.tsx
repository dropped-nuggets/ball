"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE_WORDMARK } from "@/lib/site";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/album", label: "Album" },
  { href: "/diary", label: "Diary" },
  { href: "/letters", label: "Letters" },
  { href: "/mixtape", label: "Mixtape" },
  { href: "/calendar", label: "Calendar" },
  { href: "/play", label: "Play" },
  { href: "/bingo", label: "Bingo" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the drawer on navigation, or the new page opens behind it.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // The public write page and the login screen are seen by people who are not
  // signed in — neither should advertise her private sections.
  if (pathname?.startsWith("/write") || pathname?.startsWith("/login")) {
    return null;
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <header className="sticky top-0 z-30 border-b border-gilt/20 bg-night/85 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span
            aria-hidden
            className="h-3 w-3 rotate-45 border border-gilt bg-violet/40"
          />
          <span className="font-display text-lg tracking-[0.22em] text-gilt">
            {SITE_WORDMARK}
          </span>
        </Link>

        {/* Desktop: full row. Hidden below lg, where eight items cannot fit. */}
        <ul className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`block rounded-full px-3 py-1.5 text-sm transition-colors ${
                  isActive(link.href)
                    ? "bg-violet/25 text-lilac"
                    : "text-blossom/60 hover:text-lilac"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile: menu button */}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-9 w-9 shrink-0 flex-col items-center justify-center gap-[5px] rounded-full border border-gilt/35 lg:hidden"
        >
          <span
            className={`block h-px w-4 bg-gilt transition-transform ${
              open ? "translate-y-[6px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-px w-4 bg-gilt transition-opacity ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-px w-4 bg-gilt transition-transform ${
              open ? "-translate-y-[6px] -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-gilt/15 bg-night/95 lg:hidden">
          <ul className="mx-auto grid max-w-5xl grid-cols-2 gap-1 px-4 py-3 sm:grid-cols-3">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block rounded-xl px-3 py-2.5 text-sm transition-colors ${
                    isActive(link.href)
                      ? "bg-violet/25 text-lilac"
                      : "text-blossom/70 hover:bg-plum-2"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
