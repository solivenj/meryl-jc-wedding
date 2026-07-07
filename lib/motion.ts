/*
 * All animation timing lives here (PRD §7) — no magic durations inline.
 * Names follow the PRD's beats: entrance (§3.2), idle, reduced-motion
 * branch, and the Act II scroll layer (§4.2, user-upgraded). The envelope
 * is a static image asset now — the unravel beats are gone.
 */

/** Shared ease-out for entrances and draws. */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/** Act I entrance choreography (§3.2). Five beats, total ≤ 3s.
    (travel/duration/ease live in globals.css `.act-rise`; stagger drives
    the per-beat delays.) */
export const ENTRANCE = {
  duration: 0.7,
  stagger: 0.3,
};

/** Act I idle loops (§3.2). */
export const IDLE = {
  /* Trough raised from the PRD's 0.55 so ink stays AA (4.5:1) mid-pulse. */
  ctaPulse: { opacityMin: 0.7, opacityMax: 1, period: 2.5 },
};

/** Reduced-motion branch (§3.3): straight cross-fade to Act II. */
export const REDUCED = { crossFade: 0.4 };

/** Act II scroll reveals — baseline for staggered children. */
export const SCROLL_REVEAL = {
  travel: 20,
  duration: 0.6,
  stagger: 0.08,
  viewportAmount: 0.3,
};

/** S1 hero: photo settle + parallax cap. */
export const HERO_SETTLE = { fromScale: 1.06, parallaxPct: 8 };

/** S3 bird-and-ribbon line art self-draw. */
export const LINE_ART_DRAW = { duration: 1.6 };

/** S4 hairline rules extending scaleX 0→1 as rows land. */
export const RULE_EXTEND = { duration: 0.5, stagger: 0.1 };

/** S2 copy line-group masks / S5 clip-path reveal. */
export const MASK_REVEAL = { duration: 0.7, lineStagger: 0.12 };
