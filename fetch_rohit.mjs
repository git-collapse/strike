import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  
  await page.goto('https://www.youtube.com/@RohitNegi9', { waitUntil: 'networkidle2' });
  const html = await page.content();
  const matches = html.match(/https:\/\/yt3\.(ggpht|googleusercontent)\.com\/[^\"]+/g);
  console.log(matches ? matches.filter(m => m.includes('s176') || m.includes('s88') || m.includes('c0x00ffffff-no-rj')) : 'none');
  
  await browser.close();
})();
