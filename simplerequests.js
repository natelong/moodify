/*global require, module, console*/
(function() {
    "use strict";
    var http = require("http"),
        url = require("url"),
        userAgent = "Simple Mood Classifier v0.1",
        queue = [],
        runningRequest = false;

    function _request(path, complete, error) {
        runningRequest = true;

        var data = "",
            urlData = url.parse(path),
            options,
            req;

        options = {
            hostname: urlData.hostname,
            path: urlData.pathname + "?" + urlData.query,
            headers: {
                "User-Agent": userAgent
            }
        };

        req = http.get(options, function(res) {
            res.on("data", function(chunk) {
                data += chunk;
            });
            res.on("end", function() {
                complete(data);
                setTimeout(_next, 2000);
            });
        });

        req.on("error", function(e) {
            error(e.message);
            _next();
        });
    }

    function _next() {
        var next;

        if(queue.length > 0) {
            next = queue.shift();
            setTimeout(function() {
                _request(next.path, next.complete, next.error);
            }, 2000);
        } else {
            runningRequest = false;
        }
    }

    function enqueue(path, complete, error) {
        if(runningRequest) {
            queue.push({
                path: path,
                complete: complete,
                error: error
            });
        } else {
            _request(path, complete, error);
        }
    }
    module.exports = enqueue;
}());