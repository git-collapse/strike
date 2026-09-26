import puppeteer from 'puppeteer-core';
import fs from 'fs';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  
  const content = fs.readFileSync('src/components/CourseGrid.tsx', 'utf8');
  const urls = [...content.matchAll(/href:\s*'([^']+)'/g)].map(m => m[1]);
  
  const uniqueUrls = [...new Set(urls)];
  console.log('Testing', uniqueUrls.length, 'URLs...');
  
  for (const url of uniqueUrls) {
    try {
      const response = await page.goto(url, {waitUntil: 'networkidle2'});
      console.log('OK:', url, response.status());
    } catch(e) {
      console.log('FAIL:', url, e.message);
    }
  }
  
  await browser.close();
})();
