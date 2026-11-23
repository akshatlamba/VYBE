const { chromium } = require('@playwright/test');
const fs = require('fs');

async function auditHomeLiquid() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  fs.mkdirSync('public/snapshots/audit-liquid', { recursive: true });

  const viewports = [
    { name: 'mobile-390', width: 390, height: 844 },
    { name: 'tablet-820', width: 820, height: 1180 },
    { name: 'desktop-1280', width: 1280, height: 900 },
    { name: 'desktop-1440', width: 1440, height: 900 },
    { name: 'desktop-1920', width: 1920, height: 1080 },
  ];

  for (const vp of viewports) {
    // Light Mode
    const pageLight = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await pageLight.goto('http://127.0.0.1:3001/', { waitUntil: 'networkidle' });
    
    // Check right edges
    const metricsLight = await pageLight.evaluate((vpWidth) => {
      const docWidth = document.documentElement.scrollWidth;
      const plusBtn = document.querySelector("button[title='Quick Add Action']");
      const askPulse = document.querySelector("a[href='/pulse']");
      const progressCard = document.querySelector(".dark-liquid-glass");
      
      const getRight = (el) => el ? el.getBoundingClientRect().right : null;
      
      return {
        hasHorizontalScroll: docWidth > vpWidth,
        plusBtnRight: getRight(plusBtn),
        askPulseRight: getRight(askPulse),
        progressCardRight: getRight(progressCard),
        viewportWidth: vpWidth,
      };
    }, vp.width);

    await pageLight.screenshot({ path: `public/snapshots/audit-liquid/home-${vp.name}-light.png` });
    await pageLight.close();

    // Dark Mode
    const pageDark = await browser.newPage({ viewport: { width: vp.width, height: vp.height }, colorScheme: 'dark' });
    await pageDark.goto('http://127.0.0.1:3001/', { waitUntil: 'networkidle' });
    await pageDark.evaluate(() => document.documentElement.classList.add('dark'));

    const metricsDark = await pageDark.evaluate((vpWidth) => {
      const docWidth = document.documentElement.scrollWidth;
      return {
        hasHorizontalScroll: docWidth > vpWidth,
      };
    }, vp.width);

    await pageDark.screenshot({ path: `public/snapshots/audit-liquid/home-${vp.name}-dark.png` });
    await pageDark.close();

    console.log(`Viewport ${vp.name}:`, {
      lightScroll: metricsLight.hasHorizontalScroll,
      plusBtnMarginRight: metricsLight.plusBtnRight ? (vp.width - metricsLight.plusBtnRight) : null,
      askPulseMarginRight: metricsLight.askPulseRight ? (vp.width - metricsLight.askPulseRight) : null,
      progressCardMarginRight: metricsLight.progressCardRight ? (vp.width - metricsLight.progressCardRight) : null,
      darkScroll: metricsDark.hasHorizontalScroll,
    });
  }

  await browser.close();
  console.log('Home liquid glass visual audit completed successfully.');
}

auditHomeLiquid().catch(console.error);
