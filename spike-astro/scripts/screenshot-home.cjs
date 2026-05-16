const path = require('path');
const playwrightDir = 'C:\\Users\\robfoulkrod\\AppData\\Roaming\\npm\\node_modules\\playwright';
const { chromium } = require(playwrightDir);

// Always write screenshots next to the spike-astro/ folder, regardless of cwd.
const OUT = (name) => path.resolve(__dirname, '..', name);

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 990, height: 800 },
    deviceScaleFactor: 1,
    reducedMotion: 'no-preference',
  });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const info = await page.evaluate(() => ({ w: window.innerWidth, h: window.innerHeight }));
  console.log('viewport', info);
  await page.screenshot({ path: OUT('spike-home-real-a.png') });
  await page.waitForTimeout(15000);
  await page.screenshot({ path: OUT('spike-home-real-b.png') });
  await page.waitForTimeout(15000);
  await page.screenshot({ path: OUT('spike-home-real-c.png') });
  await browser.close();
  console.log('done', OUT('spike-home-real-a.png'));
})().catch(e => { console.error(e); process.exit(1); });
