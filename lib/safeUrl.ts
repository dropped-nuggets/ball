/**
 * Stored image urls are rendered straight into <img src>, so only real image
 * sources are ever accepted — never an arbitrary caller-supplied string
 * (SEC-05). Shared by photos, scrapbook stickers and lockets.
 */
export function safeImageUrl(raw: unknown): string | null {
  const value = String(raw ?? "");
  if (!value) return null;

  // The no-Blob fallback stores downscaled photos inline.
  if (value.startsWith("data:image/")) return value.slice(0, 8_000_000);

  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:"
      ? parsed.toString()
      : null;
  } catch {
    return null;
  }
}

/** Same idea for links people paste on the mixtape. */
export function safeLinkUrl(raw: unknown): string {
  const value = String(raw ?? "").trim();
  if (!value) return "";
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:"
      ? parsed.toString()
      : "";
  } catch {
    return "";
  }
}
