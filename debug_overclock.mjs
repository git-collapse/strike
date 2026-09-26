import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox']
  });
  
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });

  const activateBtn = await page.$('button[aria-label="Activate Overclock Mode"]');
  if (activateBtn) {
    await activateBtn.click();
    await new Promise(r => setTimeout(r, 6000));
    const text = await page.evaluate(() => document.body.textContent);
    console.log(text.includes('Developer Grant') ? 'Overclock ACTIVE' : 'Overclock FAILED');
  }

  await browser.close();
})();
