import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  await page.goto('https://strikes.in/', {waitUntil: 'networkidle2'});
  
  const links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a')).map(a => ({
      text: a.innerText,
      href: a.href
    })).filter(l => l.href.includes('youtube.com'));
  });
  
  console.log(JSON.stringify(links, null, 2));
  await browser.close();
})();
