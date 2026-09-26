import puppeteer from 'puppeteer-core';
import fs from 'fs';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true
  });
  const page = await browser.newPage();

  const apiResponses = [];
  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('api') || url.includes('course')) {
       try {
          const type = response.headers()['content-type'];
          if (type && type.includes('application/json')) {
              const json = await response.json();
              apiResponses.push({ url, json });
          }
       } catch (e) {}
    }
  });

  console.log('Navigating to strikes.in...');
  await page.goto('https://strikes.in/', { waitUntil: 'networkidle2' });
  await delay(5000);

  fs.writeFileSync('api_responses.json', JSON.stringify(apiResponses, null, 2));

  console.log('Extracting from DOM...');
  const courses = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('a[href^="/course/"]'));
    const data = [];
    cards.forEach(card => {
       const parent = card.closest('div') || card;
       
       const titleEl = parent.querySelector('h1, h2, h3, h4, .text-xl, .font-bold');
       const title = titleEl ? titleEl.innerText.trim() : '';
       
       const imgEl = parent.querySelector('img');
       const thumbnail = imgEl ? imgEl.src : '';
       
       const textNodes = Array.from(parent.querySelectorAll('*')).map(el => el.innerText || '');
       const fullText = textNodes.join(' ');
       
       const priceMatches = fullText.match(/₹[\d,]+/g) || [];
       const numericPrices = [...new Set(priceMatches.map(p => parseInt(p.replace(/[^\d]/g, ''))))].sort((a,b)=>a-b);
       
       const currentPrice = numericPrices.length > 0 ? numericPrices[0] : null;
       const originalPrice = numericPrices.length > 1 ? numericPrices[numericPrices.length - 1] : null;

       data.push({
           href: card.href,
           title,
           thumbnail,
           currentPrice,
           originalPrice,
           text: parent.innerText
       });
    });
    
    // Filter to unique hrefs
    const unique = [];
    const seen = new Set();
    for (const item of data) {
      if (!seen.has(item.href) && item.title) {
         seen.add(item.href);
         unique.push(item);
      }
    }
    
    return unique;
  });
  
  fs.writeFileSync('dom_courses.json', JSON.stringify(courses, null, 2));
  console.log('Done!');
  await browser.close();
})();
