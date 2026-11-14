/* The world's <defs>: the road reveal mask, the fade where leg 3 hands over
   to the Italy drawing, both car bodies, both wheels, and the Vespa.
   Moved from the approved prototype. Two changes, same look: fill="var(--paper)" and
   fill="none" stroke="var(--ink)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" became plain attributes, because a <use> clone cannot see
   the .road-trip-scoped classes and the car came out solid black. */
import { H, ITALY_ENTRY } from "../route.ts";

const LN = `fill="none" stroke="var(--ink)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"`;
const MINT = "#b9d3c0";
/* The page road fades out over the last stretch before it meets the drawn
   one, ending 26 short of ITALY_ENTRY, under the drawing's own faded edge. */
const ROAD_FADE = { from: ITALY_ENTRY.x - 116, to: ITALY_ENTRY.x - 26 };

export const defsMarkup = (): string => `        <mask id="reveal" maskUnits="userSpaceOnUse" x="-200" y="-200" width="1600" height="${H + 400}">
          <path id="revealPath" fill="none" stroke="#fff" stroke-width="80" stroke-linecap="butt"/>
        </mask>
        <linearGradient id="roadEndG" gradientUnits="userSpaceOnUse" x1="${ROAD_FADE.from}" y1="0" x2="${ROAD_FADE.to}" y2="0"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>
        <mask id="roadEnd" maskUnits="userSpaceOnUse" x="-200" y="-200" width="1600" height="${H + 400}">
          <rect x="-200" y="-200" width="1600" height="${H + 400}" fill="#fff"/>
          <rect x="${ROAD_FADE.from}" y="${ITALY_ENTRY.y - 70}" width="200" height="140" fill="url(#roadEndG)"/>
        </mask>
        <g id="vespaSide">
          <ellipse cx="0" cy="0" rx="50" ry="4" fill="rgb(30 35 30 / .14)"/>
          <circle cx="-34" cy="-12" r="11" fill="var(--paper)" stroke="var(--ink)" stroke-width="3.4"/>
          <circle cx="36" cy="-12" r="11" fill="var(--paper)" stroke="var(--ink)" stroke-width="3.4"/>
          <path fill="${MINT}" stroke="var(--ink)" stroke-width="2.2" stroke-linejoin="round" d="M -54 -18 C -56 -38 -40 -48 -18 -46 L -4 -45 L 2 -22 L 20 -22 C 25 -22 27 -28 28 -36 L 32 -62 L 39 -62 L 36 -36 C 46 -32 50 -24 50 -18 Z"/>
          <path ${LN} d="M 24 -14 C 26 -30 46 -30 50 -18"/>
          <path fill="var(--ink)" d="M -46 -48 C -40 -54 -12 -54 -6 -48 Z"/>
          <path ${LN} d="M 30 -64 L 48 -68"/>
          <circle cx="45" cy="-58" r="4" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.8"/>
          <path ${LN} d="M -14 -50 L 4 -36 L 8 -24 M -34 -50 L -18 -36 L -22 -24"/>
          <path fill="var(--paper)" stroke="var(--ink)" stroke-width="2" stroke-linejoin="round" d="M -20 -50 C -22 -66 -16 -80 -6 -80 C 2 -80 6 -68 6 -50 Z"/>
          <path ${LN} d="M 0 -70 L 32 -66"/>
          <circle cx="-6" cy="-90" r="8" fill="var(--ink-soft)" stroke="var(--ink)" stroke-width="2"/>
          <path fill="var(--paper)" stroke="var(--ink)" stroke-width="2" stroke-linejoin="round" d="M -42 -50 C -44 -64 -38 -76 -30 -76 C -22 -76 -18 -64 -18 -50 Z"/>
          <path ${LN} d="M -24 -66 L -6 -64"/>
          <path fill="var(--ink)" d="M -38 -86 C -38 -96 -30 -100 -26 -98 C -20 -96 -20 -88 -22 -82 C -22 -76 -26 -72 -30 -76 C -36 -72 -40 -78 -38 -86 Z"/>
        </g>
        <g id="vespaRear">
          <ellipse cx="0" cy="0" rx="20" ry="4" fill="rgb(30 35 30 / .18)"/>
          <rect x="-6" y="-20" width="12" height="20" rx="5" fill="var(--ink)"/>
          <path fill="${MINT}" stroke="var(--ink)" stroke-width="2" stroke-linejoin="round" d="M -24 -22 C -27 -46 -15 -56 0 -56 C 15 -56 27 -46 24 -22 C 15 -15 -15 -15 -24 -22 Z"/>
          <rect x="-6" y="-38" width="12" height="6" rx="2" fill="var(--red)" stroke="var(--ink)" stroke-width="1.4"/>
          <rect x="-8" y="-29" width="16" height="6" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.2"/>
          <path ${LN} d="M -34 -80 L -20 -76 M 34 -80 L 20 -76"/>
          <circle cx="-37" cy="-82" r="3.4" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.6"/>
          <circle cx="37" cy="-82" r="3.4" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.6"/>
          <path fill="var(--paper)" stroke="var(--ink)" stroke-width="2" stroke-linejoin="round" d="M -10 -84 C -10 -98 -2 -104 8 -104 C 18 -104 24 -98 24 -84 Z"/>
          <circle cx="8" cy="-113" r="9" fill="var(--ink-soft)" stroke="var(--ink)" stroke-width="2"/>
          <path fill="var(--paper)" stroke="var(--ink)" stroke-width="2" stroke-linejoin="round" d="M -18 -50 C -21 -74 -13 -90 -2 -90 C 10 -90 17 -74 15 -50 Z"/>
          <path fill="var(--ink)" d="M -13 -98 C -15 -112 -6 -118 -1 -118 C 7 -118 13 -112 11 -98 C 13 -88 9 -82 5 -84 L -9 -84 C -13 -82 -16 -88 -13 -98 Z"/>
        </g>
        <g id="carBody">
          <ellipse cx="0" cy="0" rx="44" ry="3.6" fill="rgb(30 35 30 / .14)"/>
          <path fill="var(--paper)" stroke="var(--ink)" stroke-width="2.4" stroke-linejoin="round" d="M -46 -12 C -48 -22 -42 -27 -34 -28 L -24 -29 C -18 -44 -6 -50 6 -50 C 20 -50 28 -42 32 -30 L 40 -28 C 47 -26 49 -20 47 -12 C 46 -10 44 -9 40 -9 L 37 -9 A 11 11 0 0 0 15 -9 L -13 -9 A 11 11 0 0 0 -35 -9 L -42 -9 C -45 -9 -46 -10 -46 -12 Z"/>
          <path d="M -45.5 -18 L 47.5 -18" stroke="var(--olive)" stroke-width="3"/>
          <path d="M -18 -30 C -14 -40 -8 -44 1 -45 L 1 -30 Z" fill="#dfe2d4" stroke="var(--ink)" stroke-width="1.6" stroke-linejoin="round"/>
          <path d="M 6 -45 C 17 -45 24 -38 27 -30 L 6 -30 Z" fill="#dfe2d4" stroke="var(--ink)" stroke-width="1.6" stroke-linejoin="round"/>
          <path d="M 3.5 -29 L 3.5 -13 M 8 -24 L 13 -24" fill="none" stroke="var(--ink)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="44.2" cy="-21.5" r="2.6" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.4"/>
          <path d="M -47 -23 L -44 -23" stroke="var(--red)" stroke-width="3" stroke-linecap="round"/>
        </g>
        <g id="itBody">
          <ellipse cx="0" cy="0" rx="38" ry="3.4" fill="rgb(30 35 30 / .14)"/>
          <path fill="var(--paper)" stroke="var(--ink)" stroke-width="2.4" stroke-linejoin="round" d="M -37 -11 C -41 -12 -41 -21 -37 -24 C -33 -39 -19 -46 0 -46 C 19 -46 30 -39 34 -26 C 40 -24 41 -13 38 -11 L 33 -11 A 9 9 0 0 0 15 -11 L -15 -11 A 9 9 0 0 0 -33 -11 Z"/>
          <path d="M -24 -27 C -21 -37 -11 -41 -1 -41 L -1 -27 Z" fill="#dfe2d4" stroke="var(--ink)" stroke-width="1.6" stroke-linejoin="round"/>
          <path d="M 4 -41 C 15 -41 22 -35 25 -27 L 4 -27 Z" fill="#dfe2d4" stroke="var(--ink)" stroke-width="1.6" stroke-linejoin="round"/>
          <path d="M -38 -18 L 39 -18" stroke="var(--olive)" stroke-width="3"/>
          <circle cx="35.5" cy="-21" r="3.6" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.4"/>
          <path fill="none" stroke="var(--ink)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" d="M 30 -13 q 6 2 10 -1 M 1 -26 L 1 -13"/>
        </g>
        <g id="wheel">
          <circle r="10" fill="var(--ink)"/>
          <circle r="4" fill="var(--paper)"/>
          <circle cx="7" cy="0" r="1.3" fill="var(--paper)"/>
          <circle cx="-3.5" cy="6.06" r="1.3" fill="var(--paper)"/>
          <circle cx="-3.5" cy="-6.06" r="1.3" fill="var(--paper)"/>
        </g>
        <g id="wheelS">
          <circle r="8.5" fill="var(--ink)"/>
          <circle r="3.4" fill="var(--paper)"/>
          <circle cx="6" cy="0" r="1.1" fill="var(--paper)"/>
          <circle cx="-3" cy="5.2" r="1.1" fill="var(--paper)"/>
          <circle cx="-3" cy="-5.2" r="1.1" fill="var(--paper)"/>
        </g>
`;
