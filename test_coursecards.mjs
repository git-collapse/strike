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
    results.steps.push('Loaded Homepage');

    await new Promise(r => setTimeout(r, 1000)); // allow rendering

    const cards = await page.$$eval('.group.bg-\\[\\#0a0a0c\\]', (els) => {
      return els.map(card => {
        const title = card.querySelector('h3')?.innerText || 'Unknown';
        const cta = card.querySelector('.mt-auto.mb-5.relative');
        return {
          title,
          hasViewPrice: card.innerHTML.includes('View Price'),
          priceRevealActive: !!card.querySelector('.tabular-nums')
        }
      });
    });

    results.steps.push(`Total cards checked: ${cards.length}`);
    const missingPrices = cards.filter(c => c.hasViewPrice);
    if (missingPrices.length > 0) {
      results.steps.push(`Cards with 'View Price': ${missingPrices.map(c => c.title).join(', ')}`);
    } else {
      results.steps.push('No missing prices detected (Success)');
    }

  } catch (err) {
    results.steps.push(`Error during test: ${err.message}`);
  }

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})();
