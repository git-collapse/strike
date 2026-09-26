import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  
  await page.evaluateOnNewDocument(() => {
    window.__FETCH_CALLS__ = [];
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      window.__FETCH_CALLS__.push({ url: args[0], options: args[1] });
      return originalFetch(...args);
    };
  });
  
  await page.goto('https://strikes.in/login', {waitUntil: 'networkidle2'});
  
  try {
    await page.type('input[name="identifier"], input[type="text"], input[type="email"]', 'test12345@example.com');
    await page.type('input[name="password"], input[type="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
  } catch (e) {
    console.log('Error interacting:', e.message);
  }
  
  await new Promise(r => setTimeout(r, 2000));
  
  const fetches = await page.evaluate(() => window.__FETCH_CALLS__);
  console.log('Intercepted fetch calls:', JSON.stringify(fetches.filter(f => f.options && f.options.method === 'POST'), null, 2));
  
  await browser.close();
})();
