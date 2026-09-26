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

    const checkPrices = async (durationText) => {
      // Find duration button
      const durationBtn = await page.$x(`//button[contains(., '${durationText}')]`);
      if (durationBtn.length > 0) {
        await durationBtn[0].click();
        await new Promise(r => setTimeout(r, 600)); // wait for animation
        results.steps.push(`Clicked ${durationText}`);
      }
      
      return await page.$$eval('#memberships .bg-\\[\\#0a0a0c\\]', (cards) => {
        return cards.map(card => {
          const mainPrice = card.querySelector('.tabular-nums:not(.invisible)')?.innerText;
          const originalPrice = card.querySelector('.line-through')?.innerText;
          const discount = card.querySelector('.bg-cyan-400\\/10')?.innerText;
          
          // Check DOM bounds to ensure vertical layout (no overlap)
          const mainPriceRect = card.querySelector('.tabular-nums:not(.invisible)')?.getBoundingClientRect();
          const origPriceRect = card.querySelector('.line-through')?.getBoundingClientRect();
          
          let overlap = false;
          if (mainPriceRect && origPriceRect) {
            // Check if they intersect or sit on the same horizontal line instead of stacked
            if (origPriceRect.top < mainPriceRect.bottom - 10) { 
              // We tolerate a small margin, but original should basically be below main price
              overlap = true; 
            }
          }
          
          return {
            name: card.querySelector('h3').innerText,
            mainPrice,
            originalPrice,
            discount,
            isStacked: !overlap
          };
        });
      });
    };

    const res4Y = await checkPrices('4 Years');
    results.steps.push('4 Years Data: ' + JSON.stringify(res4Y));

    const res2Y = await checkPrices('2 Years');
    results.steps.push('2 Years Data: ' + JSON.stringify(res2Y));

    const res3Y = await checkPrices('3 Years');
    results.steps.push('3 Years Data: ' + JSON.stringify(res3Y));

  } catch (err) {
    results.steps.push(`Error during test: ${err.message}`);
  }

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})();
