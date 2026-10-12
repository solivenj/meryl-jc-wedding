// Dev-only: full-page screenshots of every /italy tab at phone,
// tablet and desktop widths, plus a horizontal-overflow check.
// Usage: node scripts/italy-shot.mjs [baseUrl] [outDir]
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const [base = "http://localhost:3000", outDir = "shots/italy"] = process.argv.slice(2);
// Nav order, then /accommodations — which is not in the nav and only renders
// its real content for a browser that has RSVP'd yes (otherwise you shoot the
// "please reply first" state, which is also worth seeing).
const PAGES = ["", "/schedule", "/travel", "/dress-code", "/faq", "/rsvp", "/accommodations"];
const WIDTHS = [390, 768, 1440];

/* /italy sits behind the password gate (proxy.ts), so each context has
   to unlock before it can load anything. ctx.request shares the context's
   cookie jar, so one POST grants every page opened in it. Skipped silently
   when the var is unset, so the script still works against an ungated build. */
const GATE_PASSWORD = process.env.GATE_PASSWORD_ITALY;

mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
for (const width of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
  if (GATE_PASSWORD) {
    const res = await ctx.request
      .post(`${base}/api/gate`, { data: { password: GATE_PASSWORD } })
      .catch(() => null);
    if (!res?.ok()) console.warn("gate: not unlocked — shots may show the gate page");
  }
  const page = await ctx.newPage();
  for (const p of PAGES) {
    await page.goto(`${base}/italy${p}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    const name = `${p.slice(1) || "home"}-${width}.png`;
    await page.screenshot({ path: `${outDir}/${name}`, fullPage: true });
    console.log(name, overflow > 0 ? `OVERFLOW ${overflow}px` : "ok");
  }
  await ctx.close();
}
await browser.close();
