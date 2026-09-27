import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  
  await page.goto('https://www.quora.com/profile/Rohit-Negi-155', { waitUntil: 'networkidle2' });
  const html = await page.content();
  const matches = html.match(/https:\/\/[a-z0-9A-Z\-\.]+\.quoracdn\.net[^\"]+/g);
  console.log(matches ? matches.filter(m => m.includes('main-thumb')) : 'none');
  
  await browser.close();
})();
