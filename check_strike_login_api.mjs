import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  
  const requests = [];
  page.on('request', request => {
    if (request.method() === 'POST') {
      requests.push({ url: request.url(), postData: request.postData() });
    }
  });
  
  await page.goto('https://strikes.in/login', {waitUntil: 'networkidle2'});
  
  await page.evaluate(() => {
    const email = document.querySelector('input[type="text"], input[name="identifier"]');
    if (email) email.value = 'test@example.com';
    
    const pass = document.querySelector('input[type="password"]');
    if (pass) pass.value = 'password123';
    
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.toLowerCase().includes('log') || b.innerText.toLowerCase().includes('sign in'));
    if (btn) btn.click();
  });
  
  await new Promise(r => setTimeout(r, 2000));
  
  console.log('Intercepted POST requests:', JSON.stringify(requests, null, 2));
  
  await browser.close();
})();
