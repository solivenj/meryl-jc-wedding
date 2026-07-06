// Dev-only probe: inspect computed state of story/closing text after scroll.
import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
const errors = [];
page.on("console", (m) => {
  if (m.type() === "error" || m.type() === "warning") errors.push(m.text().slice(0, 300));
});
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(3400);
await page.locator("button[aria-label='Open the save the date']").click();
await page.waitForTimeout(3200);
const total = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y <= total; y += 630) {
  await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
  await page.waitForTimeout(600);
}
await page.waitForTimeout(1000);
const report = await page.evaluate(() => {
  const out = [];
  document.querySelectorAll("section").forEach((sec, si) => {
    sec.querySelectorAll("p, h2").forEach((el) => {
      const cs = getComputedStyle(el);
      const text = (el.textContent ?? "").trim().slice(0, 40);
      if (!text) return;
      out.push(
        `s${si} <${el.tagName}> "${text}" opacity=${cs.opacity} transform=${cs.transform} display=${cs.display} h=${el.getBoundingClientRect().height}`
      );
    });
  });
  return out;
});
console.log(report.join("\n"));
console.log("--- console issues ---");
console.log(errors.join("\n") || "(none)");
await browser.close();
