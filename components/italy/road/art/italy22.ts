/* Italy, 2022: the Atlantic crossing, the passport stamp, and John's drawings
   of Florence, Tuscany and the Amalfi coast. The road and waves come from the
   approved prototype; see components/italy/road/route.ts. */
import { legPt, legY, fA3, fB3 } from "../route.ts";
import { f1, waves } from "./kit.ts";

export function italy22Art(): { backdrop: string; scenery: string; fx: string } {
  const B: string[] = [], S: string[] = [], F: string[] = [];
  { const yL3 = (x: number) => legY(3, x);
    S.push(waves(fA3.x + 12, fB3.x - 6, (x) => yL3(x) + 4));
    S.push(`<path class="ln" d="M ${f1(fA3.x - 4)} ${f1(fA3.y - 16)} l 10 10 l -4 14 l 12 8 M ${f1(fB3.x + 6)} ${f1(fB3.y - 16)} l -10 12 l 6 10 l -12 10"/>`);
    const m = legPt(3, .23);
    // S.push(`<text x="${m.x}" y="${m.y + 56}" text-anchor="middle" style="font: 400 10px var(--f-caps); letter-spacing: .5em; fill: var(--ink-soft)">ATLANTIC</text>`);
    {
      const r = 42;
      /* Below the road, just past where the plane lands. */
      const sx = 560, sy = yL3(sx) + 17 + r + 10;
      F.push(`<g id="stIt22" opacity="0" data-x="${sx}" data-y="${f1(sy)}" data-r="-10"><image href="/italy/road/italy2022_stamp.webp" x="${-r}" y="${-r}" width="${r * 2}" height="${r * 2}"/></g>`);
    }
    /* Florence, first of three along the road after the landing (Tuscany
       and Amalfi to follow). John's drawing (public/italy/art/
       florence_cropped.jpeg, knocked out to ink in public/italy/road/
       florence.webp, 600 x 528) with its river cut away along a line at the
       road's own slope, so the road reads as cutting the picture off. In the
       file that cut runs from y 539.2 at x 0 down 0.25 per x, the same as
       leg 3, so placing it once keeps it parallel all the way along, GAP
       above the road's top edge. */
    /* Tuscany follows (public/italy/art/tuscany_cropped.jpeg, its border
       and the bridge and river cut away the same way, in public/italy/road/
       tuscany.webp, 600 x 788). Its cut runs from y 788 at x 0, down 0.25
       per x. */
    const GAP = 4;
    ([['florence', 390, 528, 539.2], ['tuscany', 630, 788, 788]] as [string, number, number, number][]).forEach(([name, x, h0, cut0]) => {
      const w = 230, k = w / 600, h = h0 * k;
      const y = yL3(x) - 17 - GAP - cut0 * k;
      S.push(`<image href="/italy/road/${name}.webp" x="${x}" y="${f1(y)}" width="${w}" height="${f1(h)}"/>`);
    });
  }
  return { backdrop: B.join(''), scenery: S.join(''), fx: F.join('') };
}
