import fs from 'fs';
const code = fs.readFileSync('main.js', 'utf8');
const images = code.match(/https?:\/\/[^\s"'`]+?\.(png|jpg|jpeg|webp)/gi);
console.log(images);
