/**
 * The name shown on screen.
 *
 * Change these two lines and the whole site renames — wordmark, browser tab,
 * PWA install name, login screen. Nothing else needs touching, and nothing
 * breaks: no cookie, env var, saved progress or URL depends on them.
 *
 * (The deployment is named `rizzu` — see package.json — which is what decides
 * the .vercel.app address. That one is not safe to change after deploy.)
 */
export const SITE_NAME = "Rijuko";

export const SITE_TAGLINE = "a piece of Nepal, wherever you are";

/** The wordmark, letterspaced in the header and on the opening screen. */
export const SITE_WORDMARK = SITE_NAME.toUpperCase();
