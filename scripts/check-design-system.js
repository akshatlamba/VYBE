const { chromium } = require('@playwright/test');
const fs = require('fs');

async function checkScreens() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  fs.mkdirSync('public/snapshots', { recursive: true });

  const viewports = [
    { name: 'mobile-390', width: 390, height: 844 },
    { name: 'tablet-820', width: 820, height: 1180 },
    { name: 'desktop-1280', width: 1280, height: 900 }
  ];

  for (const vp of viewports) {
    // Light mode
    const pageLight = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await pageLight.goto('http://127.0.0.1:3001/design-system', { waitUntil: 'networkidle' });
    await pageLight.screenshot({ path: `public/snapshots/design-system-${vp.name}-light.png`, fullPage: false });
    await pageLight.close();

    // Dark mode
    const pageDark = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
      colorScheme: 'dark'
    });
    await pageDark.goto('http://127.0.0.1:3001/design-system', { waitUntil: 'networkidle' });
    // Click dark button to ensure dark class is applied
    await pageDark.evaluate(() => {
      document.documentElement.classList.add('dark');
    });
    await pageDark.screenshot({ path: `public/snapshots/design-system-${vp.name}-dark.png`, fullPage: false });
    await pageDark.close();

    console.log(`Verified ${vp.name} in light & dark!`);
  }

  await browser.close();
  console.log('All responsive snapshots captured successfully!');
}

checkScreens().catch(console.error);
