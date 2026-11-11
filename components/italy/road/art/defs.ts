/* The world's <defs>: the road reveal mask, both car bodies, both wheels.
   Moved from the approved prototype. Two changes, same look: fill="var(--paper)" and
   fill="none" stroke="var(--ink)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" became plain attributes, because a <use> clone cannot see
   the .road-trip-scoped classes and the car came out solid black. */
export const defsMarkup = (): string => `        <mask id="reveal" maskUnits="userSpaceOnUse" x="-200" y="-200" width="1600" height="5300">
          <path id="revealPath" fill="none" stroke="#fff" stroke-width="80" stroke-linecap="butt"/>
        </mask>
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
