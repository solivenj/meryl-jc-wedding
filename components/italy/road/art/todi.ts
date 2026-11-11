/* The top: Todi, the piazza, the key board, the keys, the merge heart and the ring.
   Moved verbatim from the approved prototype; see components/italy/road/route.ts. */
import { cypress } from "./kit.ts";

export function todiArt(): { backdrop: string; scenery: string; fx: string } {
  const B: string[] = [], S: string[] = [], F: string[] = [];
  S.push(`<g id="town">
    <path class="ln" d="M 360 604 C 420 600 470 598 520 598 L 860 598 C 920 600 960 610 1010 624"/>
    <path class="pf" d="M 400 600 L 400 520 L 436 520 L 436 500 L 470 500 L 470 600 Z"/>
    <path class="ln-thin" d="M 410 540 l 0 12 M 424 540 l 0 12 M 446 520 l 0 10 M 458 520 l 0 10"/>
    <path class="pf" d="M 476 600 L 476 470 L 482 470 L 482 462 L 490 462 L 490 470 L 498 470 L 498 462 L 506 462 L 506 470 L 514 470 L 514 462 L 522 462 L 522 470 L 530 470 L 530 462 L 538 462 L 538 470 L 546 470 L 546 600 Z"/>
    <path class="ln-thin" d="M 492 500 l 0 16 M 512 500 l 0 16 M 530 500 l 0 16 M 492 540 l 0 16 M 512 540 l 0 16 M 530 540 l 0 16"/>
    <path class="pf" d="M 600 600 L 600 380 L 610 360 L 640 360 L 650 380 L 650 600 Z"/>
    <path class="ln-thin" d="M 612 400 l 0 22 q 13 -8 26 0 l 0 -22 M 618 470 l 0 14 M 632 470 l 0 14 M 600 450 L 650 450"/>
    <path class="pf" d="M 664 600 L 664 470 L 732 440 L 800 470 L 800 600 Z"/>
    <circle cx="732" cy="500" r="18" class="pf"/>
    <path class="ln-thin" d="M 732 482 L 732 518 M 714 500 L 750 500 M 719 487 L 745 513 M 745 487 L 719 513"/>
    <path class="ln-thin" d="M 716 600 L 716 560 q 16 -16 32 0 L 748 600"/>
    <path class="pf" d="M 808 600 L 808 520 L 846 500 L 884 520 L 884 600 Z"/>
    <path class="pf" d="M 884 600 L 884 540 L 946 540 L 946 604"/>
    <path class="ln-thin" d="M 822 540 l 0 12 M 840 540 l 0 12 M 858 540 l 0 12 M 900 556 l 0 12 M 916 556 l 0 12 M 930 556 l 0 12"/>
    <path class="ln-thin" d="M 664 470 L 800 470"/>
  </g>`);
  [[372, 606, 70], [960, 622, 84], [990, 640, 64], [340, 640, 60]].forEach(([x, y, h]) => S.push(cypress(x, y, h)));
  const hook = { x: 696, y: 560 };
  S.push(`<g transform="translate(${hook.x} ${hook.y})"><rect x="-22" y="-14" width="44" height="18" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.4"/><path class="ln-thin" d="M -10 -2 q 0 6 4 6 M 8 -2 q 0 6 4 6"/></g>`);
  F.push(`<g id="keys" opacity="0"><circle cx="0" cy="0" r="5" fill="none" stroke="var(--ink)" stroke-width="1.6"/><path d="M 0 5 L 0 20 M 0 14 L 4 14 M 0 18 L 5 18" class="ln" stroke-width="1.8"/><path d="M 3 2 L 9 14" stroke="var(--gold)" stroke-width="2.4" stroke-linecap="round"/></g>`);
  F.push(`<text id="keysTxt" x="696" y="620" text-anchor="middle" opacity="0" style="font: italic 400 19px var(--f-body); fill: var(--ink)">keys away</text>`);

  F.push(`<path id="heart" opacity="0" fill="rgb(179 38 45 / .85)" stroke="var(--ink)" stroke-width="1.2" d="M 0 4 C -10 -4 -12 -12 -6 -15 C -2 -17 0 -14 0 -11 C 0 -14 2 -17 6 -15 C 12 -12 10 -4 0 4 Z"/>`);
  F.push(`<g id="ring" opacity="0">
      <circle cx="0" cy="0" r="13" fill="none" stroke="var(--ink)" stroke-width="3"/>
      <circle cx="0" cy="0" r="13" fill="none" stroke="var(--gold)" stroke-width="1.4"/>
      <path d="M -8 -16 L 0 -26 L 8 -16 L 0 -11 Z" fill="#fff" stroke="var(--ink)" stroke-width="1.5" stroke-linejoin="round"/>
      <g class="ln-thin" id="sparks"><path d="M -26 -28 l -6 -6 M 26 -28 l 6 -6 M 0 -38 l 0 -9 M -30 -6 l -9 0 M 30 -6 l 9 0"/></g>
    </g>`);
  return { backdrop: B.join(''), scenery: S.join(''), fx: F.join('') };
}
