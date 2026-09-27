import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  
  const getUrl = async (handle) => {
    await page.goto('https://www.youtube.com/@' + handle, { waitUntil: 'networkidle2' });
    const html = await page.content();
    const matches = html.match(/https:\/\/yt3\.(ggpht|googleusercontent)\.com\/[^\"]+/g);
    if (matches) {
      // Find one that looks like a profile avatar (usually has s176-c or similar)
      const avatar = matches.find(m => m.includes('-c-k-c0x00ffffff-no-rj') || m.includes('s176') || m.includes('s88'));
      console.log(handle, avatar || matches[0]);
    } else {
      console.log(handle, 'not found');
    }
  }

  await getUrl('RohitNegi9');
  await getUrl('AdityaTandon');
  await getUrl('adityatandon_');
  
  await browser.close();
})();
