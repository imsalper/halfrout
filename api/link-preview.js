module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  try {
    const url = (req.body && req.body.url) || "";
    if (!url) {
      res.status(400).json({ error: "url gerekli" });
      return;
    }
    const pageRes = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "tr-TR,tr;q=0.9,en;q=0.8",
      },
    });
    const html = await pageRes.text();

    if (/just a moment|cf-browser-verification|cf_chl_opt|checking your browser/i.test(html)) {
      res.status(200).json({ image: null, title: null, blocked: true });
      return;
    }

    const getMeta = (prop) => {
      let m = html.match(new RegExp(`<meta[^>]+property=["']${prop}["'][^>]+content=["']([^"']+)["']`, "i"));
      if (!m) m = html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${prop}["']`, "i"));
      if (!m) m = html.match(new RegExp(`<meta[^>]+name=["']${prop}["'][^>]+content=["']([^"']+)["']`, "i"));
      return m ? m[1] : null;
    };

    const image = getMeta("og:image") || getMeta("twitter:image");
    const titleTag = (html.match(/<title>([^<]+)<\/title>/i) || [])[1];
    const title = getMeta("og:title") || titleTag || null;

    res.status(200).json({ image, title });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
};
