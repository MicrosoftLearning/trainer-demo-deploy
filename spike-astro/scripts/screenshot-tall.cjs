const playwrightDir = 'C:\\Users\\robfoulkrod\\AppData\\Roaming\\npm\\node_modules\\playwright';
const { chromium } = require(playwrightDir);
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 990, height: 1200 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'spike-home-full.png' });
  await browser.close();
})();
