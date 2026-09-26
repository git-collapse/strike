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
  
  await page.evaluate(() => {
    const identifier = document.querySelector('input[name="identifier"], input[type="text"], input[type="email"]');
    if (identifier) identifier.value = 'test@example.com';
    
    const password = document.querySelector('input[name="password"], input[type="password"]');
    if (password) password.value = 'Password123!';
    
    // Dispatch input events
    if (identifier) identifier.dispatchEvent(new Event('input', { bubbles: true }));
    if (password) password.dispatchEvent(new Event('input', { bubbles: true }));
    
    const submitBtn = document.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.click();
  });
  
  await new Promise(r => setTimeout(r, 2000));
  
  console.log('Intercepted API POST requests:', JSON.stringify(requests, null, 2));
  
  await browser.close();
})();
