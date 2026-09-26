import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173/login', {waitUntil: 'networkidle2'});
  
  await page.type('input[type="text"]', 'test@example.com');
  await page.type('input[type="password"]', 'Password123');
  
  await page.click('button[type="submit"]');
  
  await new Promise(r => setTimeout(r, 2000));
  
  const error = await page.evaluate(() => {
    const errEl = document.querySelector('.bg-red-500\\/10');
    return errEl ? errEl.innerText : null;
  });
  
  console.log('Error displayed in UI:', error);
  
  await browser.close();
})();
