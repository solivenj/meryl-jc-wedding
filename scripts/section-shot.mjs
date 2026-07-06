// Dev-only: open the envelope, scroll a given section into view, screenshot it.
// Usage: node scripts/section-shot.mjs <out.png> <sectionIndex>
import { chromium } from "playwright";

const [out, idx = "2"] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(3400);
await page.locator("button[aria-label*='open the save the date']").click();
await page.waitForTimeout(3200);
const section = page.locator("section").nth(Number(idx));
await section.scrollIntoViewIfNeeded();
await page.waitForTimeout(2600);
await section.screenshot({ path: out });
await browser.close();
console.log("saved", out);
