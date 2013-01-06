/*global require, console */
(function() {
    "use strict";
    var fs = require("fs"),
        connector = require("./connectors/reddit.js"),
        classifier = require("./bayes/main.js");

    classifier.load();

    connector.init("GuildWars2", function(data) {
        data.slice(0,100).forEach(function(comment) {
            var category = classifier.classify(comment.body);
            if(category !== "unknown") {
                console.log("\n%s:\n%s", category, comment.body);
            }
        });
    });
}());