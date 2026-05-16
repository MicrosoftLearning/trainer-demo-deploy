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
  // Frames span ~115s so the carousel rotates Azure → Copilot Studio → Stress.
  const frames = [
    { name: 'a-azure-start',  waitAfter: 500   },
    { name: 'b-azure-mid',    waitAfter: 15000 },
    { name: 'c-azure-end',    waitAfter: 12000 },
    { name: 'd-cps-start',    waitAfter: 6000  },
    { name: 'e-cps-mid',      waitAfter: 18000 },
    { name: 'f-cps-end',      waitAfter: 14000 },
    { name: 'g-stress-start', waitAfter: 6000  },
    { name: 'h-stress-mid',   waitAfter: 18000 },
    { name: 'i-stress-end',   waitAfter: 15000 },
  ];
  for (let i = 0; i < frames.length; i++) {
    if (i > 0) await page.waitForTimeout(frames[i].waitAfter);
    const out = OUT(`spike-home-real-${frames[i].name}.png`);
    await page.screenshot({ path: out });
    console.log('saved', frames[i].name);
  }
  await browser.close();
  console.log('done');
})().catch(e => { console.error(e); process.exit(1); });
