/* Five mini stops along leg 5 (the trips: France, Puerto Rico, Indonesia,
   Spain, Canada), replacing the prototype's Bali and Spain half stops. Each
   is just a name, a passport stamp and a large polaroid beside it. They
   zigzag up off the road, low, high, low, high, low, and the car drives
   straight through; each stop fades in as the car reaches it (engine.ts).

   Polaroid: public/italy/art/polaroid.jfif, knocked out to ink with the
   frame filled cream in public/italy/road/polaroid.webp (300 x 343, photo
   window 31, 29.8, 235 x 238.1, left clear so the photo shows through).
   Stamps: cut from public/italy/art/mini_stop_stamps.jpeg, in
   public/italy/road/stamp_*.webp (220 x 220). */
import { legPt } from "../route.ts";
import { f1 } from "./kit.ts";

export type MiniStop = { id: string; name: string; photo?: string };

/* In order along the road. A stop with no photo shows a black placeholder
   in its polaroid. */
export const MINI_STOPS: MiniStop[] = [
  { id: "france", name: "France" },
  { id: "puerto_rico", name: "Puerto Rico" },
  { id: "indonesia", name: "Indonesia" },
  { id: "spain", name: "Spain" },
  { id: "canada", name: "Canada" },
];

/* Where each stop stands: its fraction along leg 5 (the stamp sits there)
   and how far its foot sits above the top edge of the road. Raised into the
   room the Thanksgiving text used to take (that text now sits above leg 6).
   The road above narrows to the right, so the lifts shrink that way; in
   absolute height they zigzag low, high, low, high, low; the lows sit low
   enough that each high stop's stamp clears the polaroid before it. Spain
   is near the most that clears the road above. */
const SPOTS: [number, number][] = [
  [0.04, 150],
  [0.23, 270],
  [0.42, 50],
  [0.61, 160],
  [0.8, 30],
];

const SR = 38; // stamp radius
const PW = 118; // polaroid width on the road
const K = PW / 300;
const PH = 343 * K;
const WIN = { x: 31 * K, y: 29.8 * K, w: 235 * K, h: 238.1 * K };

/* The x each stamp pops at, for the engine. */
export const miniStopX = (k: number): number => legPt(5, SPOTS[k][0]).x;

export function miniStopsArt(): { backdrop: string; scenery: string; fx: string } {
  const B: string[] = [], S: string[] = [], F: string[] = [];
  MINI_STOPS.forEach((m, k) => {
    const [f, lift] = SPOTS[k];
    const p = legPt(5, f);
    const base = p.y - 17 - lift;
    /* The stamp, then the polaroid to its right, both standing on the same
       line, tipped a little and alternating. The name sits above the
       polaroid. */
    const sx = p.x, sy = base - SR, srot = k % 2 ? -10 : 9;
    const x0 = sx + SR + 8, y0 = base - PH, prot = k % 2 ? 3 : -3;
    const cx = x0 + PW / 2, cy = y0 + PH / 2;
    const photo = m.photo
      ? `<image href="${m.photo}" x="${f1(x0 + WIN.x)}" y="${f1(y0 + WIN.y)}" width="${f1(WIN.w)}" height="${f1(WIN.h)}" preserveAspectRatio="xMidYMid slice"/>`
      : `<rect x="${f1(x0 + WIN.x)}" y="${f1(y0 + WIN.y)}" width="${f1(WIN.w)}" height="${f1(WIN.h)}" fill="#141414"/>`;
    /* The polaroid and its name fade in with the stamp (engine.ts, #pMini). */
    S.push(`<g id="pMini${k}" opacity="0"><g transform="rotate(${prot} ${f1(cx)} ${f1(cy)})">${photo}<image href="/italy/road/polaroid.webp" x="${f1(x0)}" y="${f1(y0)}" width="${PW}" height="${f1(PH)}"/></g>
      <text x="${f1(cx)}" y="${f1(y0 - 10)}" text-anchor="middle" style="font: 400 9.5px var(--f-caps); letter-spacing: .24em; fill: var(--ink)">${m.name.toUpperCase()}</text></g>`);
    F.push(`<g id="stMini${k}" opacity="0" data-x="${f1(sx)}" data-y="${f1(sy)}" data-r="${srot}"><image href="/italy/road/stamp_${m.id}.webp" x="${-SR}" y="${-SR}" width="${SR * 2}" height="${SR * 2}"/></g>`);
  });
  return { backdrop: B.join(''), scenery: S.join(''), fx: F.join('') };
}
