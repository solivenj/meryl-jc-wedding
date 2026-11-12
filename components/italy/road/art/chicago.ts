/* Chicago: the white coat and stethoscope, the skyline and the L.
   Moved verbatim from the approved prototype; see components/italy/road/route.ts. */
import { Y0, legY } from "../route.ts";
import { f1, up } from "./kit.ts";

export function chicagoArt(): { backdrop: string; scenery: string; fx: string } {
  const B: string[] = [], S: string[] = [], F: string[] = [];
  { const yL4 = (x: number) => legY(4, x);
    // white coat and stethoscope on a stand
    const wc = up(4, .36, 20);
    S.push(`<g transform="translate(${f1(wc.x)} ${f1(wc.y)})">
      <path class="ln" d="M 0 0 L 0 -78 M -12 0 L 12 0 M 0 -78 q 5 -4 1 -8"/>
      <path class="ln-thin" d="M -16 -66 L 0 -72 L 16 -66"/>
      <path class="pf" d="M -16 -66 L -26 -40 L -21 -38 L -19 -46 L -19 -10 L 19 -10 L 19 -46 L 21 -38 L 26 -40 L 16 -66 L 7 -66 L 0 -50 L -7 -66 Z" style="stroke-width:1.6"/>
      <path class="ln-thin" d="M 0 -50 L 0 -12 M 8 -32 l 7 0 M -15 -24 l 6 0"/>
      <path d="M -6 -64 C -10 -50 -12 -40 -6 -34 C -2 -30 4 -30 8 -36 C 12 -44 8 -56 6 -64" fill="none" stroke="var(--ink)" stroke-width="1.6"/>
      <circle cx="-6" cy="-31" r="3.2" fill="var(--ink-soft)" stroke="var(--ink)" stroke-width="1"/>
    </g>`);
    // skyline + the L
    const cx0 = 360, cb = Y0 - 1602;
    S.push(`<g transform="translate(${cx0} ${cb})">
      <path class="pf" d="M 0 0 L 0 -70 L 30 -70 L 30 0 Z"/><path class="ln-thin" d="M 8 -60 l 0 52 M 22 -60 l 0 52"/>
      <path class="pf" d="M 34 0 L 34 -120 L 62 -120 L 62 0 Z"/><path class="ln-thin" d="M 34 -100 L 62 -100 M 34 -80 L 62 -80 M 34 -60 L 62 -60 M 34 -40 L 62 -40"/>
      <path class="pf" d="M 70 0 L 70 -150 L 82 -150 L 82 -176 L 96 -176 L 96 -194 L 108 -194 L 108 -168 L 116 -168 L 116 0 Z"/>
      <path class="ln" d="M 99 -194 L 99 -222 M 105 -194 L 105 -216"/><path class="ln-thin" d="M 76 -140 L 76 -8 M 90 -170 L 90 -8 M 102 -186 L 102 -8 M 110 -160 L 110 -8"/>
      <path class="pf" d="M 122 0 L 128 -98 L 146 -98 L 152 0 Z"/><path class="ln-thin" d="M 128 -98 L 152 0 M 146 -98 L 122 0"/>
      <path class="pf" d="M 158 0 L 164 -168 L 192 -168 L 198 0 Z"/><path class="ln-thin" d="M 164 -168 L 196 -84 M 192 -168 L 160 -84 M 160 -84 L 198 0 M 196 -84 L 158 0"/>
      <path class="ln" d="M 170 -168 L 170 -196 M 186 -168 L 186 -192"/>
      <path class="pf" d="M 204 0 L 204 -110 L 230 -124 L 256 -110 L 256 0 Z"/><path class="ln-thin" d="M 214 -100 l 0 90 M 230 -110 l 0 100 M 246 -100 l 0 90"/>
      <path class="pf" d="M 262 0 L 262 -84 L 294 -84 L 294 0 Z"/><path class="ln-thin" d="M 262 -66 L 294 -66 M 262 -48 L 294 -48 M 262 -30 L 294 -30"/>
      <path class="ln" d="M -6 0 L 300 0"/>
      <path class="ln" d="M -6 14 L 300 14 M -6 22 L 300 22"/>
      <path class="ln-thin" d="M 4 14 L 12 22 L 20 14 L 28 22 L 36 14 L 44 22 L 52 14 L 60 22 L 68 14 L 76 22 L 84 14 L 92 22 L 100 14 L 108 22 L 116 14 L 124 22 L 132 14 L 140 22 L 148 14 L 156 22 L 164 14 L 172 22 L 180 14 L 188 22 L 196 14 L 204 22 L 212 14 L 220 22 L 228 14 L 236 22 L 244 14 L 252 22 L 260 14 L 268 22 L 276 14 L 284 22 L 292 14"/>
      ${[20, 110, 200, 290].map((x) => `<path class="post" d="M ${x} 22 L ${x} ${f1(yL4(cx0 + x) - 17 - cb)}"/>`).join('')}
      <g transform="translate(120 0)"><rect x="0" y="-2" width="74" height="16" rx="3" class="paper" stroke="var(--ink)" stroke-width="1.5" transform="translate(0 -12)"/>
        <path class="ln-thin" d="M 8 -10 l 10 0 l 0 6 l -10 0 Z M 26 -10 l 10 0 l 0 6 l -10 0 Z M 44 -10 l 10 0 l 0 6 l -10 0 Z M 62 -10 l 6 0 l 0 6 l -6 0 Z"/></g>
    </g>`);
  }
  return { backdrop: B.join(''), scenery: S.join(''), fx: F.join('') };
}
