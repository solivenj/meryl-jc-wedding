/* Thanksgiving 2025 in California: CA 1, palms, the house, the long table with
   both families, and string lights from the house over the table.
   Moved verbatim from the approved prototype; see components/italy/road/route.ts. */
import { f1, palm, up } from "./kit.ts";

export function thanksgivingArt(): { backdrop: string; scenery: string; fx: string } {
  const B: string[] = [], S: string[] = [], F: string[] = [];
  { const sh = up(6, .12, 20);
    S.push(`<g transform="translate(${f1(sh.x)} ${f1(sh.y)})"><line class="post" x1="0" y1="0" x2="0" y2="-24"/>
      <path d="M 0 -64 C 8 -62 18 -60 18 -50 C 18 -40 10 -32 0 -26 C -10 -32 -18 -40 -18 -50 C -18 -60 -8 -62 0 -64 Z" fill="var(--hwy)" stroke="var(--ink)" stroke-width="1.5"/>
      <text x="0" y="-48" text-anchor="middle" style="font: 800 6.5px var(--f-hwy); letter-spacing: .08em; fill:#fff">CA</text>
      <text x="0" y="-34" text-anchor="middle" style="font: 800 12px var(--f-hwy); fill:#fff">1</text></g>`);
    [[.27, 112], [.315, 92]].forEach(([f, h]) => { const p = up(6, f, 18); S.push(palm(p.x, p.y, h)); });
    // the house
    const hsx = up(6, .76, 20);
    S.push(`<g transform="translate(${f1(hsx.x)} ${f1(hsx.y)})">
      <path class="pf" d="M -66 0 L -66 -70 L 66 -70 L 66 0 Z"/><path d="M -76 -66 L 0 -110 L 76 -66 Z" fill="rgb(201 111 74 / .45)" stroke="var(--ink)" stroke-width="1.8" stroke-linejoin="round"/>
      <path class="ln-thin" d="M -12 0 L -12 -36 L 12 -36 L 12 0 M -50 -52 l 22 0 l 0 18 l -22 0 Z M 28 -52 l 22 0 l 0 18 l -22 0 Z M -39 -52 l 0 18 M 39 -52 l 0 18"/>
      <circle cx="7" cy="-18" r="1.4" fill="var(--ink)"/>
    </g>`);
    // the long table, both families around it
    const tb = up(6, .55, 20);
    let heads = '';
    [-63, -45, -27, -9, 9, 27, 45, 63].forEach((x, k) => {
      const tone = k < 4 ? 'var(--ink)' : 'var(--ink-soft)', hy = [-47, -45, -48, -44, -46, -48, -45, -47][k];
      heads += `<g class="fam"><path d="M ${x - 8} -30 C ${x - 8} ${hy + 9} ${x + 8} ${hy + 9} ${x + 8} -30 Z" fill="${tone}"/><circle cx="${x}" cy="${hy}" r="5.6" fill="${tone}"/></g>`;
    });
    S.push(`<g transform="translate(${f1(tb.x)} ${f1(tb.y - 4)})">
      <g id="family">${heads}</g>
      <path class="pf" d="M -86 -30 L 86 -30 L 86 -23 q -7 6 -14.3 0 q -7 6 -14.3 0 q -7 6 -14.3 0 q -7 6 -14.3 0 q -7 6 -14.3 0 q -7 6 -14.3 0 q -7 6 -14.3 0 q -7 6 -14.3 0 q -7 6 -14.3 0 q -7 6 -14.3 0 q -7 6 -14.3 0 q -7 6 -14.3 0 L -86 -30 Z" style="stroke-width:1.5"/>
      <path class="ln-thin" d="M -74 -20 L -76 0 M 74 -20 L 76 0"/>
      <path d="M -14 -30 C -16 -44 14 -44 14 -30 Z" fill="rgb(201 140 74 / .55)" stroke="var(--ink)" stroke-width="1.3"/>
      <path class="ln-thin" d="M -12 -36 l -6 -5 l -3 2 M 12 -36 l 6 -5 l 3 2"/>
      <path d="M -52 -30 L -38 -30 L -45 -37 Z" fill="rgb(236 170 120 / .65)" stroke="var(--ink)" stroke-width="1"/>
      <path class="ln-thin" d="M 36 -30 l 0 -9 M 50 -30 l 0 -9"/>
      <path d="M 36 -39 q -1.6 -3 0 -5 q 1.6 2 0 5 Z M 50 -39 q -1.6 -3 0 -5 q 1.6 2 0 5 Z" fill="var(--gold)" stroke="var(--ink)" stroke-width=".6"/>
    </g>`);
    // string lights from the house's eave, over the table, to a pole past its far end
    const a = { x: hsx.x + 76, y: hsx.y - 66 };
    const pole = up(6, .435, 20);
    const b = { x: pole.x, y: pole.y - 112 };
    const c = { x: (a.x + b.x) / 2, y: Math.max(a.y, b.y) + 22 };
    let bulbs = '';
    for (let k = 1; k < 12; k++) {
      const t = k / 12, u = 1 - t;
      const bx = u * u * a.x + 2 * u * t * c.x + t * t * b.x, by = u * u * a.y + 2 * u * t * c.y + t * t * b.y;
      bulbs += `<path class="ln-thin" d="M ${f1(bx)} ${f1(by)} l 0 4"/><circle cx="${f1(bx)}" cy="${f1(by + 6.5)}" r="3" fill="rgb(242 194 48 / .85)" stroke="var(--ink)" stroke-width=".8"/>`;
    }
    S.push(`<g id="lights"><line class="post" x1="${f1(pole.x)}" y1="${f1(pole.y)}" x2="${f1(b.x)}" y2="${f1(b.y)}"/>
      <path class="ln-thin" d="M ${f1(a.x)} ${f1(a.y)} Q ${f1(c.x)} ${f1(c.y)} ${f1(b.x)} ${f1(b.y)}"/>${bulbs}</g>`);
  }
  return { backdrop: B.join(''), scenery: S.join(''), fx: F.join('') };
}
