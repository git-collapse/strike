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

    // Clear localStorage to ensure fresh timer
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle2' });

    // Open offer panel
    let robot = await page.$('img[alt="Floating Assistant Robot"]');
    await robot.click();
    await new Promise(r => setTimeout(r, 500));

    // Get time from ANY .tracking-widest element that contains colons
    const timeBefore = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll('.font-mono'));
      const timerEl = els.find(el => el.textContent.includes(':'));
      return timerEl ? timerEl.textContent.trim() : null;
    });
    results.steps.push(`Time before refresh: ${timeBefore}`);

    // Refresh page
    await page.reload({ waitUntil: 'networkidle2' });
    robot = await page.$('img[alt="Floating Assistant Robot"]');
    await robot.click();
    await new Promise(r => setTimeout(r, 500));
    
    const timeAfter = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll('.font-mono'));
      const timerEl = els.find(el => el.textContent.includes(':'));
      return timerEl ? timerEl.textContent.trim() : null;
    });
    results.steps.push(`Time after refresh: ${timeAfter}`);

    // Test expiry
    await page.evaluate(() => {
      localStorage.setItem('strike_sale_end', (Date.now() - 5000).toString());
    });
    
    await page.reload({ waitUntil: 'networkidle2' });
    robot = await page.$('img[alt="Floating Assistant Robot"]');
    await robot.click();
    await new Promise(r => setTimeout(r, 500));

    const allText = await page.evaluate(() => document.body.textContent.toUpperCase());
    
    results.steps.push(`Expiry text present: ${allText.includes('DEVELOPER GRANT EXPIRED')}`);
    results.steps.push(`CTA Disabled: ${allText.includes('GRANT UNAVAILABLE')}`);
    
    const couponStrikethrough = await page.evaluate(() => !!document.querySelector('.line-through'));
    results.steps.push(`Coupon disabled: ${couponStrikethrough}`);

  } catch (err) {
    results.errors.push(err.message);
  }

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})();
