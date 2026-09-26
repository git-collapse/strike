import https from 'https';
import fs from 'fs';

const urls = [
  'thunder-web', 'web-dev', 'thunder-sd', '689ecf2b6793e719cdee9efc',
  '689ee05f1d8fc292bd27df7c', 'devops', 'combo', 'nexus-webdev',
  'nexus-blockchain', 'system-design', 'dsa-premium', 'lld',
  'dsa-java', 'fullstack-go', 'hld', 'dsa-cpp', 'spring-boot'
];

async function fetchCourse(slug) {
  return new Promise((resolve) => {
    https.get(`https://strikes.in/course/${slug}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let price = null;
        let originalPrice = null;
        let thumbnail = null;
        
        // Find og:image
        const ogMatch = data.match(/<meta property="og:image" content="([^"]+)"/i);
        if (ogMatch) thumbnail = ogMatch[1];
        
        // Look for JSON-LD on the course page
        const scriptRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
        let match;
        while ((match = scriptRegex.exec(data)) !== null) {
          if (match[1].includes('price') || match[1].includes('Price')) {
             try {
                const json = JSON.parse(match[1]);
                if (json.offers && json.offers.price) {
                   price = json.offers.price;
                }
             } catch(e) {}
          }
        }
        
        // Try to scrape literal price numbers from text: e.g. ₹5,499
        const priceMatches = data.match(/₹[\d,]+/g);
        if (priceMatches && priceMatches.length > 0) {
           const nums = [...new Set(priceMatches.map(p => parseInt(p.replace(/[^\d]/g, ''))))].sort((a,b)=>a-b);
           if (!price && nums.length > 0) price = nums[0];
           if (nums.length > 1) originalPrice = nums[nums.length - 1];
        }

        resolve({ slug, price, originalPrice, thumbnail, ok: res.statusCode === 200 });
      });
    }).on('error', () => resolve({ slug, error: true }));
  });
}

async function run() {
  const results = [];
  for (let slug of urls) {
    console.log(`Fetching ${slug}...`);
    const data = await fetchCourse(slug);
    results.push(data);
  }
  fs.writeFileSync('course_details.json', JSON.stringify(results, null, 2));
  console.log('Done!');
}

run();
