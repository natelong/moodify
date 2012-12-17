/*global require, console */
(function() {
    "use strict";
    var fs = require("fs"),
        connector = require("./connectors/reddit.js"),
        classifier = require("./bayes/main.js"),
        training = JSON.parse(fs.readFileSync("./data/training.json", "utf8"));

    // training.forEach(function(data) {
    //     classifier.train(data.body, data.mood);
    // });
    // classifier.dump();

    classifier.load();

    connector.init("GuildWars2", function(data) {
        data.slice(0,10).forEach(function(comment) {
            console.log("\n", comment.body.length);
            console.log(classifier.classify(comment.body));
        });
    });
}());