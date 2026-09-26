import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  
  await page.goto('https://www.youtube.com/@CoderArmy9/playlists', {waitUntil: 'networkidle2'});
  
  const playlists = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a#video-title')).map(a => ({
      title: a.innerText,
      href: a.href
    }));
  });

  console.log(JSON.stringify(playlists, null, 2));
  await browser.close();
})();
