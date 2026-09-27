import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  
  try {
    await page.goto('https://www.youtube.com/@RohitNegi9', { waitUntil: 'networkidle2' });
    const imgUrl = await page.evaluate(() => {
      const img = document.querySelector('img#img');
      return img ? img.src : null;
    });
    console.log('Rohit Negi:', imgUrl);
  } catch (err) {
    console.error('Error fetching Rohit Negi:', err);
  }

  try {
    await page.goto('https://www.youtube.com/@AdityaTandon', { waitUntil: 'networkidle2' });
    const imgUrl = await page.evaluate(() => {
      const img = document.querySelector('img#img');
      return img ? img.src : null;
    });
    console.log('Aditya Tandon:', imgUrl);
  } catch (err) {
    console.error('Error fetching Aditya Tandon:', err);
  }
  
  await browser.close();
})();
