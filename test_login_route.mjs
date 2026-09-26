import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173', {waitUntil: 'networkidle2'});
  
  const results = {};
  
  // Find and click Join Us
  const joinUs = await page.evaluateHandle(() => {
    return Array.from(document.querySelectorAll('a')).find(a => a.innerText && a.innerText.includes('Join Us'));
  });
  
  if (joinUs) {
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => null),
      joinUs.click()
    ]);
    
    // Wait for react router to mount
    await new Promise(r => setTimeout(r, 500));
    results.joinUsDestination = page.url();
    
    // Check if it's the login page by looking for "Welcome Back"
    results.joinUsShowsWelcomeBack = await page.evaluate(() => document.body.innerText.includes('Welcome Back'));
  }
  
  // Go back to localhost home
  await page.goto('http://localhost:5173', {waitUntil: 'networkidle2'});
  
  // Find and click Get Started (Hero one)
  const getStarted = await page.evaluateHandle(() => {
    return Array.from(document.querySelectorAll('.flex-col.sm\\:flex-row a')).find(a => a.innerText && a.innerText.includes('Get Started'));
  });
  
  if (getStarted) {
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => null),
      getStarted.click()
    ]);
    
    await new Promise(r => setTimeout(r, 500));
    results.getStartedDestination = page.url();
    results.getStartedShowsWelcomeBack = await page.evaluate(() => document.body.innerText.includes('Welcome Back'));
  }
  
  // Test refresh on /login
  await page.goto('http://localhost:5173/login', {waitUntil: 'networkidle2'});
  results.refreshWorks = await page.evaluate(() => document.body.innerText.includes('Welcome Back'));
  
  console.log(JSON.stringify(results, null, 2));
  
  await browser.close();
})();
