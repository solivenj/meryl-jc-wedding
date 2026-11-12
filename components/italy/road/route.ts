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

/* Where the flights leave and land: Italy 2022 (leg 3) and the crossing (leg 7). */
export const fA3 = legPt(3, 0.13);
export const fB3 = legPt(3, 0.33);
export const fA7 = legPt(7, 0.22);
export const fB7 = legPt(7, 0.78);

const RAW: Piece[] = [
  { kind: "spur", w: 1.0, ch: -1 },
  { kind: "road", from: legStart(1), seg: lineSeg(legEnd(1)), w: 1.8, ch: 0 },
  { kind: "road", from: legEnd(1), seg: hairpinSeg(1), w: 0.5, ch: 0 },
  { kind: "road", from: legStart(2), seg: lineSeg(legEnd(2)), w: 3.0, ch: 1, tag: "long" },
  { kind: "road", from: legEnd(2), seg: hairpinSeg(2), w: 0.5, ch: 1 },
  { kind: "road", from: legStart(3), seg: lineSeg(fA3), w: 0.5, ch: 2, ease: "out" },
  { kind: "flight", from: fA3, seg: arcSeg(fA3, fB3, 120), w: 1.0, ch: 2, ease: "io", tag: "fly1" },
  { kind: "road", from: fB3, seg: lineSeg(legEnd(3)), w: 1.9, ch: 2, tag: "italy22", car: "it" },
  { kind: "flight", from: legEnd(3), seg: hairpinSeg(3), w: 1.0, ch: 3, ease: "io", tag: "flyhome" },
  { kind: "road", from: legStart(4), seg: lineSeg(legEnd(4)), w: 1.9, ch: 3 },
  { kind: "road", from: legEnd(4), seg: hairpinSeg(4), w: 0.5, ch: 3 },
  { kind: "road", from: legStart(5), seg: lineSeg(legPt(5, 0.25)), w: 0.6, ch: 4, ease: "out" },
  { kind: "pause", w: 0.8, ch: 4, tag: "bali" },
  { kind: "road", from: legPt(5, 0.25), seg: lineSeg(legPt(5, 0.75)), w: 1.0, ch: 5, ease: "io" },
  { kind: "pause", w: 0.8, ch: 5, tag: "spain" },
  { kind: "road", from: legPt(5, 0.75), seg: lineSeg(legEnd(5)), w: 0.4, ch: 5, ease: "in" },
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
   California: the long road, from the right edge. */
export const SPURS = {
  a: `M -60 ${Y0 + 90} C 20 ${Y0 + 90} 63 ${Y0 + 24} ${XL} ${Y0}`,
  b: `M 1240 ${Y0 + 260} C 700 ${Y0 + 260} 63 ${Y0 + 24} ${XL} ${Y0}`,
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

export function ease(kind: Piece["ease"], t: number): number {
  if (kind === "out") return 1 - Math.pow(1 - t, 2.2);
  if (kind === "in") return Math.pow(t, 1.8);
  if (kind === "io") return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  return t;
}

/* Decorative, not a fact: road distance only (frozen while flying), plus up
   to 2,100 miles for the long-distance years; kilometres while in Italy. */
const LONG = pieceIndex("long");
const ITALY22 = pieceIndex("italy22");
const LANDED = pieceIndex("landed");
export function odometerReading(o: { i: number; t: number; roadUnits: number }): { value: number; unit: "MI" | "KM" } {
  const miles = o.roadUnits * 0.36 + (o.i === LONG ? o.t * 2100 : o.i > LONG ? 2100 : 0);
  const km = o.i === ITALY22 || o.i >= LANDED;
  return km ? { value: miles * 1.609, unit: "KM" } : { value: miles, unit: "MI" };
}
