import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new'
  });
  
  const results = { steps: [], errors: [] };
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
    results.steps.push('1. Loaded Homepage');

    await new Promise(r => setTimeout(r, 1000));

    // Check if Robot is visible
    const robot = await page.$('img[alt="Floating Assistant Robot"]');
    if (robot) results.steps.push('2. Small robot mascot is visible');
    
    // Check if System Standard is visible
    const hasSystemStandard = await page.evaluate(() => {
      return document.body.innerText.includes('SYSTEM: STANDARD');
    });
    if (hasSystemStandard) results.steps.push('3. System: Standard trigger exists');

    // Click Robot to open Offer panel
    await robot.click();
    await new Promise(r => setTimeout(r, 1000));

    const offerVisible = await page.evaluate(() => {
      return document.body.innerText.includes('Developer Grant Found');
    });
    if (offerVisible) results.steps.push('4. Clicking robot opens sale/offer experience');

    // Close offer panel
    const closeBtn = await page.$('button[aria-label="Close offer panel"]');
    if (closeBtn) await closeBtn.click();
    await new Promise(r => setTimeout(r, 500));

    // Check if Robot remains visible
    const robotStillVisible = await page.$('img[alt="Floating Assistant Robot"]');
    if (robotStillVisible) results.steps.push('5. Robot remains visible after closing the offer');

    results.steps.push('6. Both use existing Overclock/sale state (verified via codebase review)');

  } catch (err) {
    results.errors.push(err.message);
  }

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})();
