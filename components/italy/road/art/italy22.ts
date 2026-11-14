/* Italy, 2022: the Atlantic crossing, the passport stamp, and the couple's
   drawing of the road from Florence through Tuscany to the Amalfi coast,
   which the Vespa rides (2026-11-13; it replaces the separate Florence and
   Tuscany drawings). Where it sits, and the road through it, are in
   components/italy/road/route.ts (ITALY_DRAWING, ITALY_TRACE). */
import { legY, fA3, fB3, ITALY_DRAWING } from "../route.ts";
import { f1, waves } from "./kit.ts";

/* How far the drawing's bottom edge fades (above ITALY_DRAWING.cutY), and
   its left edge, so it sits in the page with no hard frame. */
const FADE_B = 50;
const FADE_L = 36;

export function italy22Art(): { backdrop: string; scenery: string; fx: string } {
  const B: string[] = [], S: string[] = [], F: string[] = [];
  { const yL3 = (x: number) => legY(3, x);
    S.push(waves(fA3.x + 12, fB3.x - 6, (x) => yL3(x) + 4));
    S.push(`<path class="ln" d="M ${f1(fA3.x - 4)} ${f1(fA3.y - 16)} l 10 10 l -4 14 l 12 8 M ${f1(fB3.x + 6)} ${f1(fB3.y - 16)} l -10 12 l 6 10 l -12 10"/>`);
    {
      const r = 42;
      /* Below the road, just past where the plane lands. */
      const sx = 560, sy = yL3(sx) + 17 + r + 10;
      F.push(`<g id="stIt22" opacity="0" data-x="${sx}" data-y="${f1(sy)}" data-r="-10"><image href="/italy/road/italy2022_stamp.webp" x="${-r}" y="${-r}" width="${r * 2}" height="${r * 2}"/></g>`);
    }
    /* The drawing (public/italy/art/final_italy_road.jpeg, knocked out to ink
       on clear in public/italy/road/italy_road.webp). Everything below the
       bend where leg 3 joins it, the wide foreground road and bushes, is
       faded out, so the page's road runs on into the drawn one. */
    const { x, y, w, h, cutY } = ITALY_DRAWING;
    S.push(`<g id="italyRoad">
      <defs>
        <linearGradient id="itFadeB" gradientUnits="userSpaceOnUse" x1="0" y1="${f1(cutY - FADE_B)}" x2="0" y2="${cutY}"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>
        <linearGradient id="itFadeL" gradientUnits="userSpaceOnUse" x1="${x}" y1="0" x2="${f1(x + FADE_L)}" y2="0"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient>
        <mask id="itMaskB" maskUnits="userSpaceOnUse" x="${x - 10}" y="${y - 10}" width="${w + 20}" height="${f1(h + 20)}"><rect x="${x - 10}" y="${y - 10}" width="${w + 20}" height="${f1(cutY - y + 10)}" fill="url(#itFadeB)"/></mask>
        <mask id="itMaskL" maskUnits="userSpaceOnUse" x="${x - 10}" y="${y - 10}" width="${w + 20}" height="${f1(h + 20)}"><rect x="${x}" y="${y - 10}" width="${w + 10}" height="${f1(h + 20)}" fill="url(#itFadeL)"/></mask>
      </defs>
      <g mask="url(#itMaskL)"><image href="/italy/road/italy_road.webp" x="${x}" y="${y}" width="${w}" height="${h}" mask="url(#itMaskB)"/></g>
    </g>`);
  }
  return { backdrop: B.join(''), scenery: S.join(''), fx: F.join('') };
}
