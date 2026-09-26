import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new'
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  
  await page.mouse.move(1300, 600);
  await new Promise(r => setTimeout(r, 600));
  
  const targetInfo = await page.evaluate(() => {
    // get element from point 1300, 600
    const el = document.elementFromPoint(1300, 600);
    return {
      tagName: el ? el.tagName : null,
      className: el ? el.className : null,
      id: el ? el.id : null
    };
  });
  
  console.log(targetInfo);
  await browser.close();
})();
