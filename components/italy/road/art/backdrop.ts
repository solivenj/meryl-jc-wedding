/* The hill under Todi and the sun.
   Moved verbatim from the approved prototype; see components/italy/road/route.ts. */
import { f1 } from "./kit.ts";

export function backdropArt(): { backdrop: string; scenery: string; fx: string } {
  const B: string[] = [], S: string[] = [], F: string[] = [];
  B.push(`
    <path d="M -20 1060 C 120 900 260 700 420 610 C 520 560 700 548 860 590 C 1000 628 1120 760 1230 860 L 1230 1150 C 820 1230 640 1160 480 1210 C 320 1260 160 1220 -20 1300 Z" fill="var(--hill)"/>
    <path d="M -20 1300 C 160 1220 320 1260 480 1210 C 640 1160 820 1230 1230 1150" class="ln-thin" opacity=".35"/>
    <g transform="translate(1080 190)"><circle r="34" fill="rgb(242 194 48 / .22)" stroke="var(--ink)" stroke-width="1.6"/>
      ${Array.from({ length: 12 }, (_, k) => { const a = k * Math.PI / 6; return `<line class="ln-thin" x1="${f1(Math.cos(a) * 44)}" y1="${f1(Math.sin(a) * 44)}" x2="${f1(Math.cos(a) * 56)}" y2="${f1(Math.sin(a) * 56)}"/>`; }).join('')}</g>
  `);
  return { backdrop: B.join(''), scenery: S.join(''), fx: F.join('') };
}
