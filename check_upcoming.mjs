import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  
  const urls = [
    'https://strikes.in/course/dsa-java',
    'https://strikes.in/course/fullstack-go',
    'https://strikes.in/course/spring%20boot'
  ];
  
  for (const url of urls) {
    try {
      const response = await page.goto(url, {waitUntil: 'networkidle2'});
      console.log(url, response.status(), await page.title());
    } catch(e) {
      console.log(url, 'Error:', e.message);
    }
  }
  
  await browser.close();
})();
