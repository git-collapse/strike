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
    
    const countCards = async () => {
      return await page.evaluate(() => {
        // Course cards have 'CourseCard' component or just count headers inside the grid
        const grid = document.querySelector('#courses .grid');
        if (!grid) return 0;
        // Count the children of the grid
        return grid.children.length;
      });
    };

    results.steps.push(`Initial (All) courses count: ${await countCards()}`);

    // Click 'Free Courses'
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Free Courses'));
      if (btn) btn.click();
    });
    
    // Wait for animation to finish
    await new Promise(r => setTimeout(r, 1000));
    results.steps.push(`After clicking Free: ${await countCards()}`);

    // Click 'Upcoming Courses'
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Upcoming Courses'));
      if (btn) btn.click();
    });
    
    // Wait for animation
    await new Promise(r => setTimeout(r, 1000));
    results.steps.push(`After clicking Upcoming: ${await countCards()}`);

    // Click 'Paid Courses'
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Paid Courses'));
      if (btn) btn.click();
    });
    
    // Wait for animation
    await new Promise(r => setTimeout(r, 1000));
    results.steps.push(`After clicking Paid: ${await countCards()}`);

  } catch (err) {
    results.errors.push(err.message);
  }

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})();
