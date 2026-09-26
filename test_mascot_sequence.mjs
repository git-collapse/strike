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

    // Click Mascot
    await page.click('[aria-label="Interactive Hero Mascot - Click to reveal Developer Grant"]');
    results.steps.push('Clicked Mascot');

    // Wait for Step 1 Text
    await new Promise(r => setTimeout(r, 500));
    let seqText = await page.evaluate(() => {
      const el = document.querySelector('.font-mono.text-cyan-400');
      return el ? el.innerText : null;
    });
    results.steps.push(`Step 1 Text: ${seqText}`);
    
    // Wait for Step 2 Text
    await new Promise(r => setTimeout(r, 1000));
    seqText = await page.evaluate(() => {
      const el = document.querySelector('.font-mono.text-cyan-400');
      return el ? el.innerText : null;
    });
    results.steps.push(`Step 2 Text: ${seqText}`);
    
    // Wait for Step 3 Text
    await new Promise(r => setTimeout(r, 1000));
    seqText = await page.evaluate(() => {
      const el = document.querySelector('.font-mono.text-cyan-400');
      return el ? el.innerText : null;
    });
    results.steps.push(`Step 3 Text: ${seqText}`);

    // Wait for the modal animation
    await new Promise(r => setTimeout(r, 1500));

    // Check Modal Open
    const modalText = await page.evaluate(() => {
      const header = Array.from(document.querySelectorAll('h2')).find(h => h.innerText?.includes('Developer Grant'));
      return header ? header.innerText : null;
    });
    results.steps.push(`Modal Header: ${modalText?.replace(/\n/g, ' ')}`);

  } catch (err) {
    results.steps.push(`Error during test: ${err.message}`);
  }

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})();
