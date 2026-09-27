(async () => {
  const res = await fetch('https://coderarmy.in/about-us');
  const html = await res.text();
  const urls = html.match(/[a-zA-Z0-9_\-\/\.]+\.(jpg|jpeg|png|webp)/g);
  if (urls) {
    console.log("All image paths:");
    console.log(urls);
  } else {
    console.log("No images found");
  }
})();
