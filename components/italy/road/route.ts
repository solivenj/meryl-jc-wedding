/*
 * The road trip's route: geometry, the ordered list of pieces the reader
 * scrolls through, and the maths that turns scroll progress into a place on
 * the road. Pure, no DOM, no imports — unit-tested in tests/road/route.test.ts.
 *
 * Every number here is copied from the approved prototype
 * (docs/superpowers/specs/2026-11-11-our-story-road-trip/prototype.html).
 * Change one only to fix a bug, and say why next to it.
 */

/* The world is one SVG, 1200 × 4880 units. Y grows downward, so the drive
   starts near the bottom and climbs to Todi at the top. */
export const W = 1200;
export const H = 4880;
export const XL = 160;
export const XR = 1040;
export const RISE = 220; // each leg climbs this much across its width
export const HP = 240; // each hairpin climbs this much
export const STEP = 460;
export const Y0 = 4400; // where leg 1 starts
export const SCALE_W = 0.72; // overall scroll-length knob
export const PZ = { x: 560, y: 580 }; // the piazza

export type Pt = { x: number; y: number };

const f1 = (n: number) => Math.round(n * 10) / 10;

/* Eight legs. Odd legs run left to right, even legs right to left. */
export const legStart = (i: number): Pt => ({ x: i % 2 ? XL : XR, y: Y0 - (i - 1) * STEP });
export const legEnd = (i: number): Pt => ({ x: i % 2 ? XR : XL, y: Y0 - (i - 1) * STEP - RISE });
export const legPt = (i: number, f: number): Pt => {
  const a = legStart(i);
  const b = legEnd(i);
  return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f };
};
export const legY = (i: number, x: number): number => {
  const a = legStart(i);
  const b = legEnd(i);
  return a.y + (b.y - a.y) * ((x - a.x) / (b.x - a.x));
};

export const lineSeg = (p: Pt): string => `L ${f1(p.x)} ${f1(p.y)}`;
/* Control points continue the leg's direction, so the joins are smooth. */
export const hairpinSeg = (i: number): string => {
  const e = legEnd(i);
  const s = i % 2 ? 1 : -1;
  return `C ${e.x + s * 184} ${e.y - 46} ${e.x + s * 184} ${e.y - HP + 46} ${e.x} ${e.y - HP}`;
};
export const arcSeg = (a: Pt, b: Pt, lift: number): string =>
  `C ${f1(a.x + (b.x - a.x) * 0.25)} ${f1(a.y - lift)} ${f1(b.x - (b.x - a.x) * 0.25)} ${f1(b.y - lift)} ${f1(b.x)} ${f1(b.y)}`;

export type PieceKind = "spur" | "road" | "flight" | "pause";
export type Piece = {
  kind: PieceKind;
  w: number; // scroll weight, already multiplied by SCALE_W
  ch: number; // chapter: -1 prologue, 0–8 stops, 9 arrived
  from?: Pt;
  seg?: string;
  ease?: "in" | "out" | "io";
  tag?: string;
  car?: "us" | "it";
};

/* Where the two spur roads merge: a little way along leg 1 rather than at its
   start, so the fork sits in from the left edge. The road proper starts here;
   the stretch of leg 1 before it is covered by the spurs. */
export const FORK = legPt(1, 0.12);

/* Where the car stops for a beat: beside the Boston sign (art/boston.ts puts
   it at x ≈ 358 on leg 1) and halfway along Chicago's leg. Each leg keeps
   its prototype road weight, split either side of the pause. */
export const BOSTON_STOP = legPt(1, 0.225);
export const CHICAGO_STOP = legPt(4, 0.5);

/* Where the flights leave and land: Italy 2022 (leg 3) and the crossing (leg 7). */
/* Italy 2022 takes off right as the hairpin bend ends and flies a
   little further than the prototype (.01 to .25 of leg 3), leaving the
   rest of the leg for the Florence, Tuscany and Amalfi drawings. */
export const fA3 = legPt(3, 0.01);
export const fB3 = legPt(3, 0.25);
export const fA7 = legPt(7, 0.22);
export const fB7 = legPt(7, 0.78);

