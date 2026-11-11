/* Italy, 2022: the Atlantic, Tuscany (vines, cypresses, the villa) and Positano.
   Moved verbatim from the approved prototype; see components/italy/road/route.ts. */
import { Y0, legPt, legY, fA3, fB3 } from "../route.ts";
import { f1, cypress, waves, stamp, up, TERRA } from "./kit.ts";

export function italy22Art(): { backdrop: string; scenery: string; fx: string } {
  const B: string[] = [], S: string[] = [], F: string[] = [];
  { const yL3 = (x: number) => legY(3, x);
    S.push(waves(fA3.x + 12, fB3.x - 6, (x) => yL3(x) + 4));
    S.push(`<path class="ln" d="M ${f1(fA3.x - 4)} ${f1(fA3.y - 16)} l 10 10 l -4 14 l 12 8 M ${f1(fB3.x + 6)} ${f1(fB3.y - 16)} l -10 12 l 6 10 l -12 10"/>`);
    const m = legPt(3, .23);
    S.push(`<text x="${m.x}" y="${m.y + 56}" text-anchor="middle" style="font: 400 10px var(--f-caps); letter-spacing: .5em; fill: var(--ink-soft)">ATLANTIC</text>`);
    F.push(stamp('stIt22', 604, Y0 - 896, 'ITALIA', '2022', -10));
    // vineyard rows below the road
    let vines = '';
    for (let r = 0; r < 4; r++) for (let x = 480; x < 656; x += 14) { const y = yL3(x) + 34 + r * 15 - (x - 480) * .02; vines += `<circle cx="${x + r * 4}" cy="${f1(y)}" r="2.6" class="leaf" stroke="var(--ink)" stroke-width=".8"/>`; }
    for (let r = 0; r < 4; r++) vines += `<path class="ln-thin" d="M 478 ${f1(yL3(478) + 37 + r * 15)} L 660 ${f1(yL3(660) + 37 + r * 15 - 3.6)}" opacity=".5"/>`;
    S.push(vines);
    [[.41, 66], [.44, 80], [.47, 68]].forEach(([f, h]) => { const p = up(3, f, 18); S.push(cypress(p.x, p.y, h)); });
    // Tuscan villa: low hipped roofs, a square tower, an arched loggia
    const v = up(3, .6, 20);
    S.push(`<g transform="translate(${f1(v.x)} ${f1(v.y)})">
      <path class="lf" d="M -100 0 C -72 -22 -38 -28 0 -28 C 38 -28 72 -22 100 0 Z" style="fill: rgb(75 75 48 / .12)"/>
      <path class="ln-thin" d="M -96 -2 C -60 -14 -30 -18 0 -18 M 20 -16 C 50 -14 74 -8 96 -2" opacity=".45"/>
      <path class="pf" d="M -66 -26 L -66 -80 L 26 -80 L 26 -26 Z"/>
      <path d="M -74 -78 L -56 -94 L 16 -94 L 34 -78 Z" fill="${TERRA}" stroke="var(--ink)" stroke-width="1.8" stroke-linejoin="round"/>
      <path class="pf" d="M 26 -26 L 26 -66 L 66 -66 L 66 -26 Z"/>
      <path d="M 20 -64 L 34 -76 L 58 -76 L 72 -64 Z" fill="${TERRA}" stroke="var(--ink)" stroke-width="1.6" stroke-linejoin="round"/>
      <path class="pf" d="M -20 -94 L -20 -128 L 8 -128 L 8 -94 Z"/>
      <path d="M -27 -126 L -6 -140 L 15 -126 Z" fill="${TERRA}" stroke="var(--ink)" stroke-width="1.6" stroke-linejoin="round"/>
      <path class="ln-thin" d="M -12 -104 l 0 -12 q 4 -5 8 0 l 0 12"/>
      <path class="ln-thin" d="M -58 -26 L -58 -40 q 7 -10 14 0 L -44 -26 M -38 -26 L -38 -40 q 7 -10 14 0 L -24 -26 M -18 -26 L -18 -40 q 7 -10 14 0 L -4 -26"/>
      <path class="ln-thin" d="M -56 -70 l 8 0 l 0 10 l -8 0 Z M -36 -70 l 8 0 l 0 10 l -8 0 Z M -16 -70 l 8 0 l 0 10 l -8 0 Z M 4 -70 l 8 0 l 0 10 l -8 0 Z M 36 -54 l 8 0 l 0 10 l -8 0 Z M 50 -54 l 8 0 l 0 10 l -8 0 Z"/>
      <path class="ln-thin" d="M 4 -26 L 4 -44 L 16 -44 L 16 -26"/>
    </g>`);
    [[-86, 66], [-78, 50], [84, 60]].forEach(([dx, h]) => S.push(cypress(f1(v.x + dx), f1(v.y - 6), h)));
    // Positano: houses cascading down the cliff to the sea, the tiled dome low on the left
    const px0 = 836, px1 = 1028;
    const base = (x: number) => yL3(x) - 22;
    let pos = `<path d="M ${px0 - 6} ${f1(base(px0 - 6))} L ${px0 + 30} ${f1(base(px0) - 70)} L ${px0 + 70} ${f1(base(px0 + 70) - 150)} L ${px0 + 112} ${f1(base(px0 + 112) - 176)} L ${px0 + 150} ${f1(base(px0 + 150) - 140)} L ${px1} ${f1(base(px1) - 50)} L ${px1 + 4} ${f1(base(px1 + 4))} Z" fill="rgb(75 75 48 / .10)" stroke="var(--ink)" stroke-width="1.4" stroke-linejoin="round"/>`;
    const rowsP: [number, number, number[]][] = [
      [px0 + 50, 0, [26, 30, 24, 28, 26]],
      [px0 + 54, 1, [24, 28, 26, 24, 22]],
      [px0 + 64, 2, [26, 24, 28, 22]],
      [px0 + 74, 3, [24, 26, 22]],
      [px0 + 86, 4, [26, 24]],
      [px0 + 100, 5, [24]],
    ];
    rowsP.forEach(([x0, r, widths]) => {
      let x = x0;
      widths.forEach((w, k) => {
        const yb = base(x + w / 2) - r * 26, hh = 24;
        pos += `<g transform="translate(${f1(x)} ${f1(yb)})"><rect x="0" y="${-hh}" width="${w}" height="${hh}" class="pf" style="stroke-width:1.4"/>
          <path class="ln-thin" d="M ${f1(w * .25)} ${-hh + 7} l 0 6 M ${f1(w * .7)} ${-hh + 7} l 0 6"/>${(r + k) % 2 === 0 ? `<path class="ln-thin" d="M ${f1(w * .4)} 0 l 0 -8 q ${f1(w * .1)} -5 ${f1(w * .2)} 0 l 0 8"/>` : ''}</g>`;
        x += w + 1;
      });
    });
    // the church with its majolica dome, low on the left
    const cx = px0 + 6, cb = base(cx + 20);
    pos += `<g transform="translate(${f1(cx)} ${f1(cb)})"><rect x="0" y="-30" width="40" height="30" class="pf" style="stroke-width:1.5"/>
      <path d="M 6 -30 C 6 -54 34 -54 34 -30 Z" fill="rgb(242 194 48 / .45)" stroke="var(--ink)" stroke-width="1.6"/>
      <path class="ln-thin" d="M 13 -31 C 13 -44 17 -49 20 -51 M 27 -31 C 27 -44 23 -49 20 -51 M 20 -31 L 20 -51"/>
      <path class="ln-thin" d="M 20 -51 L 20 -58 M 17 -55 L 23 -55 M 14 0 L 14 -12 q 6 -7 12 0 L 26 0"/></g>`;
    S.push(pos);
    // sea, beach umbrellas below the road
    S.push(waves(830, 1030, (x) => yL3(x) + 36, 1));
    ([[880, 'var(--paper)'], [910, 'rgb(242 194 48 / .5)'], [944, 'var(--paper)']] as [number, string][]).forEach(([x, c]) => {
      const y = yL3(x) + 30;
      S.push(`<g transform="translate(${x} ${f1(y)})"><path d="M -9 0 Q 0 -8 9 0 Z" fill="${c}" stroke="var(--ink)" stroke-width="1.1"/><path class="ln-thin" d="M 0 0 L 0 8"/></g>`);
    });
    S.push(`<text x="${px0 + 112}" y="${f1(base(px0 + 112) - 190)}" text-anchor="middle" style="font: 400 9px var(--f-caps); letter-spacing: .32em; fill: var(--ink-soft)">POSITANO</text>`);
  }
  return { backdrop: B.join(''), scenery: S.join(''), fx: F.join('') };
}
