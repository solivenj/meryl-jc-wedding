"use client";

import { useEffect, useState } from "react";
import { SmallCaps } from "@/components/italy/Type";
import { ITALY_EXPLORE } from "@/lib/italy-content";

/*
 * The live forecast for the wedding days, from Open-Meteo (free, no key,
 * CORS-open, so it is fetched straight from the browser and the page stays
 * static).
 *
 * It renders nothing until the first day is within `showFromDays`: before
 * then a forecast is either unavailable (Open-Meteo goes sixteen days out)
 * or too far ahead to be worth reading, and the climate averages above it
 * already answer the question. It also renders nothing if the fetch fails —
 * the averages are the fallback, not an error message.
 *
 * ?forecast=preview shows the next four days instead, so the block can be
 * checked months before it switches on by itself.
 */

const { forecast } = ITALY_EXPLORE;

type Day = { date: string; code: number; high: number; low: number; rain: number | null };

/* WMO weather interpretation codes, as Open-Meteo returns them. */
function describe(code: number) {
  if (code === 0) return "Clear";
  if (code <= 2) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if (code <= 48) return "Fog";
  if (code <= 57) return "Drizzle";
  if (code <= 67) return "Rain";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Showers";
  if (code <= 86) return "Snow showers";
  return "Thunderstorms";
}

/* Calendar arithmetic on YYYY-MM-DD strings at UTC noon, so no time zone
   can push a date across midnight. */
function addDays(iso: string, n: number) {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

function todayInTodi() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Rome" }).format(new Date());
}

function dayLabel(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
}

const fahrenheit = (c: number) => Math.round((c * 9) / 5 + 32);

export function TodiForecast() {
  const [days, setDays] = useState<Day[] | null>(null);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    const today = todayInTodi();
    const isPreview = new URLSearchParams(window.location.search).get("forecast") === "preview";
    const opensOn = addDays(forecast.from, -forecast.showFromDays);
    if (!isPreview && (today < opensOn || today > forecast.to)) return;

    const start = isPreview ? today : today > forecast.from ? today : forecast.from;
    const end = isPreview ? addDays(today, 3) : forecast.to;
    const url =
      "https://api.open-meteo.com/v1/forecast" +
      `?latitude=${forecast.latitude}&longitude=${forecast.longitude}` +
      "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max" +
      `&timezone=Europe%2FRome&start_date=${start}&end_date=${end}`;

    const controller = new AbortController();
    fetch(url, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((j) => {
        const d = j.daily;
        setPreview(isPreview);
        setDays(
          d.time.map((date: string, i: number) => ({
            date,
            code: d.weather_code[i],
            high: Math.round(d.temperature_2m_max[i]),
            low: Math.round(d.temperature_2m_min[i]),
            rain: d.precipitation_probability_max[i],
          })),
        );
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  if (!days?.length) return null;

  return (
    <div className="flex w-full flex-col items-start gap-2.5">
      <SmallCaps>{preview ? `${forecast.label} (preview)` : forecast.label}</SmallCaps>
      <ul className="flex w-full flex-col gap-2 font-body text-[calc(18px*var(--fs-scale))] leading-[1.7] font-light text-ink-soft">
        {days.map((d) => (
          <li key={d.date}>
            <span className="text-ink">{dayLabel(d.date)}</span>: {describe(d.code)}, {d.high}° /{" "}
            {d.low}°C ({fahrenheit(d.high)}° / {fahrenheit(d.low)}°F)
            {d.rain != null && d.rain >= 20 && `, ${d.rain}% chance of rain`}
          </li>
        ))}
      </ul>
      <p className="font-body text-[calc(15px*var(--fs-scale))] leading-[1.6] font-light text-ink-soft italic">
        {/* Open-Meteo's data is CC BY 4.0, so the credit is a condition of
            use, not a courtesy. */}
        Forecast from{" "}
        <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
          Open-Meteo
        </a>
        , refreshed each time this page loads.
      </p>
    </div>
  );
}
