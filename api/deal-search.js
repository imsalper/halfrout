const { proxyToApify } = require("../lib/proxy");
module.exports = (req, res) => proxyToApify(req, res, "apify~google-search-scraper");
