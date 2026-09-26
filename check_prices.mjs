import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  
  await page.goto('https://strikes.in/course/nexus-webdev', {waitUntil: 'networkidle2'});
  const webdevHtml = await page.content();
  const webdevPrices = webdevHtml.match(/₹[\d,]+/g);
  
  await page.goto('https://strikes.in/course/nexus-blockchain', {waitUntil: 'networkidle2'});
  const blockchainHtml = await page.content();
  const blockchainPrices = blockchainHtml.match(/₹[\d,]+/g);

  console.log('Web Dev Prices:', webdevPrices);
  console.log('Blockchain Prices:', blockchainPrices);
  
  await browser.close();
})();
