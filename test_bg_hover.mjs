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
    await new Promise(r => setTimeout(r, 1000));

    // Helper to get opacity of the background element
    const getBgOpacity = async () => {
      return page.evaluate(() => {
        const bg = Array.from(document.querySelectorAll('div')).find(el => el.className.includes('fixed top-0 left-0 pointer-events-none z-[40]'));
        if (!bg) return null;
        return window.getComputedStyle(bg).opacity;
      });
    };

    // Hover over H1 in Hero (content area)
    await page.hover('h1');
    await new Promise(r => setTimeout(r, 600)); // allow fade transition
    let opacity = await getBgOpacity();
    results.steps.push(`Opacity when hovering H1: ${opacity}`);

    // Hover over empty space in Hero
    // The hero is #home. It has padding left and right.
    // Let's hover far right of the screen in the Hero section
    await page.mouse.move(1300, 200);
    await new Promise(r => setTimeout(r, 600));
    opacity = await getBgOpacity();
    results.steps.push(`Opacity when hovering empty space right of Hero: ${opacity}`);

    // Hover over Course grid wrapper empty space
    await page.mouse.move(1300, 600); // Might be in course grid depending on scroll
    await new Promise(r => setTimeout(r, 600));
    opacity = await getBgOpacity();
    results.steps.push(`Opacity when hovering empty space in Grid: ${opacity}`);
    
    // Hover over a specific course card
    const card = await page.$('h3'); // Course title inside card
    if (card) {
      await card.hover();
      await new Promise(r => setTimeout(r, 600));
      opacity = await getBgOpacity();
      results.steps.push(`Opacity when hovering Course Card: ${opacity}`);
    }

    // Hover over Navbar logo
    const logo = await page.$('nav span');
    if (logo) {
      await logo.hover();
      await new Promise(r => setTimeout(r, 600));
      opacity = await getBgOpacity();
      results.steps.push(`Opacity when hovering Navbar: ${opacity}`);
    }

  } catch (err) {
    results.errors.push(err.message);
  }

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})();
