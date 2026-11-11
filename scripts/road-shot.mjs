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

/* Unlock once and reuse the session: the gate rate-limits repeated unlocks,
   and a check that quietly ran against the gate page would pass for nothing. */
let unlocked;
async function context(browser, width, height) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, storageState: unlocked });
  if (GATE && !unlocked) {
    const res = await ctx.request.post(`${base}/api/gate`, { data: { password: GATE } }).catch(() => null);
    if (!res?.ok()) throw new Error(`gate: not unlocked (${res?.status()}) — set GATE_PASSWORD_ITALY`);
    unlocked = await ctx.storageState();
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

if (flags.has("--checks")) {
  const results = [];
  const check = async (name, fn) => {
    try {
      const why = await fn();
      results.push(why ? `FAIL ${name}: ${why}` : `PASS ${name}`);
    } catch (e) {
      results.push(`FAIL ${name}: ${e.message.split("\n")[0]}`);
    }
  };
  const open = async (w, h) => {
    const ctx = await context(browser, w, h);
    const page = await ctx.newPage();
    await page.goto(PAGE, { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    if (!(await page.$("#drive"))) throw new Error("the road trip did not load (gate page?)");
    return { ctx, page };
  };
  /* The visible vehicle and the card, as viewport rects. */
  const carRect = (page) =>
    page.evaluate(() => {
      const g = [...document.querySelectorAll("#vehicles > g")].find((n) => n.getAttribute("opacity") === "1");
      const r = g?.getBoundingClientRect();
      return r ? { left: r.left, top: r.top, right: r.right, bottom: r.bottom } : null;
    });
  const opacity = (page, id) => page.evaluate((id) => document.getElementById(id)?.getAttribute("opacity"), id);
  const text = (page, id) => page.evaluate((id) => document.getElementById(id)?.textContent, id);

  await check("resize mid-drive", async () => {
    const { ctx, page } = await open(1440, 900);
    await drive(page, 0.42);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(1600);
    const r = await carRect(page);
    const narrow = await page.evaluate(() => document.getElementById("stage").classList.contains("narrow"));
    await ctx.close();
    if (!narrow) return "stage is not narrow after resizing to 390";
    if (!r || r.left < 0 || r.top < 0 || r.right > 390 || r.bottom > 844) return `car off screen: ${JSON.stringify(r)}`;
  });

  await check("restored scroll", async () => {
    const { ctx, page } = await open(1440, 900);
    await drive(page, 0.84);
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForTimeout(1600);
    const chip = await text(page, "chip");
    const stamps = await Promise.all(["stIt22", "stBali", "stSpain", "stIt27"].map((id) => opacity(page, id)));
    const unit = await text(page, "unit");
    await ctx.close();
    if (chip !== "Italia · 2027") return `chip reads ${chip}`;
    if (stamps.some((o) => o !== "1")) return `stamps ${stamps.join(",")}`;
    if (unit !== "KM") return `unit ${unit}`;
  });

  await check("scroll back", async () => {
    const { ctx, page } = await open(1440, 900);
    await drive(page, 1);
    await drive(page, 0.3);
    const it27 = await opacity(page, "stIt27");
    const bali = await opacity(page, "stBali");
    const unit = await text(page, "unit");
    const fifth = await page.evaluate(() => document.getElementById("tally").children[4].getAttribute("opacity"));
    await drive(page, 0.15);
    const strokes = await page.evaluate(() => [...document.getElementById("tally").children].filter((c) => c.getAttribute("opacity") === "1").length);
    await ctx.close();
    if (it27 !== "0" || bali !== "0") return `stamps still shown after scrolling back: 2027=${it27} bali=${bali}`;
    if (unit !== "KM") return `unit at Italy 2022 reads ${unit}`;
    if (fifth !== "1") return "tally not full after the long-distance stretch";
    if (strokes >= 5) return `tally shows ${strokes} strokes partway through the long-distance stretch`;
  });

  await check("copy fit", async () => {
    const { ctx, page } = await open(1440, 900);
    const over = await page.evaluate(() =>
      [...document.querySelectorAll("#texts foreignObject")]
        .filter((fo) => fo.firstElementChild.scrollHeight > fo.height.baseVal.value)
        .map((fo) => `${fo.firstElementChild.querySelector("h2")?.textContent || "closing"} (${fo.firstElementChild.scrollHeight} > ${fo.height.baseVal.value})`),
    );
    await ctx.close();
    if (over.length) return `text overflows its slot: ${over.join("; ")}`;
  });

  await check("card clears car", async () => {
    const { ctx, page } = await open(390, 600);
    const hits = [];
    for (const p of [0.06, 0.33, 0.42, 0.677, 0.87]) {
      await drive(page, p);
      const car = await carRect(page);
      const card = await page.evaluate(() => {
        const c = document.getElementById("card");
        if (c.hidden) return null;
        const r = c.getBoundingClientRect();
        return { left: r.left, top: r.top, right: r.right, bottom: r.bottom };
      });
      if (car && card && car.left < card.right && car.right > card.left && car.top < card.bottom && car.bottom > card.top) hits.push(p);
    }
    await ctx.close();
    if (hits.length) return `card covers the car at ${hits.join(", ")}`;
  });

  await check("content", async () => {
    const { ctx, page } = await open(1440, 900);
    const body = await page.evaluate(() => document.body.innerText.toLowerCase());
    await ctx.close();
    const banned = ["church", "twice", "moved in", "live together", "living together"].filter((w) => body.includes(w));
    if (banned.length) return `page mentions ${banned.join(", ")}`;
  });

  await check("no overflow", async () => {
    const bad = [];
    for (const w of [390, 768, 1440]) {
      const { ctx, page } = await open(w, 900);
      const sw = await page.evaluate(() => document.documentElement.scrollWidth);
      if (sw > w) bad.push(`${w}px wide page scrolls to ${sw}px`);
      await ctx.close();
    }
    if (bad.length) return bad.join("; ");
  });

  console.log(results.join("\n"));
  if (results.some((r) => r.startsWith("FAIL"))) process.exitCode = 1;
}

await browser.close();
