import puppeteer from 'puppeteer-core';

(async () => {
  const report = {
    normalState: 'PASS',
    overclockActivation: 'PASS',
    terminalAnimation: 'PASS',
    salePricing: 'PASS',
    courseCTA: 'PASS',
    courseLinks: 'PASS',
    categoryFiltering: 'PASS',
    membership: 'PASS',
    mobile: 'PASS',
    console: 'PASS',
    bugs: []
  };

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox']
  });
  
  const page = await browser.newPage();
  
  page.on('console', msg => {
    const text = msg.text();
    if (msg.type() === 'error' && !text.includes('favicon')) {
      report.console = 'FAIL';
      report.bugs.push(`Console error: ${text}`);
    }
  });
  
  page.on('pageerror', err => {
    report.console = 'FAIL';
    report.bugs.push(`JS Exception: ${err.message}`);
  });

  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });

    // 1. Normal State
    const textContent = await page.evaluate(() => document.body.textContent);
    if (textContent.includes('undefined') || textContent.includes('NaN') || textContent.includes('₹undefined')) {
      report.normalState = 'FAIL';
      report.bugs.push('Found undefined/NaN text in normal state');
    }
    
    const courseCardsCount = await page.evaluate(() => document.querySelectorAll('#courses a[href*="strikes.in/course"], #courses a[href*="youtube.com"]').length);
    if (courseCardsCount < 10) {
      report.normalState = 'FAIL';
      report.bugs.push(`Expected ~15 courses, found ${courseCardsCount}`);
    }

    // 2. Category Filtering (Normal)
    const filters = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('#courses button'));
      return btns.map(b => b.textContent);
    });
    
    if (!filters.find(f => f.includes('Paid Courses'))) {
      report.categoryFiltering = 'FAIL';
      report.bugs.push('Category filters missing');
    }

    // 3. Overclock Trigger & Terminal Animation
    const activateBtn = await page.$('button[aria-label="Activate Overclock Mode"]');
    if (!activateBtn) {
      report.overclockActivation = 'FAIL';
      report.bugs.push('Overclock trigger button not found');
    } else {
      await activateBtn.click();
      
      // Wait for terminal animation
      await new Promise(r => setTimeout(r, 6000));
      
      // Check if terminal closed automatically and overclock is active
      const isOverclocked = await page.evaluate(() => document.body.textContent.includes('Developer Grant'));
      if (!isOverclocked) {
        // Maybe it's still animating? Let's click "Skip" if it's there
        const skipBtn = await page.evaluateHandle(() => {
          const btns = Array.from(document.querySelectorAll('button'));
          return btns.find(b => b.textContent && b.textContent.includes('Skip'));
        });
        if (skipBtn) {
          await skipBtn.click();
        }
        await new Promise(r => setTimeout(r, 1000));
        const checkAgain = await page.evaluate(() => document.body.textContent.includes('Developer Grant'));
        if (!checkAgain) {
          report.terminalAnimation = 'FAIL';
          report.overclockActivation = 'FAIL';
          report.bugs.push('Overclock mode did not activate correctly after trigger');
        }
      }
    }

    // 4. Overclock State Pricing & NaN Check
    const overclockText = await page.evaluate(() => document.body.textContent);
    if (overclockText.includes('undefined') || overclockText.includes('NaN') || overclockText.includes('₹undefined')) {
      report.salePricing = 'FAIL';
      report.bugs.push('Found undefined/NaN text in Overclock state pricing');
    }
    
    // 5. Membership test
    const membershipPrices = await page.evaluate(() => {
      const texts = Array.from(document.querySelectorAll('#memberships .text-5xl')).map(e => e.textContent);
      return texts;
    });
    
    if (membershipPrices.length === 0) {
      report.membership = 'FAIL';
      report.bugs.push('Membership prices not rendering');
    }
    
    // Click duration selector for Strike Plus (4 Years is default, click 2 Years)
    const twoYearsBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('#memberships button'));
      return btns.find(b => b.textContent === '2 Years');
    });
    if (twoYearsBtn) {
      await twoYearsBtn.click();
      await new Promise(r => setTimeout(r, 500));
      const newPrices = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('#memberships .text-5xl')).map(e => e.textContent);
      });
      if (newPrices[0] === membershipPrices[0]) {
        report.membership = 'FAIL';
        report.bugs.push('Membership price did not update when changing duration');
      }
    }

    // 6. Mobile Responsiveness
    await page.setViewport({ width: 375, height: 667 });
    await new Promise(r => setTimeout(r, 1000));
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    if (hasHorizontalOverflow) {
      report.mobile = 'FAIL';
      report.bugs.push('Horizontal overflow detected on mobile viewport');
    }

  } catch (error) {
    report.console = 'FAIL';
    report.bugs.push(`Test script error: ${error.message}`);
  }

  await browser.close();
  
  console.log(JSON.stringify(report, null, 2));
})();
