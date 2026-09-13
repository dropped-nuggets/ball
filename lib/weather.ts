import "server-only";

/**
 * Weather for both cities, from Open-Meteo.
 *
 * Open-Meteo needs no API key and is free for non-commercial use, which keeps
 * this deployable with zero setup. Fetched server-side so no key, quota or
 * extra CSP `connect-src` entry is ever exposed to the browser.
 */

export type Place = {
  key: "nepal" | "uk";
  label: string;
  sub: string;
  lat: number;
  lon: number;
  timeZone: string;
};

export const PLACES: Place[] = [
  {
    key: "nepal",
    label: "Lalitpur",
    sub: "Pimbahal",
    lat: 27.6742,
    lon: 85.3186,
    timeZone: "Asia/Kathmandu",
  },
  {
    key: "uk",
    label: process.env.NEXT_PUBLIC_UK_CITY || "London",
    sub: "where you are",
    lat: Number(process.env.UK_LAT ?? 51.5072),
    lon: Number(process.env.UK_LON ?? -0.1276),
    timeZone: "Europe/London",
  },
];

export type Weather = {
  key: string;
  tempC: number | null;
  code: number | null;
  isDay: boolean;
};

/**
 * WMO weather codes, collapsed into the handful of states worth drawing.
 * https://open-meteo.com/en/docs
 */
export type Sky =
  | "clear"
  | "cloudy"
  | "overcast"
  | "fog"
  | "rain"
  | "snow"
  | "storm"
  | "unknown";

export function skyFor(code: number | null): Sky {
  if (code === null) return "unknown";
  if (code === 0 || code === 1) return "clear";
  if (code === 2) return "cloudy";
  if (code === 3) return "overcast";
  if (code === 45 || code === 48) return "fog";
  if (code >= 51 && code <= 67) return "rain";
  if (code >= 71 && code <= 77) return "snow";
  if (code >= 80 && code <= 82) return "rain";
  if (code >= 85 && code <= 86) return "snow";
  if (code >= 95) return "storm";
  return "unknown";
}

export const SKY_LABEL: Record<Sky, string> = {
  clear: "clear",
  cloudy: "some cloud",
  overcast: "grey",
  fog: "fog",
  rain: "rain",
  snow: "snow",
  storm: "storm",
  unknown: "—",
};

/**
 * Both cities in one request. Returns nulls rather than throwing: the weather
 * is decoration, and the page must render without it.
 */
export async function getWeather(): Promise<Weather[]> {
  const lat = PLACES.map((p) => p.lat).join(",");
  const lon = PLACES.map((p) => p.lon).join(",");
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,weather_code,is_day`;

  try {
    const res = await fetch(url, {
      // One call every 15 minutes is plenty for a decorative panel.
      next: { revalidate: 900 },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) throw new Error(String(res.status));

    const data = await res.json();
    const list = Array.isArray(data) ? data : [data];

    return PLACES.map((p, i) => ({
      key: p.key,
      tempC: list[i]?.current?.temperature_2m ?? null,
      code: list[i]?.current?.weather_code ?? null,
      isDay: list[i]?.current?.is_day === 1,
    }));
  } catch {
    return PLACES.map((p) => ({
      key: p.key,
      tempC: null,
      code: null,
      isDay: true,
    }));
  }
}
