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

    // Get the first membership plan pricing layout
    const layout = await page.evaluate(() => {
      const container = document.querySelector('.flex.flex-row.items-center.gap-4.sm\\:gap-5.mb-8');
      if (!container) return 'Layout not found';
      
      const priceReveal = container.querySelector('.text-4xl');
      const strikethrough = container.querySelector('.line-through');
      const discount = container.querySelector('.bg-accent-primary\\/10');
      
      return {
        hasPriceReveal: !!priceReveal,
        hasStrikethrough: !!strikethrough,
        hasDiscount: !!discount,
        strikethroughText: strikethrough?.innerText,
        discountText: discount?.innerText
      };
    });
    results.steps.push(`Layout verified: ${JSON.stringify(layout)}`);
    
  } catch (err) {
    results.steps.push(`Error during test: ${err.message}`);
  }

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})();
