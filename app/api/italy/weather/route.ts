import { ITALY_EXPLORE } from "@/lib/italy-content";

/*
 * Todi's forecast, fetched from Open-Meteo on the server and handed to the
 * Italy tab's weather card (components/italy/TodiWeather.tsx).
 *
 * The card used to call Open-Meteo straight from the browser, and browser
 * extensions (ad and privacy blockers, shopping add-ons) block third-party
 * APIs like it, which left the card on "Loading". A same-origin request is
 * not blocked. Under /api/italy, so the Italy gate covers it (proxy.ts).
 *
 * The CDN keeps each answer for fifteen minutes, the same as the card's own
 * refresh, so Open-Meteo sees one request a quarter hour however many guests
 * are looking.
 */
const { live } = ITALY_EXPLORE;

const FORECAST_URL =
  "https://api.open-meteo.com/v1/forecast" +
  `?latitude=${live.latitude}&longitude=${live.longitude}` +
  "&current=temperature_2m,apparent_temperature,weather_code,cloud_cover,is_day" +
  "&hourly=temperature_2m,weather_code,precipitation_probability,is_day" +
  "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max" +
  `&timezone=${encodeURIComponent(live.timeZone)}&forecast_days=3`;

export async function GET() {
  try {
    const r = await fetch(FORECAST_URL, { cache: "no-store", signal: AbortSignal.timeout(8000) });
    if (!r.ok) return Response.json({ error: "Forecast unavailable." }, { status: 502 });
    return Response.json(await r.json(), {
      headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=600" },
    });
  } catch {
    return Response.json({ error: "Forecast unavailable." }, { status: 502 });
  }
}
