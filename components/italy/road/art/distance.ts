/* The long-distance years: time zones, I-80, the two pins, the flights tally, and the arc the little plane flies.
   Moved verbatim from the approved prototype; see components/italy/road/route.ts. */
import { legPt } from "../route.ts";
import { greenSign, up, f1 } from "./kit.ts";

export const longArcD = (): string => {
  const a = legPt(2, .06), b = legPt(2, .94);
  return `M ${f1(a.x)} ${f1(a.y - 40)} C ${f1(a.x - 220)} ${f1(a.y - 200)} ${f1(b.x + 220)} ${f1(b.y - 170)} ${f1(b.x)} ${f1(b.y - 40)}`;
};

export function distanceArt(): { backdrop: string; scenery: string; fx: string } {
  const B: string[] = [], S: string[] = [], F: string[] = [];
  { const signs: [number, string[]][] = [[.2, ['LEAVING', 'EASTERN', 'TIME ZONE']], [.4, ['ENTERING', 'CENTRAL', 'TIME ZONE']], [.62, ['ENTERING', 'MOUNTAIN', 'TIME ZONE']], [.84, ['ENTERING', 'PACIFIC', 'TIME ZONE']]];
    signs.forEach(([f, lines]) => { const p = up(2, f); S.push(greenSign(p.x, p.y, lines, 'var(--hwy)', 104)); });
    const s = up(2, .51);
    S.push(`<g transform="translate(${s.x} ${s.y})"><line class="post" x1="0" y1="0" x2="0" y2="-30"/>
      <path d="M -22 -76 C -14 -80 -6 -78 0 -74 C 6 -78 14 -80 22 -76 L 22 -54 C 22 -40 10 -32 0 -28 C -10 -32 -22 -40 -22 -54 Z" fill="var(--eu)" stroke="var(--ink)" stroke-width="1.6"/>
      <path d="M -22 -76 C -14 -80 -6 -78 0 -74 C 6 -78 14 -80 22 -76 L 22 -66 L -22 -66 Z" fill="var(--red)" stroke="var(--ink)" stroke-width="1.2"/>
      <text x="0" y="-41" text-anchor="middle" style="font: 800 15px var(--f-hwy); fill:#fff">80</text></g>`);
    const pin = (x: number, y: number, label: string) => `<g transform="translate(${x} ${y})"><path d="M 0 0 C -4 -10 -12 -16 -12 -26 A 12 12 0 1 1 12 -26 C 12 -16 4 -10 0 0 Z" fill="var(--red)" stroke="var(--ink)" stroke-width="1.6"/><circle cx="0" cy="-26" r="4.5" class="paper"/>
      <text x="0" y="-46" text-anchor="middle" style="font: 400 9.5px var(--f-caps); letter-spacing: .22em; fill: var(--ink)">${label}</text></g>`;
    const e = up(2, .045, 22), w = up(2, .965, 22);
    S.push(pin(e.x, e.y, 'JOHN · EAST COAST'));
    S.push(pin(w.x + 10, w.y, 'MERYL · WEST COAST'));
    const n = up(2, .7, 230);
    S.push(`<g transform="translate(${n.x} ${n.y}) rotate(-4)">
      <rect x="-58" y="-52" width="116" height="104" fill="#f7e9a8" stroke="var(--ink)" stroke-width="1.4"/>
      <text x="0" y="-28" text-anchor="middle" style="font: italic 400 19px var(--f-body); fill: var(--ink)">flights</text>
      <g id="tally" class="ln" stroke-width="2.4">
        <path d="M -24 -14 L -26 32"/><path d="M -10 -14 L -12 32"/><path d="M 4 -14 L 2 32"/><path d="M 18 -14 L 16 32"/><path d="M -36 20 L 30 -4"/>
      </g></g>`);
    S.push(`<path id="longArc" d="${longArcD()}" fill="none" stroke="var(--ink)" stroke-width="1.6" stroke-dasharray="2 8" stroke-linecap="round" opacity=".4"/>`);
  }
  return { backdrop: B.join(''), scenery: S.join(''), fx: F.join('') };
}
