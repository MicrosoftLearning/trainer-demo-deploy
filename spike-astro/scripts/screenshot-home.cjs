const path = require('path');
const playwrightDir = 'C:\\Users\\robfoulkrod\\AppData\\Roaming\\npm\\node_modules\\playwright';
const { chromium } = require(playwrightDir);

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 990, height: 800 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const info = await page.evaluate(() => ({ w: window.innerWidth, h: window.innerHeight }));
  console.log('viewport', info);
  await page.screenshot({ path: 'spike-home-real-a.png' });
  await page.waitForTimeout(15000);
  await page.screenshot({ path: 'spike-home-real-b.png' });
  await page.waitForTimeout(15000);
  await page.screenshot({ path: 'spike-home-real-c.png' });
  await browser.close();
  console.log('done');
})().catch(e => { console.error(e); process.exit(1); });
