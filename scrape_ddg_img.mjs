import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  
  await page.goto('https://duckduckgo.com/?q=Rohit+Negi+Coder+Army+profile+photo&t=h_&iax=images&ia=images', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  
  const urls = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img')).map(img => img.src).filter(src => src.startsWith('http') && !src.includes('duckduckgo.com'));
  });
  console.log("Rohit:", urls.slice(0, 5));

  await page.goto('https://duckduckgo.com/?q=Aditya+Tandon+Coder+Army+profile+photo&t=h_&iax=images&ia=images', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  
  const urls2 = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img')).map(img => img.src).filter(src => src.startsWith('http') && !src.includes('duckduckgo.com'));
  });
  console.log("Aditya:", urls2.slice(0, 5));

  await browser.close();
})();
