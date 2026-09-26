import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  
  await page.goto('https://strikes.in/', {waitUntil: 'networkidle2'});
  
  const buttons = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll('a, button'));
    return anchors
      .filter(el => el.innerText && (el.innerText.includes('Join Us') || el.innerText.includes('Get Started') || el.innerText.includes('Explore')))
      .map(el => ({
        text: el.innerText.trim(),
        tag: el.tagName,
        href: el.href || null,
        className: el.className
      }));
  });
  
  console.log(JSON.stringify(buttons, null, 2));
  
  await browser.close();
})();
