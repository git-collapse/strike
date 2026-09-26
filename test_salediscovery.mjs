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

    // Click SaleDiscovery Mascot
    await page.click('[aria-label="Discover Developer Grant Sale"]');
    results.steps.push('Clicked Mascot Trigger');

    // Wait for the Terminal sequence to finish and the bottom panel to open. 
    // Usually terminal overlay takes around 3 seconds.
    await new Promise(r => setTimeout(r, 4000));

    // Check Bottom Panel Open
    const panelText = await page.evaluate(() => {
      const header = Array.from(document.querySelectorAll('h2')).find(h => h.innerText?.includes('Developer Grants Unlocked'));
      return header ? header.innerText : null;
    });
    results.steps.push(`Bottom Panel Header: ${panelText?.replace(/\n/g, ' ')}`);

    // Verify Active Robot is present
    const activeRobot = await page.evaluate(() => {
      const img = document.querySelector('img[alt="Grant Activated Robot"]');
      return img ? 'Present' : 'Not Found';
    });
    results.steps.push(`Active Robot State: ${activeRobot}`);

  } catch (err) {
    results.steps.push(`Error during test: ${err.message}`);
  }

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})();
