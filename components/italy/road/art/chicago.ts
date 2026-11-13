/* Chicago: John's drawing of the skyline and the lakefront
   (public/italy/art/chicago.jpeg, knocked out to ink in
   public/italy/road/chicago.webp, 900 x 628). It replaces the prototype's
   drawn skyline, L train and white coat.

   Tucked in toward leg 4's left bend and set low, its foot about 3 above
   the road at its left edge, where leg 4 is highest. Leg 4 climbs to the
   left and the leg above it to the right, so the room narrows toward that
   bend: 360 wide at x 290 is as far in as it goes with its top clearing
   the road above (by about 17). */
import { legY } from "../route.ts";
import { f1 } from "./kit.ts";

export function chicagoArt(): { backdrop: string; scenery: string; fx: string } {
  const B: string[] = [], S: string[] = [], F: string[] = [];
  {
    const w = 360, h = (w * 628) / 900, x = 290;
    const yb = legY(4, x) - 20;
    S.push(`<image href="/italy/road/chicago.webp" x="${x}" y="${f1(yb - h)}" width="${w}" height="${f1(h)}"/>`);
  }
  return { backdrop: B.join(''), scenery: S.join(''), fx: F.join('') };
}
