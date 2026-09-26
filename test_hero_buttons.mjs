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
    const href = await page.evaluate(el => el.href, joinUs);
    results.joinUsUrl = href;
    
    // Listen for navigation
    const [response] = await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => null),
      joinUs.click()
    ]);
    
    results.joinUsDestination = page.url();
  }
  
  // Go back to localhost
  await page.goto('http://localhost:5173', {waitUntil: 'networkidle2'});
  
  // Find and click Get Started (Hero one)
  const getStarted = await page.evaluateHandle(() => {
    // Specifically target the Hero section one
    return Array.from(document.querySelectorAll('.flex-col.sm\\:flex-row a')).find(a => a.innerText && a.innerText.includes('Get Started'));
  });
  
  if (getStarted) {
    const href = await page.evaluate(el => el.href, getStarted);
    results.getStartedUrl = href;
    
    const [response] = await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => null),
      getStarted.click()
    ]);
    
    results.getStartedDestination = page.url();
  }
  
  console.log(JSON.stringify(results, null, 2));
  
  await browser.close();
})();
