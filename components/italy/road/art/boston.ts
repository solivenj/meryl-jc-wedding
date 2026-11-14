/* Boston, 2019: the sign and the skyline over the Charles.
   Moved verbatim from the approved prototype; see components/italy/road/route.ts. */
import { Y0, legY } from "../route.ts";
import { drawnSign, f1, up } from "./kit.ts";

export function bostonArt(): { backdrop: string; scenery: string; fx: string } {
  const B: string[] = [], S: string[] = [], F: string[] = [];
  { /* The sign stands just past the fork (FORK, about x 266), shifted along
       leg 1 by DX from the prototype. The prototype’s polaroid pickets,
       the NEU husky included, are gone. */
    const DX = 150;
    const s = up(1, .045);
    S.push(drawnSign(s.x + 8 + DX, legY(1, s.x + 8 + DX) - 20, '/italy/road/boston_sign.webp', 152));
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
