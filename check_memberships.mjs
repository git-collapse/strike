import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  
  await page.goto('https://strikes.in/', {waitUntil: 'networkidle2'});
  const text = await page.evaluate(() => document.body.innerText);
  
  console.log(text.slice(0, 2000));
  
  // Try to find "Plus" or "Ultra"
  const matches = text.match(/.{0,50}(Plus|Ultra).{0,200}/gi);
  if (matches) {
    console.log('\n--- MATCHES ---\n', matches.join('\n'));
  } else {
    console.log('No matches found for Plus or Ultra');
  }
  
  await browser.close();
})();
