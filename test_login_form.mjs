import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  
  const results = {};
  
  // Intercept the API call to verify the backend is hit
  page.on('request', request => {
    if (request.url().includes('api.strikes.in')) {
      results.interceptedApiCall = true;
      results.apiUrl = request.url();
      results.apiMethod = request.method();
      results.apiBody = request.postData();
    }
  });

  await page.goto('http://localhost:5173/login', {waitUntil: 'networkidle2'});
  
  // Test 1: Sign up link
  const signUpUrl = await page.evaluate(() => {
    const link = Array.from(document.querySelectorAll('a')).find(a => a.innerText.toLowerCase().includes('sign up'));
    return link ? link.href : null;
  });
  results.signUpLinkUrl = signUpUrl;

  // Test 2: Sign In button submission
  await page.type('input[type="text"]', 'fakeuser@example.com');
  await page.type('input[type="password"]', 'fakepassword123');
  
  await page.click('button[type="submit"]');
  
  await new Promise(r => setTimeout(r, 1500));
  
  // Check for error message
  results.errorDisplayed = await page.evaluate(() => {
    const text = document.body.innerText;
    return text.includes('Invalid credentials') || text.includes('Failed to sign in') || text.includes('invalid') || document.querySelector('.bg-red-500\\/10') !== null;
  });
  
  console.log(JSON.stringify(results, null, 2));
  
  await browser.close();
})();
