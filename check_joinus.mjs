import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  
  await page.goto('https://strikes.in/', {waitUntil: 'networkidle2'});
  
  // Find "Join Us" button
  const joinBtn = await page.evaluateHandle(() => {
    return Array.from(document.querySelectorAll('button')).find(b => b.innerText && b.innerText.includes('Join Us'));
  });
  
  if (joinBtn) {
    await joinBtn.click();
    await new Promise(r => setTimeout(r, 1000));
    console.log('Join Us clicked. Current URL:', page.url());
  }
  
  await browser.close();
})();
