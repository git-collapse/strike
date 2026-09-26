import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new'
  });
  
  const results = { steps: [], errors: [] };
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') results.errors.push(msg.text());
  });

  try {
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
    results.steps.push('Loaded Homepage');

    // Hover Mascot
    await page.hover('[aria-label="Interactive Hero Mascot - Click to reveal Developer Grant"]');
    await new Promise(r => setTimeout(r, 1000));
    
    // Check Speech bubble
    const speechText = await page.evaluate(() => {
      const el = Array.from(document.querySelectorAll('div')).find(el => el.innerText?.includes("Psst... I've got a surprise for you"));
      return el ? el.innerText : null;
    });
    results.steps.push(`Speech bubble text: ${speechText ? 'Found' : 'Not Found'}`);

    // Click Mascot
    await page.click('[aria-label="Interactive Hero Mascot - Click to reveal Developer Grant"]');
    results.steps.push('Clicked Mascot');

    // Wait for the modal animation
    await new Promise(r => setTimeout(r, 1500));

    // Check Modal Open
    const modalText = await page.evaluate(() => {
      const header = Array.from(document.querySelectorAll('h2')).find(h => h.innerText?.includes('Developer Grant'));
      return header ? header.innerText : null;
    });
    results.steps.push(`Modal Header: ${modalText?.replace(/\\n/g, ' ')}`);
    
    // Verify Overclock Context activated (Prices should be Developer Grant in the DOM, let's just check the CTA button class for Overclock)
    const overclockedPrice = await page.evaluate(() => {
      const grantPriceEl = document.querySelector('.bg-accent-primary\\\\/10');
      return grantPriceEl ? 'Yes' : 'No';
    });
    results.steps.push(`Is Overclock Active (grant badge in DOM): ${overclockedPrice}`);

    // Click CTA "Explore Developer Grants"
    const exploreBtn = await page.evaluateHandle(() => {
      return Array.from(document.querySelectorAll('button')).find(el => el.textContent === 'Explore Developer Grants');
    });
    if (exploreBtn) {
      await exploreBtn.click();
      results.steps.push('Clicked Explore Developer Grants');
    }

    // Wait for modal to close
    await new Promise(r => setTimeout(r, 1000));
    const modalStillOpen = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('h2')).some(h => h.innerText?.includes('Developer Grant'));
    });
    results.steps.push(`Modal still open after CTA: ${modalStillOpen}`);

  } catch (err) {
    results.steps.push(`Error during test: ${err.message}`);
  }

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})();
