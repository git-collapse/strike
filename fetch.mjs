import https from 'https';
import fs from 'fs';

https.get('https://strikes.in/', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('raw_strike.html', data);
    
    // Extract JSON-LD or Next data
    const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    let scripts = [];
    while ((match = scriptRegex.exec(data)) !== null) {
      if (match[1].includes('{') && match[1].includes('}')) {
         scripts.push(match[1]);
      }
    }
    fs.writeFileSync('scripts.json', JSON.stringify(scripts, null, 2));
    console.log(`Saved raw HTML and ${scripts.length} script contents.`);
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});
