/* Thanksgiving 2025 in California: CA 1, palms, the house, the long table.
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
    const hsx = up(6, .76, 20);
    S.push(`<g transform="translate(${f1(hsx.x)} ${f1(hsx.y)})">
      <path class="pf" d="M -66 0 L -66 -70 L 66 -70 L 66 0 Z"/><path d="M -76 -66 L 0 -110 L 76 -66 Z" fill="rgb(201 111 74 / .45)" stroke="var(--ink)" stroke-width="1.8" stroke-linejoin="round"/>
      <path class="ln-thin" d="M -12 0 L -12 -36 L 12 -36 L 12 0 M -50 -52 l 22 0 l 0 18 l -22 0 Z M 28 -52 l 22 0 l 0 18 l -22 0 Z M -39 -52 l 0 18 M 39 -52 l 0 18"/>
      <path class="ln-thin" d="M 26 -96 Q 60 -76 96 -92 M 34 -92 l 0 8 l 6 -6 Z M 52 -86 l 0 8 l 6 -6 Z M 70 -84 l 0 8 l 6 -6 Z M 88 -90 l 0 8 l 6 -6 Z"/>
    </g>`);
    const tb = up(6, .55, 20);
    let heads = '';
    [-66, -52, -38, -24, -10, 10, 24, 38, 52, 66].forEach((x, k) => { heads += `<g class="fam"><circle cx="${x}" cy="-44" r="6.5" fill="${k < 5 ? 'var(--ink)' : 'var(--ink-soft)'}"/><path d="M ${x - 7} -30 C ${x - 7} -38 ${x + 7} -38 ${x + 7} -30" fill="${k < 5 ? 'var(--ink)' : 'var(--ink-soft)'}"/></g>`; });
    S.push(`<g transform="translate(${f1(tb.x)} ${f1(tb.y - 4)})">
      <g id="family">${heads}</g>
      <rect x="-82" y="-30" width="164" height="8" class="pf" style="stroke-width:1.5"/>
      <path class="ln-thin" d="M -82 -22 L -84 -6 M 82 -22 L 84 -6 M -70 -22 L -70 0 M 70 -22 L 70 0"/>
      <path d="M -16 -30 C -16 -42 16 -42 16 -30 Z" fill="rgb(201 140 74 / .5)" stroke="var(--ink)" stroke-width="1.2"/>
      <path d="M 40 -30 L 52 -30 L 46 -38 Z" fill="rgb(236 170 120 / .6)" stroke="var(--ink)" stroke-width="1"/>
      <path class="ln-thin" d="M -50 -30 l 0 -6 M -46 -30 l 0 -8 M 30 -30 l 0 -6"/>
    </g>`);
  }
  return { backdrop: B.join(''), scenery: S.join(''), fx: F.join('') };
}
