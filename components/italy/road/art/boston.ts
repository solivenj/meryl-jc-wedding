/* Boston, 2019: the sign, the polaroid pickets, the skyline over the Charles.
   Moved verbatim from the approved prototype; see components/italy/road/route.ts. */
import { Y0, legY } from "../route.ts";
import { drawnSign, f1, up } from "./kit.ts";

export function bostonArt(): { backdrop: string; scenery: string; fx: string } {
  const B: string[] = [], S: string[] = [], F: string[] = [];
  { /* The sign and the NEU husky picket both stand just past the fork (FORK,
       about x 266), shifted along leg 1 together by DX from the prototype.
       The prototype's other five polaroid pickets and their rail are gone;
       only the husky stays. */
    const DX = 150;
    const s = up(1, .045);
    S.push(drawnSign(s.x + 8 + DX, legY(1, s.x + 8 + DX) - 20, '/italy/road/boston_sign.webp', 152));
    const shots: { neu?: boolean; c?: string }[] = [{ neu: true }];
    const xs = [298].map((x) => x + DX);
    const ry = (x: number) => legY(1, x) - 22;
    let g = "";
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
    /* Boston skyline over the Charles: the hand-drawn harbour view
       (public/italy/art/boston.jpeg, knocked out to ink on clear in
       public/italy/road/boston_skyline.webp). 1000 x 529 source, set 440
       wide, clear of the road above and the next stop's pin. */
    {
      const w = 440, h = (w * 529) / 1000, x = 556, yb = Y0 - 238;
      /* No river label under it. */
      S.push(`<g><image href="/italy/road/boston_skyline.webp" x="${x}" y="${f1(yb - h)}" width="${w}" height="${f1(h)}"/></g>`);
    }
  }
  return { backdrop: B.join(''), scenery: S.join(''), fx: F.join('') };
}
