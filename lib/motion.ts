/*
 * All animation timing lives here (PRD §7) — no magic durations inline.
 * Names follow the PRD's beats: entrance (§3.2), idle, unravel (§3.3),
 * reduced-motion branch, and the Act II scroll layer (§4.2, user-upgraded).
 */

/** Shared ease-out for entrances and draws. */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/** Accelerating ease for the ribbon "whip" exit (fast finish). */
export const EASE_WHIP = [0.55, 0, 0.85, 0.36] as const;

/** Act I entrance choreography (§3.2). Five beats, total ≤ 3s. */
export const ENTRANCE = {
  travel: 28, // px rise
  duration: 0.7,
  stagger: 0.3, // tightened from 0.35 to fit the tagline beat
  envelopeSpring: { type: "spring", stiffness: 120, damping: 18 } as const,
};

/** Act I idle loops (§3.2). */
export const IDLE = {
  breatheDelay: 4, // s before the first bow breathe
  breatheScale: 1.02,
  breathePeriod: 6,
  /* Trough raised from the PRD's 0.55 so ink stays AA (4.5:1) mid-pulse. */
  ctaPulse: { opacityMin: 0.7, opacityMax: 1, period: 2.5 },
};

/** The four-beat unravel (§3.3). Beats overlap; total 1.8–2.6s. */
export const UNRAVEL = {
  bowRelease: 0.5,
  bandOverlap: 0.25, // bands start this far into the bow release
  bandSlide: 0.8,
  bandGap: 0.2, // vertical band trails the horizontal one
  flapOpen: 0.6,
  reveal: 0.7,
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
