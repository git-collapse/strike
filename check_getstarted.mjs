import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  
  await page.goto('https://strikes.in/', {waitUntil: 'networkidle2'});
  
  const getStartedBtn = await page.evaluateHandle(() => {
    return Array.from(document.querySelectorAll('button')).find(b => b.innerText && b.innerText.includes('Get Started'));
  });
  
  if (getStartedBtn) {
    const scrollBefore = await page.evaluate(() => window.scrollY);
    await getStartedBtn.click();
    await new Promise(r => setTimeout(r, 1000));
    const scrollAfter = await page.evaluate(() => window.scrollY);
    console.log('Get Started clicked. URL:', page.url(), '| scrollBefore:', scrollBefore, '| scrollAfter:', scrollAfter);
  }
  
  await browser.close();
})();
