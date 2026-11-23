const { chromium } = require('@playwright/test');
const fs = require('fs');

async function verifyAndCaptureAfterScreenshots() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  fs.mkdirSync('public/snapshots/comparisons/layout', { recursive: true });

  const routes = [
    { name: 'home', path: '/' },
    { name: 'radar', path: '/radar' },
    { name: 'pulse', path: '/pulse' },
    { name: 'tracker', path: '/tracker' },
    { name: 'passport', path: '/passport' },
  ];

  const widths = [1280, 1440, 1920];

  console.log('--- VERIFYING VIEWPORT OFFSETS ---');
  for (const w of widths) {
    for (const r of routes) {
      const page = await browser.newPage({ viewport: { width: w, height: 900 } });
      await page.goto('http://127.0.0.1:3001' + r.path, { waitUntil: 'networkidle' });
      await page.evaluate(() => window.scrollTo(0, 0));

      const metrics = await page.evaluate((vpWidth) => {
        const header = document.querySelector('header');
        const aside = document.querySelector('aside');
        const h1 = document.querySelector('h1');
        return {
          headerTop: header ? Math.round(header.getBoundingClientRect().top) : null,
          asideTop: aside ? Math.round(aside.getBoundingClientRect().top) : null,
          h1Top: h1 ? Math.round(h1.getBoundingClientRect().top) : null,
          docWidth: document.documentElement.scrollWidth,
          vpWidth,
          overflow: document.documentElement.scrollWidth > vpWidth,
        };
      }, w);

      console.log(`[${w}px] Route ${r.name}: headerTop=${metrics.headerTop}, asideTop=${metrics.asideTop}, h1Top=${metrics.h1Top}, overflow=${metrics.overflow}`);
      await page.close();
    }
  }

  console.log('\n--- CAPTURING AFTER SCREENSHOTS SCROLLED TO TOP ---');
  for (const r of routes) {
    // Light
    const pageLight = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await pageLight.goto('http://127.0.0.1:3001' + r.path, { waitUntil: 'networkidle' });
    await pageLight.evaluate(() => window.scrollTo(0, 0));
    await pageLight.screenshot({ path: `public/snapshots/comparisons/layout/${r.name}-after-light.png` });
    await pageLight.close();

    // Dark
    const pageDark = await browser.newPage({ viewport: { width: 1280, height: 900 }, colorScheme: 'dark' });
    await pageDark.goto('http://127.0.0.1:3001' + r.path, { waitUntil: 'networkidle' });
    await pageDark.evaluate(() => {
      document.documentElement.classList.add('dark');
      window.scrollTo(0, 0);
    });
    await pageDark.screenshot({ path: `public/snapshots/comparisons/layout/${r.name}-after-dark.png` });
    await pageDark.close();

    console.log(`Captured after screenshots for ${r.name} (light & dark).`);
  }

  await browser.close();
  console.log('Verification & screenshot capture complete!');
}

verifyAndCaptureAfterScreenshots().catch(console.error);
