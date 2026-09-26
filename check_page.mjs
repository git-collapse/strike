import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  
  await page.goto('https://strikes.in/course/nexus-webdev', {waitUntil: 'networkidle2'});
  const title = await page.title();
  const text = await page.evaluate(() => document.body.innerText);
  
  console.log('Title:', title);
  console.log('Body snippet:', text.slice(0, 200));
  
  await browser.close();
})();
