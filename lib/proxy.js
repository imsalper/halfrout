// Ortak yardımcı: her /api/*.js dosyası bunu kullanıp ilgili Apify
// actor'üne istek atar. Token burada (sunucu tarafında) kalır,
// tarayıcıya hiç gönderilmez.
//
// ÖNEMLİ: APIFY_TOKEN'ı Vercel projesinin "Environment Variables"
// ayarına eklemen ŞART: Vercel Dashboard > projen > Settings >
// Environment Variables > Key: APIFY_TOKEN, Value: apify_api_...
// Token asla kod içine yazılmaz (GitHub bunu engelliyor zaten).
const APIFY_TOKEN = process.env.APIFY_TOKEN;

async function proxyToApify(req, res, actorPath) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  if (!APIFY_TOKEN) {
    res.status(500).json({ error: "APIFY_TOKEN ortam değişkeni ayarlanmamış. Vercel Settings > Environment Variables'a ekle." });
    return;
  }
  try {
    const url = `https://api.apify.com/v2/actors/${actorPath}/run-sync-get-dataset-items?token=${APIFY_TOKEN}`;
    const body = typeof req.body === "string" ? req.body : JSON.stringify(req.body || {});
    const apifyRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    const data = await apifyRes.json();
    if (Array.isArray(data) && data.length) {
      console.log("DEBUG ilk sonuç alanları:", Object.keys(data[0]));
      console.log("DEBUG ilk sonuç değerleri:", JSON.stringify(data[0]).slice(0, 1000));
    } else {
      console.log("DEBUG: sonuç listesi boş geldi.");
    }
    res.status(200).json(data);
  } catch (err) {
    console.error("HATA:", err);
    res.status(500).json({ error: String(err) });
  }
}

module.exports = { proxyToApify };
