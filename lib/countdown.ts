/*
 * Countdown math, kept pure and free of React so the "date has passed" branch
 * is testable now rather than in April 2027 — call timeUntil() with any `now`.
 */

export type Tick = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  passed: boolean;
};

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** Time remaining from `nowMs` until `targetMs`, floored at zero once passed. */
export function timeUntil(targetMs: number, nowMs: number): Tick {
  const diff = targetMs - nowMs;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, passed: true };
  }

  return {
    days: Math.floor(diff / DAY),
    hours: Math.floor((diff % DAY) / HOUR),
    minutes: Math.floor((diff % HOUR) / MINUTE),
    seconds: Math.floor((diff % MINUTE) / SECOND),
    passed: false,
  };
}
