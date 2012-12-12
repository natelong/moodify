var http = require("http"),
    url = require("url"),
    userAgent = "Simple Mood Classifier v0.1";


module.exports = function(path, complete, error) {
    var data = "",
        urlData = url.parse(path),
        options = {
            hostname: urlData.hostname,
            path: urlData.pathname + "?" + urlData.query,
            headers: {
                "User-Agent": userAgent
            }
        },
        req = http.get(options, function(res) {
            res.on("data", function(chunk) {
                data += chunk;
            });
            res.on("end", function() {
                complete(data);
            });
        });

    req.on("error", function(e) {
        error(e.message);
    });
};