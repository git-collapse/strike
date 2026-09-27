import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  
  await page.goto('https://coderarmy.in/about-us', { waitUntil: 'networkidle2' });
  const urls = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img')).map(i => i.src);
  });
  console.log(urls);
  
  await browser.close();
})();
