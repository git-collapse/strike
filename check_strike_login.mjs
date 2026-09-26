import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  
  await page.goto('https://strikes.in/login', {waitUntil: 'networkidle2'});
  
  const forms = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('form')).map(f => ({
      action: f.action,
      method: f.method,
      inputs: Array.from(f.querySelectorAll('input')).map(i => ({ name: i.name, type: i.type }))
    }));
  });
  
  console.log('Forms on /login:', JSON.stringify(forms, null, 2));
  
  const links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a')).map(a => ({ text: a.innerText, href: a.href }));
  });
  
  console.log('Sign up link:', links.find(l => l.text.toLowerCase().includes('sign up') || l.text.toLowerCase().includes('register')));
  
  await browser.close();
})();
