/* The prototype's drawing kit: small helpers that return SVG markup.
   Bodies are verbatim from the approved prototype; only types were added. */
import { legPt, type Pt } from "../route.ts";

export const f1 = (n: number): number => Math.round(n * 10) / 10;

export const TERRA = "rgb(201 111 74 / .5)";

export const greenSign = (x: number, yb: number, lines: string[], color = "var(--hwy)", w?: number): string => {
  const lh = 17, h = lines.length * lh + 13;
  const ww = w || Math.max(...lines.map((l) => l.length)) * 9 + 28;
  const top = yb - h - 34;
  return `<g>
      <line class="post" x1="${x - ww / 2 + 14}" y1="${top + h}" x2="${x - ww / 2 + 14}" y2="${yb}"/>
      <line class="post" x1="${x + ww / 2 - 14}" y1="${top + h}" x2="${x + ww / 2 - 14}" y2="${yb}"/>
      <rect x="${x - ww / 2}" y="${top}" width="${ww}" height="${h}" rx="5" fill="${color}" stroke="var(--ink)" stroke-width="1.8"/>
      <rect x="${x - ww / 2 + 3}" y="${top + 3}" width="${ww - 6}" height="${h - 6}" rx="3" fill="none" stroke="#fff" stroke-width="1.3"/>
      ${lines.map((l, i) => `<text class="hwy" x="${x}" y="${top + 6 + lh * (i + 1) - 3}" text-anchor="middle">${l}</text>`).join('')}
    </g>`;
};

/* A hand-drawn signpost image (public/italy/road/), centred on x with its
   posts standing on yb. The place signs are 480 × 356 and the time zone
   banners 480 × 283 (pass ratio); boards are olive with cream lettering
   (#7d7d55 board), made from John’s drawings in public/italy/art/. */
export const drawnSign = (x: number, yb: number, href: string, w: number, ratio = 356 / 480): string => {
  const h = w * ratio;
  return `<image href="${href}" x="${x - w / 2}" y="${yb - h}" width="${w}" height="${h}"/>`;
};

export const itArrow =(x: number, yb: number, text: string, dir = -1): string => {
  const ww = text.length * 9.5 + 40, h = 30, top = yb - h - 40;
  const l = x - ww / 2, r = x + ww / 2, m = top + h / 2;
  const pts = dir < 0 ? `${l},${m} ${l + 16},${top} ${r},${top} ${r},${top + h} ${l + 16},${top + h}` : `${r},${m} ${r - 16},${top} ${l},${top} ${l},${top + h} ${r - 16},${top + h}`;
  return `<g><line class="post" x1="${x}" y1="${top + h}" x2="${x}" y2="${yb}"/>
      <polygon points="${pts}" fill="#fff" stroke="var(--ink)" stroke-width="2"/>
      <text class="itx" x="${x + dir * -6}" y="${m + 5}" text-anchor="middle">${text}</text></g>`;
};

export const cypress = (x: number, yb: number, h: number): string => `<g><path class="lf" d="M ${x} ${yb - 4} C ${x - 15} ${yb - 30} ${x - 11} ${yb - h * .72} ${x} ${yb - h} C ${x + 11} ${yb - h * .72} ${x + 15} ${yb - 30} ${x} ${yb - 4} Z"/><path class="ln-thin" d="M ${x} ${yb} L ${x} ${yb - 6} M ${x - 4} ${yb - h * .45} q 4 -6 8 -2 M ${x - 5} ${yb - h * .25} q 5 -5 10 -1"/></g>`;

export const olive = (x: number, yb: number): string => `<g><path class="ln" d="M ${x} ${yb} C ${x - 2} ${yb - 14} ${x + 5} ${yb - 20} ${x + 2} ${yb - 32} M ${x + 1} ${yb - 22} C ${x - 8} ${yb - 26} ${x - 10} ${yb - 30} ${x - 12} ${yb - 36}"/>
     <path class="lf" d="M ${x - 30} ${yb - 40} C ${x - 34} ${yb - 58} ${x - 12} ${yb - 66} ${x} ${yb - 60} C ${x + 14} ${yb - 72} ${x + 38} ${yb - 60} ${x + 32} ${yb - 44} C ${x + 36} ${yb - 32} ${x + 14} ${yb - 28} ${x + 4} ${yb - 34} C ${x - 6} ${yb - 26} ${x - 30} ${yb - 28} ${x - 30} ${yb - 40} Z"/></g>`;

export const palm = (x: number, yb: number, h: number): string => `<g><path class="ln" d="M ${x} ${yb} C ${x - 4} ${yb - h * .4} ${x + 6} ${yb - h * .7} ${x + 2} ${yb - h}"/>
     <path class="ln-thin" d="M ${x - 1} ${yb - h * .3} l 5 1 M ${x} ${yb - h * .5} l 5 1 M ${x + 2} ${yb - h * .7} l 5 1"/>
     ${[[-38, 8], [-26, -14], [0, -22], [26, -14], [38, 8]].map(([dx, dy]) => `<path class="lf" d="M ${x + 2} ${yb - h} Q ${x + 2 + dx * .5} ${yb - h + dy - 12} ${x + 2 + dx} ${yb - h + dy} Q ${x + 2 + dx * .55} ${yb - h + dy * .4 - 2} ${x + 2} ${yb - h} Z"/>`).join('')}</g>`;

export const waves = (x0: number, x1: number, yAt: (x: number) => number, rows = 2): string => { const a: string[] = []; for (let x = x0; x < x1 - 30; x += 34) { const y = yAt(x); for (let r = 0; r < rows; r++) a.push(`M ${f1(x + r * 12)} ${f1(y + r * 20)} q 8.5 -7 17 0 t 17 0`); } return `<path class="ln-thin" d="${a.join(' ')}" opacity=".7"/>`; };

export const stamp = (id: string, x: number, y: number, top: string, bottom: string, rot = -12): string => `<g id="${id}" opacity="0" data-x="${x}" data-y="${y}" data-r="${rot}">
     <circle r="28" fill="rgb(255 252 245 / .6)" stroke="var(--stamp)" stroke-width="2.4"/><circle r="22" fill="none" stroke="var(--stamp)" stroke-width="1"/>
     <text y="-3" text-anchor="middle" style="font: 800 9.5px var(--f-hwy); letter-spacing: .12em; fill: var(--stamp)">${top}</text>
     <text y="11" text-anchor="middle" style="font: 700 11px var(--f-hwy); letter-spacing: .08em; fill: var(--stamp)">${bottom}</text>
     <path d="M -16 2 L 16 2" stroke="var(--stamp)" stroke-width=".8"/></g>`;

/* Roadside points: uphill (above the road) and downhill (below it). */
export const up = (i: number, f: number, lift = 20): Pt => { const p = legPt(i, f); return { x: p.x, y: p.y - lift }; };
export const dn = (i: number, f: number, drop = 24): Pt => { const p = legPt(i, f); return { x: p.x, y: p.y + drop }; };
