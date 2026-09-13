import type { NextConfig } from "next";

/**
 * SEC-19: browser-enforced boundaries.
 *
 * The Content-Security-Policy is NOT set here — it needs a per-request nonce,
 * so it lives in proxy.ts. These are the static headers that carry no
 * per-request state.
 */
const nextConfig: NextConfig = {
  /**
   * Pin the Turbopack root to this project.
   *
   * Turbopack infers the root by walking up for a lockfile or workspace file,
   * and there is a stray `pnpm-workspace.yaml` in the user's home directory
   * above this repo. Without this, it warns on every start and would otherwise
   * treat a directory outside the repository as the project root.
   */
  turbopack: {
    root: __dirname,
  },

  /**
   * Testing on a phone means loading the dev server over the LAN, and Next
   * blocks cross-origin requests to dev-only assets from any host but the one
   * it started on. The visible symptom is not an error: the page renders but
   * never hydrates, so the login form falls back to a native GET and just
   * reloads itself.
   *
   * Private ranges only, and `next dev` only — this key has no effect on a
   * production build, so it cannot widen anything on Vercel.
   */
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "172.16.*.*", "*.local"],

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.public.blob.vercel-storage.com" },
    ],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
