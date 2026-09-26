import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  
  await page.goto('https://rohittnegi.akamai.net.in/new-courses/18-web-development-system-design-security-devops-new', {waitUntil: 'networkidle2'});
  
  console.log('Current URL after direct buyLink:', page.url());
  console.log('Title:', await page.title());
  
  await browser.close();
})();
