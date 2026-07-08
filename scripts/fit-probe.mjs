// Dev-only: report whether Act I overflows the viewport at several sizes.
import { chromium } from "playwright";

const sizes = [
  [375, 667], // small phone (older iPhone SE height)
  [375, 812], // iPhone X-class
  [390, 844], // iPhone 14
  [768, 1024], // tablet portrait
  [1440, 900], // laptop
  [1440, 720], // short laptop
];
const browser = await chromium.launch();
for (const [w, h] of sizes) {
  const page = await (await browser.newContext({ viewport: { width: w, height: h } })).newPage();
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(3200);
  const m = await page.evaluate(() => {
    const sec = document.querySelector("section");
    return {
      docScroll: document.documentElement.scrollHeight,
      inner: window.innerHeight,
      secH: sec ? Math.round(sec.getBoundingClientRect().height) : -1,
      overflow: document.documentElement.scrollHeight > window.innerHeight + 1,
    };
  });
  console.log(`${w}x${h}  section=${m.secH}  doc=${m.docScroll}  vh=${m.inner}  OVERFLOW=${m.overflow}`);
  await page.close();
}
await browser.close();
