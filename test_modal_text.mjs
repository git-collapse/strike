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

    // Open offer panel
    let robot = await page.$('img[alt="Floating Assistant Robot"]');
    await robot.click();
    await new Promise(r => setTimeout(r, 500));

    const allText = await page.evaluate(() => document.body.textContent.replace(/\s+/g, ' '));
    results.steps.push(allText.includes('Days') ? "Days found" : "Days NOT found");
    results.steps.push(allText.substring(allText.indexOf('Days') - 10, allText.indexOf('Days') + 30));

  } catch (err) {
    results.errors.push(err.message);
  }

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})();
