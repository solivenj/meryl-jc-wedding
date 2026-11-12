import { test } from "node:test";
import assert from "node:assert/strict";
import { defsMarkup, backdropMarkup, sceneryMarkup, fxMarkup, longArcD } from "../../components/italy/road/art/index.ts";

test("scenery has every stop's landmarks", () => {
  const s = sceneryMarkup();
  for (const needle of [
    "BOSTON, MA",
    "NEU",
    "CHARLES RIVER",
    "PACIFIC",
    ">80<",
    "POSITANO",
    "ATLANTIC",
    "ITALIA",
    "TODI  3",
    "S. MARGHERITA",
    'id="tally"',
    'id="family"',
    'id="town"',
    "CA</text>",
    "NJ</text>",
  ]) {
    assert.ok(s.includes(needle), `missing ${needle}`);
  }
});

test("fx has every animated element", () => {
  const f = fxMarkup();
  for (const id of ["heart", "ring", "sparks", "keys", "keysTxt", "stIt22", "stBali", "stSpain", "stIt27"]) {
    assert.ok(f.includes(`id="${id}"`), `missing #${id}`);
  }
});

test("defs has the vehicles", () => {
  const d = defsMarkup();
  for (const id of ["carBody", "itBody", "wheel", "wheelS", "reveal", "revealPath"]) {
    assert.ok(d.includes(`id="${id}"`), `missing #${id}`);
  }
});

test("Meryl's CA sign is on the long road, John's NJ sign on the short one", () => {
  // The long spur road comes in from the right edge, the short one from the left.
  const x = (label: string) => Number(sceneryMarkup().match(new RegExp(`<text class="hwy" x="([\\d.]+)"[^>]*>${label}</text>`))![1]);
  assert.ok(x("CA") > 600, `CA sign at x=${x("CA")}`);
  assert.ok(x("NJ") < 200, `NJ sign at x=${x("NJ")}`);
});

test("Chicago has no Bean and no city flag", () => {
  const s = sceneryMarkup();
  assert.ok(!s.includes('id="bean"') && !s.includes("rgb(120 180 220"), "Bean or flag still drawn");
});

test("Thanksgiving: lights run from the house to a pole past the table, eight people at it", () => {
  const s = sceneryMarkup();
  assert.ok(s.includes('id="lights"'), "no string of lights");
  const fam = s.slice(s.indexOf('id="family"'));
  assert.equal((fam.match(/class="fam"/g) || []).length, 8);
  assert.ok(!s.includes("M 26 -96 Q 60 -76 96 -92"), "old floating bunting still drawn");
});

test("vehicle defs style themselves without classes", () => {
  // <use> clones can't see .road-trip-scoped classes; a class here paints the car black
  assert.ok(!/class=/.test(defsMarkup()));
});

test("no arrivals board or med school sign", () => {
  const s = sceneryMarkup();
  assert.ok(!s.includes("ARRIVALS"));
  assert.ok(!s.includes("MED SCHOOL"));
});

test("content rules", () => {
  const all = (defsMarkup() + backdropMarkup() + sceneryMarkup() + fxMarkup()).toLowerCase();
  for (const word of ["church", "twice", "moved in"]) assert.ok(!all.includes(word), `contains ${word}`);
});

test("long-distance arc is a cubic path", () => {
  assert.match(longArcD(), /^M [\d.-]+ [\d.-]+ C /);
});
