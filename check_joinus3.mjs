import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  
  await page.goto('https://strikes.in/', {waitUntil: 'networkidle2'});
  
  const joinBtn = await page.evaluateHandle(() => {
    return Array.from(document.querySelectorAll('button')).find(b => b.innerText && b.innerText.includes('Join Us'));
  });
  
  if (joinBtn) {
    await joinBtn.click();
    await new Promise(r => setTimeout(r, 1000));
    
    // Check if any modal opened
    const modalText = await page.evaluate(() => {
      const modal = document.querySelector('[role="dialog"], .modal, .dialog');
      return modal ? modal.innerText : 'No modal found';
    });
    
    console.log('Modal text after click:', modalText);
  }
  
  await browser.close();
})();