const RAW: Piece[] = [
  { kind: "spur", w: 1.0, ch: -1 },
  { kind: "road", from: FORK, seg: lineSeg(BOSTON_STOP), w: 0.6, ch: 0, ease: "out" },
  { kind: "pause", w: 0.8, ch: 0, tag: "boston" },
  { kind: "road", from: BOSTON_STOP, seg: lineSeg(legEnd(1)), w: 1.2, ch: 0, ease: "in" },
  { kind: "road", from: legEnd(1), seg: hairpinSeg(1), w: 0.5, ch: 0 },
  { kind: "road", from: legStart(2), seg: lineSeg(legEnd(2)), w: 3.0, ch: 1, tag: "long" },
  { kind: "road", from: legEnd(2), seg: hairpinSeg(2), w: 0.5, ch: 1 },
  { kind: "road", from: legStart(3), seg: lineSeg(fA3), w: 0.5, ch: 2, ease: "out" },
  { kind: "flight", from: fA3, seg: arcSeg(fA3, fB3, 120), w: 1.0, ch: 2, ease: "io", tag: "fly1" },
  { kind: "road", from: fB3, seg: lineSeg(legEnd(3)), w: 1.9, ch: 2, tag: "italy22", car: "it" },
  { kind: "flight", from: legEnd(3), seg: hairpinSeg(3), w: 1.0, ch: 3, ease: "io", tag: "flyhome" },
  { kind: "road", from: legStart(4), seg: lineSeg(CHICAGO_STOP), w: 0.95, ch: 3, ease: "out" },
  { kind: "pause", w: 0.8, ch: 3, tag: "chicago" },
  { kind: "road", from: CHICAGO_STOP, seg: lineSeg(legEnd(4)), w: 0.95, ch: 3, ease: "in" },
  { kind: "road", from: legEnd(4), seg: hairpinSeg(4), w: 0.5, ch: 3 },
  /* Leg 5: the five mini stops (art/miniStops.ts). The car drives straight
     through, no pauses; the road keeps the prototype leg's weight (2.0). */
  { kind: "road", from: legStart(5), seg: lineSeg(legPt(5, 0.5)), w: 1.0, ch: 4, tag: "leg5a" },
  { kind: "road", from: legPt(5, 0.5), seg: lineSeg(legEnd(5)), w: 1.0, ch: 5, tag: "leg5b" },
  { kind: "road", from: legEnd(5), seg: hairpinSeg(5), w: 0.5, ch: 5 },
  { kind: "road", from: legStart(6), seg: lineSeg(legPt(6, 0.52)), w: 1.0, ch: 6, ease: "out" },
  { kind: "pause", w: 1.5, ch: 6, tag: "ring" },
  { kind: "road", from: legPt(6, 0.52), seg: lineSeg(legEnd(6)), w: 0.6, ch: 6, ease: "in" },
  { kind: "road", from: legEnd(6), seg: hairpinSeg(6), w: 0.5, ch: 6 },
  { kind: "road", from: legStart(7), seg: lineSeg(fA7), w: 0.6, ch: 7, ease: "out" },
  {
    kind: "flight",
    from: fA7,
    seg: `C ${f1(fA7.x + 120)} ${f1(fA7.y - 140)} ${f1(fB7.x - 120)} ${f1(fB7.y - 110)} ${f1(fB7.x)} ${f1(fB7.y)}`,
    w: 1.4,
    ch: 7,
    ease: "io",
    tag: "fly3",
  },
  { kind: "road", from: fB7, seg: lineSeg(legEnd(7)), w: 0.5, ch: 7, ease: "in", tag: "landed", car: "it" },
  { kind: "road", from: legEnd(7), seg: hairpinSeg(7), w: 0.5, ch: 7, car: "it" },
  { kind: "road", from: legStart(8), seg: lineSeg(legEnd(8)), w: 1.6, ch: 8, car: "it" },
  { kind: "road", from: legEnd(8), seg: `C 50 932 300 600 ${PZ.x} ${PZ.y}`, w: 1.1, ch: 8, ease: "out", car: "it" },
  { kind: "pause", w: 1.8, ch: 9, tag: "park" },
];

/* Pauses inherit the car of the piece before them, so the car never swaps
   while standing still. */
export const PIECES: readonly Piece[] = RAW.map((p, i) => {
  const car = p.kind === "pause" && !p.car ? RAW.slice(0, i).reverse().find((q) => q.seg)?.car : p.car;
  return { ...p, w: p.w * SCALE_W, ...(car ? { car } : {}) };
});

