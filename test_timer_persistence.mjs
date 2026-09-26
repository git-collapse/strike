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

    // Open offer panel
    let robot = await page.$('img[alt="Floating Assistant Robot"]');
    await robot.click();
    await new Promise(r => setTimeout(r, 500));

    const timeBefore = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll('.font-mono'));
      const timerEl = els.find(el => el.textContent.includes(':') && !el.textContent.includes('Standard'));
      return timerEl ? timerEl.textContent.trim() : null;
    });
    results.steps.push(`Time before refresh: ${timeBefore.replace(/\n|\s+/g, ' ')}`);

    // wait 2 seconds
    await new Promise(r => setTimeout(r, 2000));
    
    // Refresh page
    await page.reload({ waitUntil: 'networkidle2' });
    robot = await page.$('img[alt="Floating Assistant Robot"]');
    await robot.click();
    await new Promise(r => setTimeout(r, 500));
    
    const timeAfter = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll('.font-mono'));
      const timerEl = els.find(el => el.textContent.includes(':') && !el.textContent.includes('Standard'));
      return timerEl ? timerEl.textContent.trim() : null;
    });
    results.steps.push(`Time after refresh (waited 2s): ${timeAfter.replace(/\n|\s+/g, ' ')}`);

    // Click System Standard pill to see if it opens the panel when not expired (it should open terminal)
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('System: Standard'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 500));
    const terminalOpen = await page.evaluate(() => document.body.textContent.includes('Connecting to STRIKE'));
    results.steps.push(`Terminal open: ${terminalOpen}`);

  } catch (err) {
    results.errors.push(err.message);
  }

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})();
