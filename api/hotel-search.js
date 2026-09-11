const { proxyToApify } = require("../lib/proxy");
module.exports = (req, res) => proxyToApify(req, res, "voyager~booking-scraper");
