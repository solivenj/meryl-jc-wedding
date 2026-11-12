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
  pieceIndex,
  roadPaths,
  TEXT_LEAD,
  textChapter,
  SPURS,
} from "../../components/italy/road/route.ts";

/* The last two numbers in an SVG segment are its end point. */
const endOf = (seg: string) => {
  const n = seg.trim().split(/[\s,]+/).map(Number).filter((v) => !Number.isNaN(v));
  return { x: n[n.length - 2], y: n[n.length - 1] };
};

test("PIECES has 28 pieces and ends with park", () => {
  assert.equal(PIECES.length, 28);
  assert.equal(PIECES[0].kind, "spur");
  assert.equal(PIECES[PIECES.length - 1].tag, "park");
});

test("weights are the prototype's", () => {
  assert.ok(Math.abs(TOTAL_W - 28.8 * 0.72) < 1e-9);
  assert.equal(SCALE_W, 0.72);
  assert.equal(PIECES[pieceIndex("long")].w, 3.0 * 0.72);
  assert.equal(CUM.length, 29);
});

test("hairpins join legs", () => {
  for (let i = 1; i <= 7; i++) {
    const e = endOf(hairpinSeg(i));
    const s = legStart(i + 1);
    assert.ok(Math.abs(e.x - s.x) < 0.1 && Math.abs(e.y - s.y) < 0.1, `hairpin ${i}`);
  }
});

test("pieces are continuous", () => {
  const moving = PIECES.filter((p) => p.kind === "road" || p.kind === "flight");
  for (let k = 1; k < moving.length; k++) {
    const prevEnd = endOf(moving[k - 1].seg!);
    const from = moving[k].from!;
    assert.ok(Math.abs(prevEnd.x - from.x) < 0.1 && Math.abs(prevEnd.y - from.y) < 0.1, `piece ${k}`);
  }
});

test("locate bounds", () => {
  assert.deepEqual(locate(0), { i: 0, t: 0 });
  assert.deepEqual(locate(1), { i: 27, t: 1 });
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
  assert.ok(r.full.startsWith(`M ${legStart(1).x} ${legStart(1).y} `));
  assert.equal((r.full.match(/M /g) || []).length, 1);
  // the drivable road skips the three flights: a move-to for each
  assert.equal((r.road.match(/M /g) || []).length, 1 + 3);
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

test("odometer", () => {
  assert.deepEqual(odometerReading({ i: pieceIndex("long"), t: 0.5, roadUnits: 0 }), { value: 1050, unit: "MI" });
  assert.equal(odometerReading({ i: pieceIndex("italy22"), t: 0.5, roadUnits: 100 }).unit, "KM");
  assert.equal(odometerReading({ i: pieceIndex("flyhome"), t: 0.5, roadUnits: 100 }).unit, "MI");
  assert.equal(odometerReading({ i: pieceIndex("landed"), t: 0.5, roadUnits: 100 }).unit, "KM");
  const park = odometerReading({ i: pieceIndex("park"), t: 1, roadUnits: 1000 });
  assert.ok(Math.abs(park.value - (1000 * 0.36 + 2100) * 1.609) < 1e-9);
  assert.equal(park.unit, "KM");
});
