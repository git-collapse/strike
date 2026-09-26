import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  
  const requests = [];
  page.on('request', request => {
    if (request.method() === 'POST' && request.url().includes('api.strikes.in')) {
      requests.push({ url: request.url(), postData: request.postData() });
    }
  });
  
  await page.goto('https://strikes.in/login', {waitUntil: 'networkidle2'});
  
  // Try to use page.type
  await page.type('input[name="identifier"], input[type="text"], input[type="email"]', 'test12345@example.com');
  await page.type('input[name="password"], input[type="password"]', 'TestPassword123!');
  
  await page.click('button[type="submit"]');
  
  await new Promise(r => setTimeout(r, 2000));
  
  console.log('Intercepted API POST requests:', JSON.stringify(requests, null, 2));
  
  await browser.close();
})();
