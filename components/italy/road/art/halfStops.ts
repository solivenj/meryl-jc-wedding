/* The half stops: Bali (palms, split gate) and Spain (white house, orange tree).
   Moved verbatim from the approved prototype; see components/italy/road/route.ts. */
import { Y0 } from "../route.ts";
import { f1, palm, stamp, up } from "./kit.ts";

export function halfStopsArt(): { backdrop: string; scenery: string; fx: string } {
  const B: string[] = [], S: string[] = [], F: string[] = [];
  { const g = up(5, .32, 20);
    S.push(`<g transform="translate(${f1(g.x)} ${f1(g.y)})">
      <path class="pf" d="M -40 0 L -40 -30 L -36 -30 L -36 -56 L -32 -56 L -32 -80 L -28 -80 L -26 -104 L -14 -112 L -12 -80 L -10 -80 L -10 -56 L -8 -56 L -8 -30 L -6 -30 L -6 0 Z"/>
      <path class="pf" d="M 40 0 L 40 -30 L 36 -30 L 36 -56 L 32 -56 L 32 -80 L 28 -80 L 26 -104 L 14 -112 L 12 -80 L 10 -80 L 10 -56 L 8 -56 L 8 -30 L 6 -30 L 6 0 Z"/>
      <path class="ln-thin" d="M -38 -40 L -8 -40 M -34 -66 L -10 -66 M -30 -90 L -12 -90 M 38 -40 L 8 -40 M 34 -66 L 10 -66 M 30 -90 L 12 -90"/>
      <path class="ln" d="M -48 0 L 48 0"/></g>`);
    [[.19, 100], [.235, 80], [.43, 92]].forEach(([f, h]) => { const p = up(5, f, 18); S.push(palm(p.x, p.y, h)); });
    F.push(stamp('stBali', 612, Y0 - 2008, 'BALI', '2024', 10));
    const sp = up(5, .8, 20);
    S.push(`<g transform="translate(${f1(sp.x)} ${f1(sp.y)})">
      <path class="pf" d="M -34 0 L -34 -34 L 16 -34 L 16 0 Z"/><path d="M -40 -32 L -9 -52 L 22 -32 Z" fill="rgb(201 111 74 / .55)" stroke="var(--ink)" stroke-width="1.6" stroke-linejoin="round"/>
      <path class="ln-thin" d="M -24 0 L -24 -16 q 6 -7 12 0 L -12 0 M 2 -24 l 8 0 l 0 8 l -8 0 Z"/>
      <path class="ln" d="M 36 0 L 36 -20"/><circle cx="36" cy="-34" r="16" class="lf"/>
      ${[[30, -38], [42, -36], [36, -28], [40, -44]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="rgb(236 140 50)" stroke="var(--ink)" stroke-width=".7"/>`).join('')}
    </g>`);
    F.push(stamp('stSpain', 946, Y0 - 2108, 'ESPAÑA', '2025', -8));
  }
  return { backdrop: B.join(''), scenery: S.join(''), fx: F.join('') };
}
