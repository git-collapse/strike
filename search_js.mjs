import fs from 'fs';

const code = fs.readFileSync('main.js', 'utf8');

// Find JSON.parse(...) or arrays containing course-like objects.
// Let's just extract strings that look like JSON objects containing 'course' or 'price'.
let arrMatches = code.match(/\[\{[\s\S]{50,10000}?\}\]/g) || [];
console.log(`Found ${arrMatches.length} array structures`);

const courses = [];
for (let match of arrMatches) {
  if (match.includes('price') && match.includes('title')) {
     console.log('\nFound potential courses array:');
     console.log(match.substring(0, 500) + '...');
  }
}

// Or specifically search for prices
let priceMatches = code.match(/price:\s*[\d.]+/g);
console.log(priceMatches?.slice(0, 10));

// Let's search for "Thunder: 100 Days of Code"
let idx = code.indexOf("Thunder: 100 Days of Code");
if (idx !== -1) {
    let start = Math.max(0, idx - 200);
    let end = Math.min(code.length, idx + 1000);
    console.log('\nContext around Thunder:');
    console.log(code.substring(start, end));
}

let combo = code.indexOf("Complete DSA + GenAI Combo");
if (combo !== -1) {
    console.log('\nContext around Combo:');
    console.log(code.substring(Math.max(0, combo-200), Math.min(code.length, combo+500)));
}
