/* Across the water: the Atlantic and the EU border sign.
   Moved verbatim from the approved prototype; see components/italy/road/route.ts. */
import { legPt, legY, fA7, fB7 } from "../route.ts";
import { f1, stamp, up } from "./kit.ts";

export function crossingArt(): { backdrop: string; scenery: string; fx: string } {
  const B: string[] = [], S: string[] = [], F: string[] = [];
  { const sea: string[] = [];
    for (let x = fA7.x + 14; x < fB7.x - 10; x += 34) {
      const y = legY(7, x) + 4;
      sea.push(`M ${f1(x)} ${f1(y)} q 8.5 -7 17 0 t 17 0`);
      if (x < fB7.x - 60) sea.push(`M ${f1(x + 12)} ${f1(y + 22)} q 8.5 -6 17 0 t 17 0`);
    }
    S.push(`<path class="ln-thin" d="${sea.join(' ')}" opacity=".7"/>`);
    S.push(`<path class="ln" d="M ${f1(fA7.x - 4)} ${f1(fA7.y - 16)} l 10 10 l -4 14 l 12 8 M ${f1(fB7.x + 6)} ${f1(fB7.y - 16)} l -10 12 l 6 10 l -12 10"/>`);
    const mid = legPt(7, .36);
    S.push(`<text x="${mid.x}" y="${mid.y + 50}" text-anchor="middle" style="font: 400 11px var(--f-caps); letter-spacing: .5em; fill: var(--ink-soft)">ATLANTIC</text>`);
    const e = up(7, .9);
    S.push(`<g transform="translate(${e.x} ${e.y})"><line class="post" x1="0" y1="0" x2="0" y2="-28"/>
      <rect x="-48" y="-92" width="96" height="64" fill="var(--eu)" stroke="var(--ink)" stroke-width="1.8"/>
      ${Array.from({ length: 12 }, (_, k) => { const a = k * Math.PI / 6; return `<circle cx="${f1(Math.cos(a) * 19)}" cy="${f1(-66 + Math.sin(a) * 19)}" r="2.2" fill="var(--gold)"/>`; }).join('')}
      <text x="0" y="-36" text-anchor="middle" style="font: 700 11px var(--f-it); letter-spacing: .14em; fill:#fff">ITALIA</text></g>`);
    F.push(stamp('stIt27', 904, 1500, 'ITALIA', '2027', 8));
  }
  return { backdrop: B.join(''), scenery: S.join(''), fx: F.join('') };
}
