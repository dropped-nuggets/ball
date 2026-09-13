import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import OpeningGate from "@/components/OpeningGate";
import PageTransition from "@/components/PageTransition";
import { authDisabled } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Rijuko — a piece of Nepal, wherever you are",
  description:
    "An album, a diary, and letters from home. Made so the distance feels a little smaller.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="rijuko-sky min-h-dvh">
        {/*
          An unprotected deployment must never look like a protected one.
          This banner is the visible consequence of RIJUKO_PASSPHRASE being unset.
        */}
        {authDisabled() && (
          <p className="bg-seal-brick px-4 py-1.5 text-center text-[11px] text-night">
            No passphrase set — everything here is public. Set{" "}
            <code>RIJUKO_PASSPHRASE</code> before sharing this link.
          </p>
        )}
        <OpeningGate>
          <Nav />
          <main className="mx-auto max-w-5xl px-4 py-8">
            <PageTransition>{children}</PageTransition>
          </main>
          <footer className="mx-auto max-w-5xl px-4 pb-10 pt-4 text-center text-xs text-parchment/35">
            made with love, from Nepal
          </footer>
        </OpeningGate>
      </body>
    </html>
  );
}
