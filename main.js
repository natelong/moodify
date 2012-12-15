/*global require, console */
(function() {
    "use strict";
    var fs = require("fs");
    var connector = require("./connectors/reddit.js");
    var backend = require("./backends/memory.js");
    var classifier = require("./bayes/main.js");

    classifier.init(backend);

    var training = JSON.parse(fs.readFileSync("./data/training.json", "utf8"));
    training.forEach(function(data) {
        classifier.train(data.mood, data.body);
    });

    //fs.writeFileSync("./training.txt", backend.dump(), "utf8");
    connector.init("GuildWars2", function(data) {
        data.forEach(function(comment) {
            var prob = classifier.classify(comment.body);
            console.log(prob);
        });
        // console.log(classifier.classify(data[0].body));
    });
}());