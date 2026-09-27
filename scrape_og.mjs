import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  
  const getOgImage = async (url) => {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      const ogImg = await page.evaluate(() => {
        const meta = document.querySelector('meta[property="og:image"]');
        return meta ? meta.content : null;
      });
      console.log(url, ogImg);
    } catch(e) {
      console.log(url, 'error', e.message);
    }
  }

  await getOgImage('https://www.instagram.com/rohit_negi9/');
  await getOgImage('https://www.linkedin.com/in/rohit-negi9/');
  
  await getOgImage('https://www.instagram.com/adityatandon_/');
  await getOgImage('https://www.linkedin.com/in/aditya-tandon-803a621a3/');
  
  await browser.close();
})();
