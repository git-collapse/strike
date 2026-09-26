import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new'
  });
  
  const results = { steps: [], errors: [] };
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
    results.steps.push('Loaded Homepage');

    // Wait for react to mount
    await new Promise(r => setTimeout(r, 1000));

    // Check how many underlines exist initially
    let underlines = await page.$$eval('[style*="border-radius: 9999px"]', els => els.filter(e => e.className.includes('bg-cyan-400') && !e.className.includes('w-1.5')).length);
    results.steps.push(`Initial active underlines (desktop): ${underlines}`);

    // Click "Courses" link
    await page.click('a[href="/#courses"]');
    await new Promise(r => setTimeout(r, 500)); // wait for animation
    
    underlines = await page.$$eval('[style*="border-radius: 9999px"]', els => els.filter(e => e.className.includes('bg-cyan-400') && !e.className.includes('w-1.5')).length);
    results.steps.push(`Active underlines after clicking Courses: ${underlines}`);

    // Verify Active Class is on "Courses"
    const activeText = await page.evaluate(() => {
      const activeLink = Array.from(document.querySelectorAll('a')).find(a => a.className.includes('text-cyan-400'));
      return activeLink ? activeLink.innerText : 'None';
    });
    results.steps.push(`Active link text: ${activeText}`);

  } catch (err) {
    results.steps.push(`Error during test: ${err.message}`);
  }

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})();
