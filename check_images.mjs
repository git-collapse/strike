import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  
  await page.goto('https://strikes.in/', {waitUntil: 'networkidle2'});
  
  const images = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img')).slice(0, 10).map(img => ({
      src: img.src,
      alt: img.alt,
      className: img.className
    }));
  });
  
  console.log(JSON.stringify(images, null, 2));
  
  await browser.close();
})();
