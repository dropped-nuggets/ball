import { NextResponse, type NextRequest } from "next/server";
import { isLocalAddress } from "@/lib/localAddress";

/**
 * Nonce-based Content-Security-Policy (SEC-19).
 *
 * This is Next's Proxy convention — what earlier versions called Middleware,
 * renamed in Next 16 with the behaviour unchanged. It must stay at the project
 * root, alongside `app/`, and only one such file is supported per project.
 *
 * A flat `script-src 'self'` does not work with Next: the framework injects
 * inline bootstrap scripts (the one defining `self.__next_r` among them), and
 * blocking those stops hydration completely — the page renders but nothing is
 * interactive. So a fresh nonce is minted per request and handed to Next via
 * the request header, which it stamps onto every script tag it emits.
 *
 * `strict-dynamic` then lets those trusted scripts load the chunks they need
 * without listing each one, while still refusing anything injected into the
 * page by a caption, letter or diary entry.
 */
export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  // Dev needs 'unsafe-eval' for fast refresh; production must not have it.
  const scriptSrc =
    process.env.NODE_ENV === "development"
      ? `'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval'`
      : `'self' 'nonce-${nonce}' 'strict-dynamic'`;

  // `upgrade-insecure-requests` rewrites every request the page makes to
  // https://. On a plain-HTTP local address that means the dev port over TLS,
  // which nothing serves, so fetches hang rather than fail loudly: the login
  // page loads (a typed-in navigation predates the CSP) but POST /api/auth
  // never leaves the phone. localhost is exempt because browsers already treat
  // it as trustworthy; a LAN IP is not, which is why only the phone broke.
  const upgradeInsecure = isLocalAddress(request.headers.get("host"))
    ? []
    : [`upgrade-insecure-requests`];

  const csp = [
    `default-src 'self'`,
    `script-src ${scriptSrc}`,
    // Tailwind and inline style attributes need unsafe-inline for styles only.
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
    `font-src 'self' https://fonts.gstatic.com`,
    `img-src 'self' data: blob: https://*.public.blob.vercel-storage.com`,
    `connect-src 'self' https://*.public.blob.vercel-storage.com https://blob.vercel-storage.com`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `object-src 'none'`,
    ...upgradeInsecure,
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);

  return response;
}

export const config = {
  matcher: [
    /*
     * Everything except Next's static output, image optimiser and favicon —
     * those are immutable assets that need no per-request nonce.
     */
    {
      source: "/((?!_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
