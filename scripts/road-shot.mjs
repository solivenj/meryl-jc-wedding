// Dev-only: the Our Story road trip, prototype vs real page, side by side.
// Drives both to the same scroll progress and saves paired screenshots at a
// laptop and a phone size. The prototype is the visual spec
// (docs/superpowers/specs/2026-11-11-our-story-road-trip/prototype.html).
//
// Usage: node scripts/road-shot.mjs [baseUrl] [outDir] [--checks]
// Unlocks the password gate with GATE_PASSWORD_ITALY (read from the
// environment, or from .env.local when unset), like italy-shot.mjs.
import { chromium } from "playwright";
import { mkdirSync, readFileSync, existsSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith("--")));
const [base = "http://localhost:3000", outDir = "shots/road"] = args.filter((a) => !a.startsWith("--"));
const PROTO = pathToFileURL(resolve("docs/superpowers/specs/2026-11-11-our-story-road-trip/prototype.html")).href;
const PAGE = `${base}/italy/our-story`;
const STOPS = [0, 0.06, 0.2, 0.33, 0.42, 0.507, 0.57, 0.677, 0.785, 0.87, 1];
const SIZES = [
  [1440, 900],
  [390, 844],
];

let GATE = process.env.GATE_PASSWORD_ITALY;
if (!GATE && existsSync(".env.local")) {
  GATE = readFileSync(".env.local", "utf8").match(/^GATE_PASSWORD_ITALY=(.*)$/m)?.[1]?.trim().replace(/^["']|["']$/g, "");
}

/* Scroll so #drive sits at progress p, then let the smoothing settle. */
export async function drive(page, p) {
  await page.evaluate((p) => {
    const d = document.getElementById("drive");
    const top = d.getBoundingClientRect().top + scrollY;
    scrollTo(0, top + p * (d.offsetHeight - innerHeight));
  }, p);
  await page.waitForTimeout(1600);
}

async function context(browser, width, height) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
  if (GATE) {
    const res = await ctx.request.post(`${base}/api/gate`, { data: { password: GATE } }).catch(() => null);
    if (!res?.ok()) console.warn("gate: not unlocked — shots may show the gate page");
  }
  return ctx;
}

mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();

if (!flags.has("--checks")) {
  for (const [w, h] of SIZES) {
    const ctx = await context(browser, w, h);
    const proto = await ctx.newPage();
    const page = await ctx.newPage();
    await proto.goto(PROTO);
    await page.goto(PAGE, { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    for (const p of STOPS) {
      await drive(proto, p);
      await drive(page, p);
      const tag = `${w}-${String(p).replace(".", "_")}`;
      await proto.screenshot({ path: `${outDir}/proto-${tag}.png` });
      await page.screenshot({ path: `${outDir}/page-${tag}.png` });
      console.log("pair", tag);
    }
    await ctx.close();
  }
}

await browser.close();
