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

    // Click Robot to open Offer panel
    const robot = await page.$('img[alt="Floating Assistant Robot"]');
    await robot.click();
    await new Promise(r => setTimeout(r, 500));

    // Get current timer
    const timeBefore = await page.evaluate(() => {
      const timer = document.querySelector('.text-white.font-mono.text-lg.font-bold.tracking-widest');
      return timer ? timer.innerText : null;
    });
    results.steps.push(`2. Time before refresh: ${timeBefore}`);

    // Refresh page
    await page.reload({ waitUntil: 'networkidle2' });
    
    // Open panel again
    const robot2 = await page.$('img[alt="Floating Assistant Robot"]');
    await robot2.click();
    await new Promise(r => setTimeout(r, 500));
    
    const timeAfter = await page.evaluate(() => {
      const timer = document.querySelector('.text-white.font-mono.text-lg.font-bold.tracking-widest');
      return timer ? timer.innerText : null;
    });
    results.steps.push(`3. Time after refresh: ${timeAfter}`);

    // Now test expiry by manually setting localStorage
    await page.evaluate(() => {
      localStorage.setItem('strike_sale_end', (Date.now() - 5000).toString());
    });
    
    await page.reload({ waitUntil: 'networkidle2' });
    const robot3 = await page.$('img[alt="Floating Assistant Robot"]');
    await robot3.click();
    await new Promise(r => setTimeout(r, 500));

    const isExpired = await page.evaluate(() => {
      return document.body.innerText.includes('Developer Grant Expired');
    });
    results.steps.push(`4. Expiry text present: ${isExpired}`);

    const ctaDisabled = await page.evaluate(() => {
      const btn = document.querySelector('button.cursor-not-allowed');
      return !!btn && btn.innerText.includes('Grant Unavailable');
    });
    results.steps.push(`5. CTA Disabled: ${ctaDisabled}`);

    const couponStrikethrough = await page.evaluate(() => {
      return !!document.querySelector('.line-through');
    });
    results.steps.push(`6. Coupon disabled: ${couponStrikethrough}`);

  } catch (err) {
    results.errors.push(err.message);
  }

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})();
