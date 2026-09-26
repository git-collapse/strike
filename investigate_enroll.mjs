import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

  await page.goto('https://strikes.in/course/thunder-web', {waitUntil: 'networkidle2'});
  
  console.log('Evaluating Enroll Now button...');
  const result = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button, a'));
    const enrollBtn = buttons.find(b => b.innerText && b.innerText.toLowerCase().includes('enroll now'));
    if (!enrollBtn) return 'Button not found';
    
    enrollBtn.click();
    return {
      tagName: enrollBtn.tagName,
      className: enrollBtn.className,
      href: enrollBtn.href,
      onClick: enrollBtn.getAttribute('onclick')
    };
  });
  
  console.log('Result:', result);
  
  await new Promise(r => setTimeout(r, 3000));
  console.log('Current URL after click:', page.url());
  
  await browser.close();
})();
