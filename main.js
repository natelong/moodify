/*global require, console */
(function() {
    "use strict";
    var fs = require("fs");
    var connector = require("./connectors/reddit.js");
    var backend = require("./backends/memory.js");
    var classifier = require("./bayes/main.js");

    classifier.init(backend);

    // var training = JSON.parse(fs.readFileSync("./data/training.json", "utf8"));
    // training.forEach(function(data) {
    //     classifier.train(data.mood, data.body);
    // });

    var backup = JSON.parse(fs.readFileSync("./backend.json", "utf8"));
    backend.init(backup);

    // fs.writeFileSync("./topWords.json", JSON.stringify(backend.topWords()), "utf8");

    // fs.writeFileSync("./backend.json", backend.dump(), "utf8");
    connector.init("GuildWars2", function(data) {
        data.slice(0,100).forEach(function(comment) {
            console.log(classifier.classify(comment.body));
        });
        // console.log(data[0].body);
        // console.log(classifier.classify(data[0].body));
    });
}());