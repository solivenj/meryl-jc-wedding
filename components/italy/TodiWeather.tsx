"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { SmallCaps } from "@/components/italy/Type";
import { WeatherGlyph, glyphFor } from "@/components/italy/WeatherGlyph";
import { ITALY_EXPLORE } from "@/lib/italy-content";
import { EASE_OUT } from "@/lib/motion";

/*
 * Live weather in Todi: conditions now, then three day tabs, each with a
 * strip of three-hourly slots that slides sideways.
 *
 * Open-Meteo is free, keyless and CORS-open, so this fetches straight from
 * the browser and the page itself stays static. Asking for Europe/Rome means
 * every timestamp comes back as Todi wall-clock time ("2026-11-11T15:00"),
 * which is why the times below are read off the string rather than through
 * Date, which would shift them into the guest's own zone.
 *
 * Fahrenheit leads because most guests are American; Celsius rides along.
 * Refreshes every fifteen minutes, and when the tab comes back into view.
 */

const { live } = ITALY_EXPLORE;
const REFRESH_MS = 15 * 60 * 1000;
const STEP_HOURS = 3;

const FORECAST_URL =
  "https://api.open-meteo.com/v1/forecast" +
  `?latitude=${live.latitude}&longitude=${live.longitude}` +
  "&current=temperature_2m,apparent_temperature,weather_code,cloud_cover,is_day" +
  "&hourly=temperature_2m,weather_code,precipitation_probability,cloud_cover,is_day" +
  "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,cloud_cover_mean" +
  `&timezone=${encodeURIComponent(live.timeZone)}&forecast_days=3`;

type Slot = { time: string; temp: number; code: number; rain: number | null; cloud: number; isDay: boolean };
type Day = {
  date: string;
  code: number;
  high: number;
  low: number;
  rain: number | null;
  cloud: number;
  slots: Slot[];
};
type Weather = {
  now: { time: string; temp: number; feels: number; code: number; cloud: number; isDay: boolean };
  days: Day[];
};

/* ---- formatting ------------------------------------------------------- */

const f = (c: number) => Math.round((c * 9) / 5 + 32);
const c = (v: number) => Math.round(v);

function describe(code: number, isDay: boolean) {
  if (code === 0) return isDay ? "Sunny" : "Clear";
  if (code === 1) return isDay ? "Mostly sunny" : "Mostly clear";
  if (code === 2) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if (code <= 48) return "Fog";
  if (code <= 55) return "Drizzle";
  if (code <= 57) return "Freezing drizzle";
  if (code === 61) return "Light rain";
  if (code === 63) return "Rain";
  if (code === 65) return "Heavy rain";
  if (code <= 67) return "Freezing rain";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Showers";
  if (code <= 86) return "Snow showers";
  if (code === 95) return "Thunderstorms";
  return "Thunderstorms with hail";
}

function skyWords(cloud: number) {
  if (cloud <= 10) return "Clear skies";
  if (cloud <= 30) return "Mostly clear";
  if (cloud <= 60) return "Partly cloudy";
  if (cloud <= 85) return "Mostly cloudy";
  return "Overcast";
}

/* "2026-11-11T15:00" -> "3 PM". Wall-clock time in Todi, read off the string. */
function hourLabel(iso: string) {
  const h = Number(iso.slice(11, 13));
  if (h === 0) return "12 AM";
  if (h === 12) return "12 PM";
  return h < 12 ? `${h} AM` : `${h - 12} PM`;
}

function clockLabel(iso: string) {
  const m = iso.slice(14, 16);
  return hourLabel(iso).replace(" ", `:${m} `);
}

/* Calendar dates as UTC noon so no zone can push them over midnight. */
function weekday(date: string, style: "short" | "long") {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", { weekday: style, timeZone: "UTC" });
}

function dayTabLabel(date: string, i: number) {
  if (i === 0) return "Today";
  if (i === 1) return "Tomorrow";
  return weekday(date, "long");
}

/* ---- data --------------------------------------------------------------- */

/* eslint-disable @typescript-eslint/no-explicit-any -- the API response is
   read once, here, into the typed shape above. */
