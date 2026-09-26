import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new'
  });
  
  const results = { issues: [] };
  const page = await browser.newPage();
  
  try {
    const viewports = [
      { width: 360, height: 800 },
      { width: 768, height: 1024 },
      { width: 1440, height: 900 }
    ];

    for (let vp of viewports) {
      await page.setViewport(vp);
      await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
      await new Promise(r => setTimeout(r, 500));

      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });

      if (hasHorizontalScroll) {
        results.issues.push(`Horizontal scroll detected at ${vp.width}px`);
      }
      
      // Test mobile menu at 360px
      if (vp.width === 360) {
        const menuBtn = await page.$('button[aria-label="Toggle menu"]');
        if (menuBtn) {
          await menuBtn.click();
          await new Promise(r => setTimeout(r, 500));
          // ensure no horizontal scroll after menu opens
          const hasScrollMenu = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
          if (hasScrollMenu) results.issues.push('Horizontal scroll when mobile menu open');
        }
      }
    }

  } catch (err) {
    results.issues.push(err.message);
  }

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})();
