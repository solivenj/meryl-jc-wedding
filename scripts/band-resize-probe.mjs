// Dev-only: check the photo band's rendered height across several widths
// to confirm it scales smoothly (viewport-relative) instead of jumping.
import { chromium } from "playwright";

const widths = [768, 1024, 1280, 1440, 1920];
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(3400);
await page.locator("button[aria-label*='open the save the date']").click();
await page.waitForTimeout(1400);

for (const w of widths) {
  await page.setViewportSize({ width: w, height: 900 });
  await page.waitForTimeout(300);
  const h = await page.evaluate(() => {
    const sec = document.querySelectorAll("section")[2];
    return sec ? Math.round(sec.getBoundingClientRect().height) : -1;
  });
  console.log(`width=${w} bandHeight=${h}`);
}
await browser.close();
