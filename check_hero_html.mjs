import puppeteer from 'puppeteer-core';
import fs from 'fs';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  
  await page.goto('https://strikes.in/', {waitUntil: 'networkidle2'});
  
  const heroHtml = await page.evaluate(() => {
    // try to find the section containing "Take control of your Future With Strike"
    const els = Array.from(document.querySelectorAll('div, section'));
    const hero = els.find(e => e.innerText && e.innerText.includes('Take control of your') && e.innerText.includes('Future With Strike') && e.children.length > 3);
    return hero ? hero.outerHTML : 'Not found';
  });
  
  // write to a file since it might be large
  fs.writeFileSync('hero_html.txt', heroHtml);
  
  await browser.close();
})();
