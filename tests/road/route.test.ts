import { test } from "node:test";
import assert from "node:assert/strict";
import {
  PIECES,
  CUM,
  TOTAL_W,
  SCALE_W,
  legStart,
  hairpinSeg,
  locate,
  chapterStart,
  odometerReading,
  TRIP_MILES,
  pieceIndex,
  roadPaths,
  TEXT_LEAD,
  textChapter,
  SPURS,
  FORK,
  legY,
  ITALY_ENTRY,
  ITALY_TIP,
  ITALY_DRAWING,
  W,
  H,
  DY,
} from "../../components/italy/road/route.ts";

/* The last two numbers in an SVG segment are its end point. */
const endOf = (seg: string) => {
  const n = seg.trim().split(/[\s,]+/).map(Number).filter((v) => !Number.isNaN(v));
  return { x: n[n.length - 2], y: n[n.length - 1] };
};

test("PIECES has 30 pieces and ends with park", () => {
  assert.equal(PIECES.length, 30);
  assert.equal(PIECES[0].kind, "spur");
  assert.equal(PIECES[PIECES.length - 1].tag, "park");
});

test("weights are the prototype's", () => {
  // The prototype's 28.8, plus the Boston and Chicago pauses (0.8 each),
  // less the Bali and Spain pauses (leg 5 now drives straight through),
  // plus 1.5 for the Italy drawing (road 0.8 and ride 2.6, against the old
  // leg 1.9).
  assert.ok(Math.abs(TOTAL_W - 30.3 * 0.72) < 1e-9);
  assert.equal(SCALE_W, 0.72);
  assert.equal(PIECES[pieceIndex("long")].w, 3.0 * 0.72);
  assert.equal(CUM.length, 31);
});

test("hairpins join legs", () => {
  // Leg 3 has none: it ends in the Italy drawing, and the flight from the
  // drawing’s tip takes the Vespa on to leg 4.
  for (const i of [1, 2, 4, 5, 6, 7]) {
    const e = endOf(hairpinSeg(i));
    const s = legStart(i + 1);
    assert.ok(Math.abs(e.x - s.x) < 0.1 && Math.abs(e.y - s.y) < 0.1, `hairpin ${i}`);
  }
});

test("pieces are continuous", () => {
  const moving = PIECES.filter((p) => p.kind === "road" || p.kind === "ride" || p.kind === "flight");
  for (let k = 1; k < moving.length; k++) {
    const prevEnd = endOf(moving[k - 1].seg!);
    const from = moving[k].from!;
    assert.ok(Math.abs(prevEnd.x - from.x) < 0.1 && Math.abs(prevEnd.y - from.y) < 0.1, `piece ${k}`);
  }
});

test("locate bounds", () => {
  assert.deepEqual(locate(0), { i: 0, t: 0 });
  assert.deepEqual(locate(1), { i: 29, t: 1 });
  assert.deepEqual(locate(-1), locate(0));
  assert.deepEqual(locate(2), locate(1));
});

test("locate is monotonic and reversible", () => {
  let prev = locate(0);
  for (let k = 1; k <= 1000; k++) {
    const cur = locate(k / 1000);
    assert.ok(cur.i >= prev.i, `i went back at ${k}`);
    if (cur.i === prev.i) assert.ok(cur.t >= prev.t - 1e-12, `t went back at ${k}`);
    prev = cur;
  }
});

test("chapter starts", () => {
  assert.equal(chapterStart(0), CUM[1] / TOTAL_W);
  for (let ch = 1; ch <= 9; ch++) assert.ok(chapterStart(ch) > chapterStart(ch - 1), `chapter ${ch}`);
});

test("road paths", () => {
  const r = roadPaths();
  // one continuous path for the reveal mask, starting where leg 1 starts
  assert.ok(r.full.startsWith(`M ${FORK.x} ${FORK.y} `));
  assert.equal((r.full.match(/M /g) || []).length, 1);
  // the drivable road skips the three flights and the Italy ride: a move-to for each
  assert.equal((r.road.match(/M /g) || []).length, 1 + 3 + 1);
  assert.equal(r.flights.length, 3);
  for (const f of r.flights) assert.match(f, /^M [\d.-]+ [\d.-]+ C /);
  assert.ok(r.spurs.includes(SPURS.a) && r.spurs.includes(SPURS.b));
});

test("stop text comes in ahead of the stop", () => {
  const lead = TEXT_LEAD / TOTAL_W;
  assert.ok(TEXT_LEAD > 0);
  assert.equal(textChapter(0), -1);
  for (const ch of [0, 2, 6, 9]) {
    assert.equal(textChapter(chapterStart(ch) - lead + 1e-6), ch, `stop ${ch} shows at its lead`);
    assert.notEqual(textChapter(chapterStart(ch) - lead - 1e-3), ch, `stop ${ch} not before its lead`);
  }
  assert.equal(textChapter(1), 9);
});

test("odometer runs 0 to Chicago–Todi miles", () => {
  assert.deepEqual(odometerReading({ roadFraction: 0 }), { value: 0, unit: "MI" });
  assert.deepEqual(odometerReading({ roadFraction: 0.5 }), { value: TRIP_MILES / 2, unit: "MI" });
  assert.deepEqual(odometerReading({ roadFraction: 1 }), { value: TRIP_MILES, unit: "MI" });
  assert.deepEqual(odometerReading({ roadFraction: 1.2 }), { value: TRIP_MILES, unit: "MI" });
  assert.equal(TRIP_MILES, 4768);
});

test("Italy 2022: leg 3 runs into the drawing, the Vespa rides it, the flight leaves from its tip", () => {
  const road = PIECES[pieceIndex("italy22")];
  const ride = PIECES[pieceIndex("vespaRide")];
  const fly = PIECES[pieceIndex("flyhome")];
  assert.equal(ride.kind, "ride");
  assert.equal(road.car, "vespa");
  assert.equal(ride.car, "vespa");
  // the entry sits on leg 3, inside the drawing, above its faded bottom edge
  assert.ok(Math.abs(legY(3, ITALY_ENTRY.x) - ITALY_ENTRY.y) < 0.2, "entry on leg 3");
  assert.ok(ITALY_ENTRY.x > ITALY_DRAWING.x && ITALY_ENTRY.y < ITALY_DRAWING.cutY);
  assert.deepEqual(endOf(road.seg!), ITALY_ENTRY);
  assert.deepEqual(ride.from, ITALY_ENTRY);
  assert.deepEqual(endOf(ride.seg!), ITALY_TIP);
  assert.deepEqual(fly.from, ITALY_TIP);
  assert.deepEqual(endOf(fly.seg!), legStart(4));
  // the drawing fits the world and stays clear of Chicago’s leg
  assert.ok(ITALY_DRAWING.x >= 0 && ITALY_DRAWING.x + ITALY_DRAWING.w <= W);
  assert.ok(ITALY_TIP.y - legStart(4).y > 200, "room for the flight up to Chicago");
});

test("the extra height leaves Chicago and everything above where it was", () => {
  assert.equal(H, 4880 + DY);
  assert.equal(legStart(4).y, 4400 - 3 * 460);
  assert.equal(legStart(8).y, 4400 - 7 * 460);
  assert.equal(legStart(1).y, 4400 + DY);
});
