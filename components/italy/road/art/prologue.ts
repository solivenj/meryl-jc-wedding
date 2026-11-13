/* The two merging roads: John's short road from NJ (left edge) and Meryl's
   long road from CA (right edge) — California is the longer drive to Boston.
   Moved from the approved prototype; see components/italy/road/route.ts. */
import { Y0 } from "../route.ts";
import { drawnSign } from "./kit.ts";

export function prologueArt(): { backdrop: string; scenery: string; fx: string } {
  const B: string[] = [], S: string[] = [], F: string[] = [];
  /* Wider than the old 52px highway shields, so each is pulled in from
     the stage edge enough to stay whole. NJ stands just above its own road,
     its posts clear of the tarmac, so the car passes below it. */
  S.push(drawnSign(75, Y0 + 38, '/italy/road/nj_sign.webp', 130));
  S.push(drawnSign(1118, Y0 + 360, '/italy/road/ca_sign.webp', 140));
  return { backdrop: B.join(''), scenery: S.join(''), fx: F.join('') };
}
