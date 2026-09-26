import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  
  await page.goto('https://strikes.in/', {waitUntil: 'networkidle2'});
  
  const events = await page.evaluate(() => {
    const getStarted = Array.from(document.querySelectorAll('button')).find(b => b.innerText && b.innerText.includes('Get Started'));
    const joinUs = Array.from(document.querySelectorAll('button')).find(b => b.innerText && b.innerText.includes('Join Us'));
    
    return {
      getStarted: getStarted ? { onclick: getStarted.getAttribute('onclick'), outerHTML: getStarted.outerHTML } : null,
      joinUs: joinUs ? { onclick: joinUs.getAttribute('onclick'), outerHTML: joinUs.outerHTML } : null,
    };
  });
  
  console.log(JSON.stringify(events, null, 2));
  
  await browser.close();
})();
