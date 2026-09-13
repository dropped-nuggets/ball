/**
 * True for hosts that are reached over plain HTTP during local development:
 * loopback, mDNS `.local` names, and the private (RFC 1918) ranges a phone
 * uses to reach a dev server over the LAN.
 *
 * Two things have to agree about this, so they share one answer: the session
 * cookie's `Secure` flag (`lib/auth.ts`) and the CSP's
 * `upgrade-insecure-requests` (`proxy.ts`). Both are correct on a real
 * deployment and both silently break sign-in over http:// — one by dropping the
 * cookie, the other by rewriting every fetch to an https:// port nothing
 * listens on.
 *
 * Keyed on the host rather than NODE_ENV, since `next start` reports production
 * while still serving http://localhost. A real deployment has a public
 * hostname and so keeps both protections.
 *
 * Deliberately dependency-free: `proxy.ts` runs in the Edge runtime and
 * cannot pull in anything Node-only.
 */
export function isLocalAddress(host: string | null | undefined): boolean {
  if (!host) return false;

  // Strip the port, and the brackets around an IPv6 literal.
  const hostname = host.replace(/^\[|\]$/g, "").split(":")[0].toLowerCase();

  return (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local") ||
    hostname === "127.0.0.1" ||
    hostname === "::1" ||
    hostname === "" || // "[::1]:3000" leaves an empty first segment.
    /^10\./.test(hostname) ||
    /^192\.168\./.test(hostname) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(hostname)
  );
}
