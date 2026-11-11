/* Boston, 2019: the sign, the polaroid pickets, the skyline over the Charles.
   Moved verbatim from the approved prototype; see components/italy/road/route.ts. */
import { Y0, legY } from "../route.ts";
import { f1, greenSign, olive, up } from "./kit.ts";

export function bostonArt(): { backdrop: string; scenery: string; fx: string } {
  const B: string[] = [], S: string[] = [], F: string[] = [];
  { const s = up(1, .045);
    S.push(greenSign(s.x + 20, s.y, ['BOSTON, MA'], 'var(--olive)'));
    const shots = [{ neu: true }, { c: '2019' }, { c: '' }, { c: '' }, { c: '' }, { c: '' }];
    const xs = [298, 336, 372, 408, 444, 482];
    const ry = (x: number) => legY(1, x) - 22;
    let g = `<path class="ln" d="M 282 ${f1(ry(282) - 26)} L 506 ${f1(ry(506) - 26)} M 282 ${f1(ry(282) - 52)} L 506 ${f1(ry(506) - 52)}"/>`;
    xs.forEach((x, k) => {
      const yb = ry(x), big = shots[k].neu, w = big ? 54 : 44, h = big ? 64 : 54, rot = [-5, 4, -3, 5, -4, 3][k];
      g += `<g transform="translate(${x} ${f1(yb)}) rotate(${rot})">
        <line class="post" x1="0" y1="0" x2="0" y2="-14"/>
        <rect x="${-w / 2}" y="${-14 - h}" width="${w}" height="${h}" class="pf" style="stroke-width:1.4"/>
        <rect x="${-w / 2 + 4}" y="${-10 - h}" width="${w - 8}" height="${h - 18}" fill="${big ? 'rgb(75 75 48 / .10)' : 'rgb(75 75 48 / .18)'}"/>
        ${big ? `
          <g transform="translate(0 ${f1(-14 - h + 26)}) scale(.9)">
            <path d="M -14 -6 L -11 -20 L -4 -11 Z M 14 -6 L 11 -20 L 4 -11 Z" fill="var(--ink-soft)" stroke="var(--ink)" stroke-width="1.2" stroke-linejoin="round"/>
            <path d="M -15 -4 C -15 -14 -8 -13 0 -13 C 8 -13 15 -14 15 -4 C 15 8 8 14 0 14 C -8 14 -15 8 -15 -4 Z" fill="var(--ink-soft)" stroke="var(--ink)" stroke-width="1.3"/>
            <path d="M 0 -9 C -3 -4 -11 -4 -11 3 C -11 10 -5 13 0 13 C 5 13 11 10 11 3 C 11 -4 3 -4 0 -9 Z" fill="var(--paper)"/>
            <circle cx="-5" cy="-2" r="1.8" fill="var(--ink)"/><circle cx="5" cy="-2" r="1.8" fill="var(--ink)"/>
            <path d="M -2.5 4 L 2.5 4 L 0 7 Z" fill="var(--ink)"/><path class="ln-thin" d="M 0 7 L 0 9 M -3 10 q 3 2 6 0"/>
          </g>
          <text x="0" y="-18" text-anchor="middle" style="font: 800 10px var(--f-hwy); letter-spacing: .12em; fill: var(--red)">NEU</text>`
        : `<path class="ln-thin" d="M ${-w / 2 + 4} ${-30} L ${-6} ${-48} L 2 ${-40} L 10 ${-52} L ${w / 2 - 4} ${-34}" opacity=".55"/>
           <text x="0" y="-18" text-anchor="middle" class="cap" style="font-size:10px">${shots[k].c}</text>`}
        <circle cx="0" cy="${-14 - h + 2}" r="2.4" fill="var(--red)"/>
      </g>`;
    });
    S.push(g);
    // Boston skyline over the Charles
    S.push(`<g transform="translate(556 ${Y0 - 270})">
      <path class="pf" d="M 196 0 L 196 -150 L 228 -150 L 228 0 Z"/><path class="ln-thin" d="M 202 -140 L 202 -8 M 212 -140 L 212 -8 M 222 -140 L 222 -8"/>
      <path class="pf" d="M 236 0 L 236 -172 C 236 -182 262 -182 262 -172 L 262 0 Z"/><path class="ln-thin" d="M 242 -160 l 0 6 M 249 -160 l 0 6 M 256 -160 l 0 6 M 242 -140 l 0 6 M 249 -140 l 0 6 M 256 -140 l 0 6 M 242 -120 l 0 6 M 249 -120 l 0 6 M 256 -120 l 0 6 M 242 -100 l 0 6 M 249 -100 l 0 6 M 256 -100 l 0 6 M 242 -80 l 0 6 M 249 -80 l 0 6 M 256 -80 l 0 6"/>
      <path class="pf" d="M 304 0 L 304 -150 L 316 -168 L 340 -168 L 340 0 Z"/><path class="ln-thin" d="M 310 -150 L 334 -150 M 310 -130 L 334 -130 M 310 -110 L 334 -110 M 310 -90 L 334 -90 M 310 -70 L 334 -70"/>
      <path class="pf" d="M 346 0 L 346 -176 L 378 -176 L 378 0 Z"/><path class="ln-thin" d="M 352 -168 L 352 -8 M 362 -168 L 362 -8 M 372 -168 L 372 -8"/>
      <path class="pf" d="M 384 0 L 384 -118 L 420 -118 L 420 0 Z"/><path class="ln-thin" d="M 384 -100 L 420 -100 M 384 -82 L 420 -82 M 384 -64 L 420 -64 M 384 -46 L 420 -46 M 396 -118 L 396 0 M 408 -118 L 408 0"/>
      <path class="pf" d="M 150 0 L 150 -102 L 158 -112 L 166 -112 L 166 -122 L 172 -138 L 178 -122 L 178 -112 L 186 -112 L 194 -102 L 194 0 Z"/><path class="ln-thin" d="M 158 -92 L 186 -92 M 158 -76 L 186 -76 M 158 -60 L 186 -60 M 158 -44 L 186 -44"/>
      <path class="pf" d="M 270 0 L 270 -112 L 296 -112 L 296 0 Z"/><path class="pf" d="M 270 -112 L 283 -144 L 296 -112 Z"/><circle cx="283" cy="-100" r="6" class="pf" style="stroke-width:1.3"/><path class="ln-thin" d="M 283 -100 l 0 -4 M 283 -100 l 3 0 M 276 -82 L 290 -82 M 276 -64 L 290 -64"/>
      <path class="pf" d="M 4 0 L 4 -26 L 64 -26 L 64 0 Z"/><path class="ln-thin" d="M 12 -22 L 12 -4 M 22 -22 L 22 -4 M 32 -22 L 32 -4 M 42 -22 L 42 -4 M 52 -22 L 52 -4"/>
      <path d="M 18 -26 C 18 -46 50 -46 50 -26 Z" fill="rgb(242 194 48 / .45)" stroke="var(--ink)" stroke-width="1.8"/><path class="ln" d="M 34 -42 L 34 -54"/><circle cx="34" cy="-56" r="2" class="pf" style="stroke-width:1.2"/>
      <path class="ln" d="M 64 -12 L 150 -12"/>
      <path class="ln" d="M 84 0 L 92 -72 L 100 0 M 92 -72 L 92 -82 M 122 0 L 130 -72 L 138 0 M 130 -72 L 130 -82"/>
      <path class="ln-thin" d="M 92 -68 L 68 -12 M 92 -62 L 74 -12 M 92 -56 L 80 -12 M 92 -68 L 112 -12 M 92 -62 L 106 -12 M 130 -68 L 112 -12 M 130 -62 L 118 -12 M 130 -68 L 150 -12 M 130 -62 L 144 -12"/>
      <path class="pf" d="M 420 0 L 420 -30 L 440 -30 L 440 -50 L 446 -64 L 452 -50 L 452 -30 L 470 -30 L 470 0 Z"/><path class="ln-thin" d="M 428 -20 l 0 10 M 460 -20 l 0 10 M 446 -44 l 0 8"/>
      <path class="ln" d="M -10 0 L 480 0"/>
      <path class="ln-thin" d="M 0 8 q 9 -5 18 0 t 18 0 M 70 14 q 9 -5 18 0 t 18 0 M 160 8 q 9 -5 18 0 t 18 0 M 250 14 q 9 -5 18 0 t 18 0 M 340 8 q 9 -5 18 0 t 18 0" opacity=".6"/>
      <text x="236" y="30" text-anchor="middle" style="font: 400 9px var(--f-caps); letter-spacing: .4em; fill: var(--ink-soft)">CHARLES RIVER</text>
    </g>`);
  }
  return { backdrop: B.join(''), scenery: S.join(''), fx: F.join('') };
}