function shape(j: any): Weather {
  const h = j.hourly;
  const d = j.daily;
  const days: Day[] = d.time.map((date: string, i: number) => {
    const slots: Slot[] = [];
    h.time.forEach((t: string, k: number) => {
      if (!t.startsWith(date) || Number(t.slice(11, 13)) % STEP_HOURS !== 0) return;
      slots.push({
        time: t,
        temp: h.temperature_2m[k],
        code: h.weather_code[k],
        rain: h.precipitation_probability[k],
        cloud: h.cloud_cover[k],
        isDay: h.is_day[k] === 1,
      });
    });
    return {
      date,
      code: d.weather_code[i],
      high: d.temperature_2m_max[i],
      low: d.temperature_2m_min[i],
      rain: d.precipitation_probability_max[i],
      cloud: d.cloud_cover_mean[i],
      slots,
    };
  });
  const cur = j.current;
  return {
    now: {
      time: cur.time,
      temp: cur.temperature_2m,
      feels: cur.apparent_temperature,
      code: cur.weather_code,
      cloud: cur.cloud_cover,
      isDay: cur.is_day === 1,
    },
    days,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

function useTodiWeather() {
  const [data, setData] = useState<Weather | null>(null);
  const [failed, setFailed] = useState(false);

  const load = useCallback((signal?: AbortSignal) => {
    fetch(FORECAST_URL, { signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((j) => {
        setData(shape(j));
        setFailed(false);
      })
      .catch((e) => {
        if ((e as Error)?.name !== "AbortError") setFailed(true);
      });
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    const id = window.setInterval(() => load(), REFRESH_MS);
    const onVisible = () => document.visibilityState === "visible" && load();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      controller.abort();
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [load]);

  return { data, failed };
}

/* ---- pieces --------------------------------------------------------------- */

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <span className="font-caps text-[calc(9px*var(--fs-scale))] uppercase tracking-[0.22em] text-ink-soft">
        {label}
      </span>
      <span className="font-body text-[calc(17px*var(--fs-scale))] leading-[1.35] text-ink">{children}</span>
    </div>
  );
}

function Arrow({ dir, onClick, disabled }: { dir: "prev" | "next"; onClick: () => void; disabled: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Earlier hours" : "Later hours"}
      className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[var(--color-rule)] text-ink transition-colors duration-200 hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest disabled:opacity-30 disabled:hover:border-[var(--color-rule)]"
    >
      <svg aria-hidden="true" viewBox="0 0 16 16" width={12} height={12} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d={dir === "prev" ? "M10 3 5 8l5 5" : "M6 3l5 5-5 5"} />
      </svg>
    </button>
  );
}

function HourStrip({ day, nowTime }: { day: Day; nowTime: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  /* The slot covering the current hour, if it is on this day. */
  const nowIndex = useMemo(() => {
    const hour = Number(nowTime.slice(11, 13));
    if (!nowTime.startsWith(day.date)) return -1;
    return day.slots.findIndex((s) => Number(s.time.slice(11, 13)) === hour - (hour % STEP_HOURS));
  }, [day, nowTime]);

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setEdges({
      start: el.scrollLeft <= 2,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2,
    });
  }, []);

  /* Open today's strip on the current slot; other days start at midnight. */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const target = nowIndex > 0 ? (el.children[nowIndex] as HTMLElement | undefined) : undefined;
    el.scrollTo({ left: target ? target.offsetLeft - el.offsetLeft : 0 });
    measure();
  }, [day.date, nowIndex, measure]);

  const page = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <span className="font-caps text-[calc(9px*var(--fs-scale))] uppercase tracking-[0.22em] text-ink-soft">
          {live.hourlyLabel}
        </span>
        <div className="flex gap-2">
          <Arrow dir="prev" onClick={() => page(-1)} disabled={edges.start} />
          <Arrow dir="next" onClick={() => page(1)} disabled={edges.end} />
        </div>
      </div>

      {/* Native scroll with snap, so a finger, a trackpad and the arrow keys
          all work; the buttons above are for mice. Faded at whichever edge
          has more to show. */}
      <div
        ref={ref}
        onScroll={measure}
        tabIndex={0}
        role="region"
        aria-label={`Three-hourly forecast for ${weekday(day.date, "long")}`}
        className="flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest motion-reduce:scroll-auto [&::-webkit-scrollbar]:hidden"
        style={{
          maskImage: `linear-gradient(to right, ${edges.start ? "#000" : "transparent"}, #000 28px, #000 calc(100% - 28px), ${edges.end ? "#000" : "transparent"})`,
        }}
      >
        {day.slots.map((s, i) => {
          const isNow = i === nowIndex;
          const past = nowIndex >= 0 && i < nowIndex;
          return (
            <div
              key={s.time}
              className={`flex w-[76px] shrink-0 snap-start flex-col items-center gap-1.5 border px-2 py-3 text-center transition-opacity ${
                isNow ? "border-ink/40 bg-[var(--color-ivory)]" : "border-transparent"
              } ${past ? "opacity-45" : ""}`}
            >
              <span className="font-caps text-[calc(9px*var(--fs-scale))] uppercase tracking-[0.14em] text-ink-soft">
                {isNow ? "Now" : hourLabel(s.time)}
              </span>
              <WeatherGlyph kind={glyphFor(s.code, s.isDay)} size={30} className="text-ink" />
              <span className="font-body text-[calc(18px*var(--fs-scale))] leading-none text-ink tabular-nums lining-nums">
                {f(s.temp)}°
              </span>
              <span className="font-body text-[calc(13px*var(--fs-scale))] leading-none text-ink-soft tabular-nums lining-nums">
                {c(s.temp)}°C
              </span>
              <span
                className="font-body text-[calc(13px*var(--fs-scale))] leading-none text-ink-soft tabular-nums lining-nums"
                aria-label={`${s.rain ?? 0}% chance of rain`}
              >
                <Drop /> {s.rain ?? 0}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Drop() {
  return (
    <svg aria-hidden="true" viewBox="0 0 12 12" width={9} height={9} className="mr-0.5 inline -translate-y-px" fill="none" stroke="currentColor" strokeWidth={1.2}>
      <path d="M6 1.5C6 1.5 2.5 5.6 2.5 7.8a3.5 3.5 0 0 0 7 0C9.5 5.6 6 1.5 6 1.5z" />
    </svg>
  );
}

/* ---- the card ------------------------------------------------------------- */

export function TodiWeather() {
  const { data, failed } = useTodiWeather();
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    if (!data) return;
    const n = data.days.length;
    const next = e.key === "ArrowRight" ? (i + 1) % n : e.key === "ArrowLeft" ? (i - 1 + n) % n : null;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  if (failed && !data) {
    return (
      <div className="w-full border border-[var(--color-rule)] px-5 py-6 text-left font-body text-[calc(16px*var(--fs-scale))] leading-[1.6] font-light text-ink-soft italic">
        {live.unavailable}
      </div>
    );
  }

  const day = data?.days[active];
  const today = data?.days[0];

  return (
    <div
      className="flex w-full flex-col gap-6 border border-[var(--color-rule)] bg-[var(--color-ivory-deep)]/55 px-[clamp(16px,4vw,28px)] py-[clamp(20px,4vw,28px)] text-left"
      aria-busy={!data}
    >
      {/* Now */}
      <div className="flex items-baseline justify-between gap-3">
        <SmallCaps>{live.label}</SmallCaps>
        <span className="font-caps text-[calc(9px*var(--fs-scale))] uppercase tracking-[0.18em] text-ink-soft">
          {data ? `${weekday(data.now.time.slice(0, 10), "short")} · ${clockLabel(data.now.time)}` : " "}
        </span>
      </div>

      <div className="flex items-center gap-[clamp(14px,4vw,24px)]">
        <span className="flex size-[72px] shrink-0 items-center justify-center text-ink">
          {data ? <WeatherGlyph kind={glyphFor(data.now.code, data.now.isDay)} size={68} /> : null}
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex items-baseline gap-2.5">
            <span className="font-body leading-none font-light text-ink tabular-nums lining-nums [font-size:calc(clamp(46px,9vw,60px)*var(--fs-scale))]">
              {data ? `${f(data.now.temp)}°F` : "–"}
            </span>
            <span className="font-body text-[calc(18px*var(--fs-scale))] text-ink-soft tabular-nums lining-nums">
              {data ? `${c(data.now.temp)}°C` : ""}
            </span>
          </div>
          <span className="font-body text-[calc(18px*var(--fs-scale))] leading-snug text-ink">
            {data ? describe(data.now.code, data.now.isDay) : "Loading the sky over Todi…"}
          </span>
          <span className="font-body text-[calc(15px*var(--fs-scale))] leading-snug font-light text-ink-soft">
            {data ? `Feels like ${f(data.now.feels)}°F` : " "}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-4 border-y border-[var(--color-rule)] py-4 min-[520px]:grid-cols-4">
        <Stat label="High">{today ? `${f(today.high)}° / ${c(today.high)}°C` : "–"}</Stat>
        <Stat label="Low">{today ? `${f(today.low)}° / ${c(today.low)}°C` : "–"}</Stat>
        <Stat label="Rain">{today ? `${today.rain ?? 0}% chance` : "–"}</Stat>
        <Stat label="Sky">{data ? `${skyWords(data.now.cloud)} · ${data.now.cloud}%` : "–"}</Stat>
      </div>

      {/* Three days */}
      <div role="tablist" aria-label="Forecast day" className="grid grid-cols-3 gap-2">
        {(data?.days ?? [null, null, null]).map((d, i) => {
          const selected = i === active;
          return (
            <button
              key={d?.date ?? i}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`todi-day-${i}`}
              aria-selected={selected}
              aria-controls="todi-day-panel"
              tabIndex={selected ? 0 : -1}
              disabled={!d}
              onClick={() => setActive(i)}
              onKeyDown={(e) => onTabKey(e, i)}
              className={`relative flex min-w-0 flex-col items-center gap-1 px-1 py-3 text-center transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest ${
                selected ? "text-ink" : "text-ink-soft hover:text-ink"
              }`}
            >
              {selected && (
                <motion.span
                  layoutId="todi-day-marker"
                  className="absolute inset-0 border border-ink/40 bg-[var(--color-ivory)]"
                  transition={{ duration: reduced ? 0 : 0.35, ease: EASE_OUT }}
                />
              )}
              <span className="relative font-caps text-[calc(9px*var(--fs-scale))] uppercase tracking-[0.16em]">
                {d ? dayTabLabel(d.date, i) : " "}
              </span>
              <span className="relative h-[30px]">
                {d && <WeatherGlyph kind={glyphFor(d.code, true)} size={30} />}
              </span>
              <span className="relative font-body text-[calc(16px*var(--fs-scale))] leading-none tabular-nums lining-nums">
                {d ? (
                  <>
                    {f(d.high)}° <span className="text-ink-soft">{f(d.low)}°</span>
                  </>
                ) : (
                  " "
                )}
              </span>
              <span className="relative font-body text-[calc(13px*var(--fs-scale))] leading-none text-ink-soft tabular-nums lining-nums">
                {d ? (
                  <>
                    <Drop /> {d.rain ?? 0}%
                  </>
                ) : (
                  " "
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* The selected day */}
      <div id="todi-day-panel" role="tabpanel" aria-labelledby={`todi-day-${active}`} className="min-h-[214px]">
        <AnimatePresence mode="wait" initial={false}>
          {day && data && (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, y: reduced ? 0 : 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0.1 : 0.3, ease: EASE_OUT }}
              className="flex flex-col gap-4"
            >
              <p className="font-body text-[calc(16.5px*var(--fs-scale))] leading-[1.55] font-light text-ink-soft">
                <span className="text-ink">{weekday(day.date, "long")}:</span> {describe(day.code, true).toLowerCase()},{" "}
                {skyWords(day.cloud).toLowerCase()}. High {f(day.high)}°F ({c(day.high)}°C), low {f(day.low)}°F ({c(day.low)}°C),
                and a {day.rain ?? 0}% chance of rain.
              </p>
              <HourStrip day={day} nowTime={data.now.time} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="font-body text-[calc(13.5px*var(--fs-scale))] leading-[1.5] font-light text-ink-soft italic">
        Times are Todi time. Weather from{" "}
        {/* Open-Meteo's data is CC BY 4.0, so the credit is a condition of
            use, not a courtesy. */}
        <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
          Open-Meteo
        </a>
        , refreshed every fifteen minutes.
      </p>
    </div>
  );
}
