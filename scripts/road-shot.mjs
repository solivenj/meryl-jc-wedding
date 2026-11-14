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
import { chapterStart, textOnAt } from "../components/italy/road/route.ts";

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
  /* The glide eases in over ~1.5 s at 60 fps; a busy dev server needs longer. */
  await page.waitForTimeout(3000);
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
    /* Italy 2027, the crossing: every passport stamp down by now. The odometer
       reads miles throughout. */
    await drive(page, chapterStart(8) - 0.003);
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForTimeout(1600);
    const chip = await text(page, "chip");
    const stamps = await Promise.all(["stIt22", "stMini0", "stMini1", "stMini2", "stMini3", "stMini4", "stIt27"].map((id) => opacity(page, id)));
    const unit = await text(page, "unit");
    await ctx.close();
    if (chip !== "Italia · 2027") return `chip reads ${chip}`;
    if (stamps.some((o) => o !== "1")) return `stamps ${stamps.join(",")}`;
    if (unit !== "MI") return `unit ${unit}`;
  });

  await check("scroll back", async () => {
    const { ctx, page } = await open(1440, 900);
    /* To the end, then back to Italy 2022, half way up the drawing: later
       stamps go again and the Vespa is the vehicle showing. */
    await drive(page, 1);
    await drive(page, chapterStart(3) - 0.25 * (chapterStart(3) - chapterStart(2)));
    const it27 = await opacity(page, "stIt27");
    const mini = await opacity(page, "stMini0");
    const it22 = await opacity(page, "stIt22");
    const shown = await page.evaluate(() =>
      [...document.querySelectorAll("#vehicles > g")].filter((g) => g.getAttribute("opacity") === "1").map((g) => g.querySelector("use")?.getAttribute("href")),
    );
    await ctx.close();
    if (it27 !== "0" || mini !== "0") return `stamps still shown after scrolling back: 2027=${it27} first mini stop=${mini}`;
    if (it22 !== "1") return `Italy 2022 stamp missing: ${it22}`;
    if (shown.join() !== "#vespaRear") return `vehicle showing in the drawing: ${shown.join() || "none"}`;
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
    /* every stop dot lands at chapterStart + .002; plus a few mid-stretch moments */
    for (const p of [...Array.from({ length: 10 }, (_, c) => chapterStart(c) + 0.002), 0.06, 0.33, 0.42, 0.677, 0.87]) {
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
    if (hits.length) return `card covers the car at ${hits.map((h) => h.toFixed(3)).join(", ")}`;
  });

  await check("no ending flash before the script runs", async () => {
    // Block the page's JS so the server HTML stays as it first paints.
    const ctx = await context(browser, 390, 600);
    await ctx.route(/\/_next\/static\/chunks\/.*\.js/, (r) => r.abort());
    const page = await ctx.newPage();
    await page.goto(PAGE, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(800);
    const shown = await page.evaluate(() =>
      ["#world", ".hud-sign", ".odo", ".stops"].filter((s) => getComputedStyle(document.querySelector(s)).visibility !== "hidden"),
    );
    await ctx.close();
    if (shown.length) return `visible before the drive is ready: ${shown.join(", ")}`;
  });

  await check("motion toggles cleanly", async () => {
    const ctx = await context(browser, 1440, 900);
    const page = await ctx.newPage();
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(PAGE, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    const counts = () =>
      page.evaluate(() => ({
        digits: document.querySelectorAll("#digits > .d").length,
        stops: document.querySelectorAll("#stops button").length,
        vehicles: document.querySelectorAll("#vehicles > g").length,
        ready: document.querySelector(".road-trip").classList.contains("road-ready"),
      }));
    for (const mode of ["no-preference", "reduce", "no-preference"]) {
      await page.emulateMedia({ reducedMotion: mode });
      await page.waitForTimeout(400);
    }
    await drive(page, chapterStart(3) + 0.01);
    const c = await counts();
    const chip = await text(page, "chip");
    await ctx.close();
    if (!c.ready) return "drive never started after motion was turned back on";
    if (c.digits !== 5 || c.stops !== 10 || c.vehicles !== 8) return `duplicated or missing DOM: ${JSON.stringify(c)}`;
    if (chip !== "Chicago") return `drive not running: chip reads ${chip}`;
  });

  /* Once a stop's words are in they stay as the car drives on; a later
     stop's words never show early. */
  await check("a stop's words show at it, and no later stop's", async () => {
    const { ctx, page } = await open(1440, 900);
    const wrong = [];
    for (const ch of [0, 2, 6]) {
      await drive(page, textOnAt(ch + 1) - 0.003);
      const seen = await page.evaluate(() =>
        [...document.querySelectorAll("#texts .wt")]
          .filter((w) => !w.classList.contains("title"))
          .map((w) => ({ ch: w.dataset.ch, shown: getComputedStyle(w.firstElementChild).opacity === "1" })),
      );
      for (const s of seen) {
        const first = Math.min(...s.ch.split(",").map(Number));
        if (first > ch && s.shown) wrong.push(`at stop ${ch}, later slot ${s.ch} shown`);
        if (s.ch.split(",").includes(String(ch)) && !s.shown) wrong.push(`at stop ${ch}, its own slot hidden`);
      }
    }
    await ctx.close();
    if (wrong.length) return wrong.join("; ");
  });

  await check("stop text is fully on screen when it comes in", async () => {
    // Sample each stop from just before its words are due until just after
    // the stop begins, on short and tall windows. Shown text must never be
    // cut off at the top or bottom of the screen.
    const bad = [];
    for (const [w, h] of [[1440, 640], [1600, 700], [1920, 950]]) {
      const { ctx, page } = await open(w, h);
      for (const ch of [1, 2, 3, 6, 7, 8]) {
        /* Only the newest words count, at the sample where they first show:
           once in, they may scroll off as the car climbs. */
        let prev = null;
        for (const p of [textOnAt(ch) + 0.002, textOnAt(ch) + 0.01, chapterStart(ch) + 0.004, chapterStart(ch) + 0.015]) {
          await drive(page, p);
          const r = await page.evaluate(() => {
            const first = (w) => Math.min(...w.dataset.ch.split(",").map(Number));
            const w = [...document.querySelectorAll("#texts .wt.on:not(.title)")].sort((a, b) => first(b) - first(a))[0];
            if (!w) return null;
            /* Measure the SVG box (its rect includes the camera), and scale the
               text's own height into screen pixels. */
            const fo = w.parentNode, b = fo.getBoundingClientRect(), s = document.getElementById("stage").getBoundingClientRect();
            const k = b.height / fo.height.baseVal.value;
            return { ch: w.dataset.ch, top: b.top - s.top, bottom: b.top - s.top + w.offsetHeight * k, h: s.height };
          });
          const mine = r && r.ch.split(",").includes(String(ch));
          const fresh = mine && r.ch !== prev;
          if (mine) prev = r.ch;
          if (fresh && (r.top < 0 || r.bottom > r.h + 40)) bad.push(`${w}x${h} at ${p.toFixed(3)} stop ${r.ch}: ${Math.round(r.top)}-${Math.round(r.bottom)} of ${Math.round(r.h)}`);
        }
      }
      await ctx.close();
    }
    if (bad.length) return bad.join("; ");
  });

  await check("script swashes are not clipped", async () => {
    const { ctx, page } = await open(1440, 900);
    const clipped = await page.evaluate(() => [...document.querySelectorAll("#texts foreignObject")].filter((fo) => getComputedStyle(fo).overflow !== "visible").length);
    await ctx.close();
    if (clipped) return `${clipped} text boxes clip their contents`;
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
