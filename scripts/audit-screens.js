const { chromium } = require('@playwright/test');
const fs = require('fs');

async function auditAllScreens() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  fs.mkdirSync('public/snapshots/audit', { recursive: true });

  const routes = [
    { name: 'home', path: '/' },
    { name: 'radar', path: '/radar' },
    { name: 'detail', path: '/radar/opp-001' },
    { name: 'pulse', path: '/pulse' },
    { name: 'tracker', path: '/tracker' },
    { name: 'passport', path: '/passport' },
    { name: 'institution', path: '/institution' },
    { name: 'admin', path: '/admin' },
  ];

  const devices = [
    { name: 'mobile-390', width: 390, height: 844 },
    { name: 'tablet-820', width: 820, height: 1180 },
    { name: 'desktop-1280', width: 1280, height: 900 },
  ];

  for (const route of routes) {
    for (const dev of devices) {
      // Light Mode
      const page = await browser.newPage({ viewport: { width: dev.width, height: dev.height } });
      await page.goto(`http://127.0.0.1:3001${route.path}`, { waitUntil: 'networkidle' });
      await page.screenshot({ path: `public/snapshots/audit/${route.name}-${dev.name}-light.png`, fullPage: false });
      await page.close();

      // Dark Mode
      const pageDark = await browser.newPage({
        viewport: { width: dev.width, height: dev.height },
        colorScheme: 'dark',
      });
      await pageDark.goto(`http://127.0.0.1:3001${route.path}`, { waitUntil: 'networkidle' });
      await pageDark.evaluate(() => document.documentElement.classList.add('dark'));
      await pageDark.screenshot({ path: `public/snapshots/audit/${route.name}-${dev.name}-dark.png`, fullPage: false });
      await pageDark.close();
    }
    console.log(`Audited route ${route.name} across 390px, 820px, 1280px in light & dark.`);
  }

  await browser.close();
  console.log('Visual audit complete for all screens!');
}

auditAllScreens().catch(console.error);
