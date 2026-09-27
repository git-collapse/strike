(async () => {
  const res = await fetch('https://coderarmy.in/');
  const html = await res.text();
  const urls = html.match(/https:\/\/[^\s\"\'\>]+\.(jpg|jpeg|png|webp)/g);
  if (urls) {
    console.log("Found images:", urls.filter(u => u.toLowerCase().includes('rohit') || u.toLowerCase().includes('aditya') || u.toLowerCase().includes('mentor') || u.toLowerCase().includes('founder') || u.toLowerCase().includes('team')));
  } else {
    console.log("No images found");
  }
})();
