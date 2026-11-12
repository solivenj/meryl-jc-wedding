/* The two merging roads: John's short road from NJ (left edge) and Meryl's
   long road from CA (right edge) — California is the longer drive to Boston.
   Moved from the approved prototype; see components/italy/road/route.ts. */
import { Y0 } from "../route.ts";
import { greenSign } from "./kit.ts";

export function prologueArt(): { backdrop: string; scenery: string; fx: string } {
  const B: string[] = [], S: string[] = [], F: string[] = [];
  S.push(greenSign(34, Y0 + 72, ['NJ'], 'var(--hwy)', 52));
  S.push(greenSign(1090, Y0 + 360, ['CA'], 'var(--hwy)', 52));
  return { backdrop: B.join(''), scenery: S.join(''), fx: F.join('') };
}
