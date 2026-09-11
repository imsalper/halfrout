const { proxyToApify } = require("../lib/proxy");
module.exports = (req, res) => proxyToApify(req, res, "rainminer~google-maps-menu-scraper");
