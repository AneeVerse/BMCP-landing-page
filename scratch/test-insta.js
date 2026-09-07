const url = "https://www.instagram.com/p/Da4g1-9C_Fr/";
console.log("Fetching post HTML with Facebook Crawler User-Agent...");
fetch(url, {
  headers: {
    "User-Agent": "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_voiced_ostg.html)"
  }
})
  .then(res => res.text())
  .then(text => {
    console.log("HTML length:", text.length);
    
    const titleMatch = text.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
    const descMatch = text.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
    console.log("Title:", titleMatch ? titleMatch[1] : "not found");
    console.log("Desc:", descMatch ? descMatch[1] : "not found");

  })
  .catch(err => {
    console.error("Error:", err);
  });