/* John from New Jersey: the short road, from the left edge. Meryl from
   California: the long road, from the right edge. Both arrive at FORK along
   leg 1's own slope, so the join is smooth. */
const FDX = FORK.x - XL;
export const SPURS = {
  a: `M -60 ${Y0 + 90} C ${f1(20 + FDX)} ${Y0 + 90} ${f1(63 + FDX)} ${f1(FORK.y + 24)} ${f1(FORK.x)} ${f1(FORK.y)}`,
  b: `M 1240 ${Y0 + 260} C 700 ${Y0 + 260} ${f1(63 + FDX)} ${f1(FORK.y + 24)} ${f1(FORK.x)} ${f1(FORK.y)}`,
};

/* The road as SVG paths, computed rather than measured so they can render on
   the server: `full` is one continuous path (the ink-reveal mask follows it),
   `road` is the same route with each flight replaced by a move-to, and
   `flights` are the dotted arcs. */
export function roadPaths(): { full: string; road: string; flights: string[]; spurs: string } {
  const moving = PIECES.filter((p) => p.kind === "road" || p.kind === "flight");
  const start = (p: Piece) => `M ${f1(p.from!.x)} ${f1(p.from!.y)}`;
  const endOf = (seg: string) => {
    const n = seg.trim().split(/[\s,]+/).map(Number).filter((v) => !Number.isNaN(v));
    return `M ${n[n.length - 2]} ${n[n.length - 1]}`;
  };
  return {
    full: moving.map((p, i) => (i === 0 ? `${start(p)} ${p.seg}` : p.seg)).join(" "),
    road: moving.map((p, i) => (i === 0 ? `${start(p)} ${p.seg}` : p.kind === "flight" ? endOf(p.seg!) : p.seg)).join(" "),
    flights: moving.filter((p) => p.kind === "flight").map((p) => `${start(p)} ${p.seg}`),
    spurs: `${SPURS.a} ${SPURS.b}`,
  };
}

export const CUM: number[] = PIECES.reduce<number[]>((acc, p) => [...acc, acc[acc.length - 1] + p.w], [0]);
export const TOTAL_W = CUM[CUM.length - 1];

export const pieceIndex = (tag: string): number => PIECES.findIndex((p) => p.tag === tag);

/* Scroll progress 0–1 → which piece, and how far through it. */
export function locate(p: number): { i: number; t: number } {
  /* The very end must be exactly parked: summing the weights leaves a hair
     of float error that would otherwise stop the keys short of the hook. */
  if (p >= 1) return { i: PIECES.length - 1, t: 1 };
  const s = Math.max(0, p) * TOTAL_W;
  let i = 0;
  while (i < PIECES.length - 1 && s >= CUM[i + 1]) i++;
  const t = Math.max(0, Math.min(1, (s - CUM[i]) / PIECES[i].w));
  return { i, t };
}

export const chapterStart = (ch: number): number => CUM[PIECES.findIndex((p) => p.ch === ch)] / TOTAL_W;

/* A stop's words come in this far (in scroll weight) ahead of the stop
   itself. At the stop the text block already sits low on screen and keeps
   sliding down as the car climbs, so arriving early gives the reader time
   to finish it while it is still in view. Only the words lead; the road
   sign, stop dots and phone card stay with the car. */
export const TEXT_LEAD = 0.4;
export const textChapter = (p: number): number => PIECES[locate(p + TEXT_LEAD / TOTAL_W).i].ch;
export const textOnAt = (ch: number): number => chapterStart(ch) - TEXT_LEAD / TOTAL_W;

export function ease(kind: Piece["ease"], t: number): number {
  if (kind === "out") return 1 - Math.pow(1 - t, 2.2);
  if (kind === "in") return Math.pow(t, 1.8);
  if (kind === "io") return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  return t;
}

/* The odometer runs from 0 to the great-circle distance from Chicago to the
   Monastero di Santa Margherita in Todi (41.878 N 87.630 W to 42.780 N
   12.408 E), reaching it as the car parks. It counts road only (frozen while
   flying), in miles throughout. */
export const TRIP_MILES = 4768;
export function odometerReading(o: { roadFraction: number }): { value: number; unit: "MI" | "KM" } {
  return { value: TRIP_MILES * Math.min(1, Math.max(0, o.roadFraction)), unit: "MI" };
}
