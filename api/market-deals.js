const { proxyToApify } = require("../lib/proxy");
module.exports = (req, res) => proxyToApify(req, res, "caulleonard~tr-aktuel-scraper");
