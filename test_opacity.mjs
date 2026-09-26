import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new'
  });
  
  const results = { steps: [], errors: [] };
  const page = await browser.newPage();
  
  try {
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
    
    // Scroll to courses
    await page.evaluate(() => {
      document.getElementById('courses').scrollIntoView();
    });
    await new Promise(r => setTimeout(r, 1000));
    
    const checkFirstCardOpacity = async () => {
      return await page.evaluate(() => {
        const grid = document.querySelector('#courses .grid');
        if (!grid || !grid.firstElementChild) return null;
        return window.getComputedStyle(grid.firstElementChild).opacity;
      });
    };

    results.steps.push(`Initial opacity: ${await checkFirstCardOpacity()}`);

    // Click 'Free Courses'
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Free Courses'));
      if (btn) btn.click();
    });
    
    // Wait for animation to finish
    await new Promise(r => setTimeout(r, 1000));
    results.steps.push(`Opacity after clicking Free: ${await checkFirstCardOpacity()}`);

    // Click 'Upcoming Courses'
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Upcoming Courses'));
      if (btn) btn.click();
    });
    
    await new Promise(r => setTimeout(r, 1000));
    results.steps.push(`Opacity after clicking Upcoming: ${await checkFirstCardOpacity()}`);

  } catch (err) {
    results.errors.push(err.message);
  }

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})();
