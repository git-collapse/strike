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

    await page.evaluate(() => {
      const btn = document.querySelector('button[aria-label="Discover Developer Grant Sale"]');
      if (btn) btn.click();
    });
    
    await new Promise(r => setTimeout(r, 500));

    const allText = await page.evaluate(() => document.body.textContent.replace(/\s+/g, ' '));
    results.steps.push(allText.includes('Offer Ends In') ? "Offer panel opened" : "Offer panel did NOT open");
    
    if (allText.includes('Offer Ends In')) {
      const idx = allText.indexOf('Offer Ends In');
      results.steps.push(allText.substring(idx, idx + 80));
    }

  } catch (err) {
    results.errors.push(err.message);
  }

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})();
