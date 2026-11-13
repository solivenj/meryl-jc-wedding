/* The long-distance years: time zones, the two pins, and the arc the little plane flies.
   Moved from the approved prototype; see components/italy/road/route.ts. The
   I-80 shield and the Mountain time zone sign have since been taken out. */
import { legPt } from "../route.ts";
import { drawnSign, up, f1 } from "./kit.ts";

/* The two coast pins, just outside the group of banners, raised 40 off the
   road like the banners so the car never drives over them. */
export const PIN_E = 0, PIN_W = .97;

/* The plane’s arc: a projectile parabola (one quadratic curve) from pin head
   to pin head, so it leaves each pin at an angle rather than straight up,
   with its apex a little toward the east pin. It is kept low: it clears the
   banners below it and, above it, the Italy 2022 text (RoadTrip slot ch 2,
   widened and raised for this) and the next leg of road, each by only a few
   units around the plane. The plane follows #longArc, so changing this moves
   its flight too. Move or resize the banners, the pins or that text box and
   this needs re-fitting. */
export const longArcD = (): string => {
  const a = legPt(2, PIN_E), b = legPt(2, PIN_W);
  const ay = a.y - 66, by = b.y - 66;
  const cx = (a.x + b.x) / 2 + (a.x - b.x) * 0.16, cy = (ay + by) / 2 - 345;
  return `M ${f1(a.x)} ${f1(ay)} Q ${f1(cx)} ${f1(cy)} ${f1(b.x)} ${f1(by)}`;
};

export function distanceArt(): { backdrop: string; scenery: string; fx: string } {
  const B: string[] = [], S: string[] = [], F: string[] = [];
  { /* John's drawn time zone banners, in maroon (board and ribbons) with
       cream lettering, unlike the olive place signs. Their ribbons overlap
       slightly; later ones draw on top. */
    /* Centred between the two pins (midway at .49), so the arc over them is
       symmetric; raised 40 so the posts stand
       clear above the road's edge. */
    const signs: [number, string][] = [[.305, 'est'], [.49, 'cst'], [.675, 'pst']];
    signs.forEach(([f, tz]) => { const p = up(2, f, 40); S.push(drawnSign(p.x, p.y, `/italy/road/${tz}_sign.webp`, 190, 283 / 480)); });
    /* The two coast pins, unlabelled: the ends of the plane's arc. */
    const pin = (x: number, y: number) => `<g transform="translate(${x} ${y})"><path d="M 0 0 C -4 -10 -12 -16 -12 -26 A 12 12 0 1 1 12 -26 C 12 -16 4 -10 0 0 Z" fill="var(--red)" stroke="var(--ink)" stroke-width="1.6"/><circle cx="0" cy="-26" r="4.5" class="paper"/></g>`;
    const e = up(2, PIN_E, 40), w = up(2, PIN_W, 40);
    S.push(pin(e.x, e.y));
    S.push(pin(w.x, w.y));
    S.push(`<path id="longArc" d="${longArcD()}" fill="none" stroke="var(--ink)" stroke-width="1.6" stroke-dasharray="2 8" stroke-linecap="round" opacity=".4"/>`);
  }
  return { backdrop: B.join(''), scenery: S.join(''), fx: F.join('') };
}
