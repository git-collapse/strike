import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  console.log('Navigating to strikes.in...');
  await page.goto('https://strikes.in/', { waitUntil: 'networkidle' });
  
  // Also wait for images/cards to render
  await page.waitForTimeout(3000);
  
  console.log('Extracting course data...');
  const courses = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('a[href^="/course/"]'));
    const uniqueCourses = new Map();
    
    cards.forEach(card => {
      const href = card.href;
      if (!href) return;
      
      const parent = card.closest('div') || card; // Try to get the container
      const titleEl = card.querySelector('h1, h2, h3, h4, .text-xl, .font-bold') || parent.querySelector('h1, h2, h3, h4, .text-xl, .font-bold');
      const title = titleEl ? titleEl.innerText.trim() : '';
      if (!title) return;
      
      const imgEl = card.querySelector('img') || parent.querySelector('img');
      const thumbnail = imgEl ? imgEl.src : '';
      
      // Look for price patterns like ₹5,499
      const textNodes = Array.from(parent.querySelectorAll('*')).map(el => el.innerText || '');
      const fullText = textNodes.join(' ');
      
      const priceMatches = fullText.match(/₹[\d,]+/g) || [];
      const numericPrices = [...new Set(priceMatches.map(p => parseInt(p.replace(/[^\d]/g, ''))))].sort((a,b)=>a-b);
      
      const currentPrice = numericPrices.length > 0 ? numericPrices[0] : null;
      const originalPrice = numericPrices.length > 1 ? numericPrices[numericPrices.length - 1] : null;

      if (!uniqueCourses.has(href)) {
        uniqueCourses.set(href, {
          title,
          href,
          thumbnail,
          currentPrice,
          originalPrice,
          fullText // we can inspect this later for duration/modules
        });
      }
    });
    
    return Array.from(uniqueCourses.values());
  });

  fs.writeFileSync('courses_scraped.json', JSON.stringify(courses, null, 2));
  console.log(`Found ${courses.length} courses! Saved to courses_scraped.json`);
  
  await browser.close();
})();
