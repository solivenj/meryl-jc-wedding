/* Umbria: TODI arrow, the Monastero sign, cypresses and olives.
   Moved verbatim from the approved prototype; see components/italy/road/route.ts. */
import { greenSign, itArrow, cypress, olive, up, dn } from "./kit.ts";

export function umbriaArt(): { backdrop: string; scenery: string; fx: string } {
  const B: string[] = [], S: string[] = [], F: string[] = [];
  { const s = up(8, .22), t = up(8, .72);
    S.push(itArrow(s.x, s.y, 'TODI  3', -1));
    S.push(greenSign(t.x, t.y, ['MONASTERO', 'S. MARGHERITA'], 'var(--brown)'));
    [.38, .43, .56, .6, .9].forEach((f, k) => { const p = up(8, f, 18); S.push(cypress(p.x, p.y, [96, 120, 104, 130, 90][k])); });
    [.3, .52, .8].forEach((f) => { const p = dn(8, f, 84); S.push(olive(p.x, p.y)); });
    [.05].forEach((f) => { const p = dn(7, f, 70); S.push(olive(p.x, p.y)); });
  }
  return { backdrop: B.join(''), scenery: S.join(''), fx: F.join('') };
}
