import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  
  const results = { failedRequests: 0, steps: [] };
  
  page.on('requestfailed', request => {
    // Only count XHR/fetch failures to our API or general network errors
    if (request.resourceType() === 'fetch' || request.resourceType() === 'xhr') {
      results.failedRequests++;
      results.steps.push(`Request failed: ${request.url()}`);
    }
  });

  try {
    // 1. Test Sign Up Route
    await page.goto('http://localhost:5173/signup', {waitUntil: 'networkidle2'});
    
    // Clear localStorage to ensure clean state
    await page.evaluate(() => localStorage.clear());
    
    // Enter short password
    await page.type('input[type="text"]', 'testuser@example.com');
    await page.type('input[type="password"]', '123');
    await page.click('button[type="submit"]');
    
    await new Promise(r => setTimeout(r, 1000)); // Wait for error
    const signupError = await page.evaluate(() => document.querySelector('.bg-red-500\\/10')?.innerText);
    results.steps.push(`Signup short password error: ${signupError}`);

    // Enter valid password
    await page.evaluate(() => document.querySelector('input[type="password"]').value = ''); // clear
    await page.type('input[type="password"]', 'ValidPass123!');
    await page.click('button[type="submit"]');
    
    await new Promise(r => setTimeout(r, 1000));
    const signupSuccess = await page.evaluate(() => document.querySelector('.bg-green-500\\/10')?.innerText);
    results.steps.push(`Signup success message: ${signupSuccess}`);
    
    // Wait for redirect to /login
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 5000 }).catch(() => null);
    results.steps.push(`URL after signup redirect: ${page.url()}`);

    // 2. Test Sign In Route with Invalid Creds
    await page.goto('http://localhost:5173/login', {waitUntil: 'networkidle2'});
    await page.type('input[type="text"]', 'wronguser@example.com');
    await page.type('input[type="password"]', 'WrongPass123');
    await page.click('button[type="submit"]');
    
    await new Promise(r => setTimeout(r, 1500));
    const loginError = await page.evaluate(() => document.querySelector('.bg-red-500\\/10')?.innerText);
    results.steps.push(`Login invalid creds error: ${loginError}`);

    // Test Sign In Route with Valid Creds
    // Clear inputs first
    await page.evaluate(() => {
      document.querySelector('input[type="text"]').value = '';
      document.querySelector('input[type="password"]').value = '';
    });
    
    await page.type('input[type="text"]', 'testuser@example.com');
    await page.type('input[type="password"]', 'ValidPass123!');
    
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 5000 }).catch(() => null),
      page.click('button[type="submit"]')
    ]);
    
    results.steps.push(`URL after valid login: ${page.url()}`);
    
    // Check local storage for auth token
    const token = await page.evaluate(() => localStorage.getItem('strike_demo_auth'));
    results.steps.push(`Auth token set: ${!!token}`);
    
  } catch (err) {
    results.steps.push(`Test execution error: ${err.message}`);
  }

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})();
