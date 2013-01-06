/*global require, console */
(function() {
    "use strict";
    var fs = require("fs"),
        classifier = require("./bayes/main.js"),
        training = JSON.parse(fs.readFileSync("./data/training.json", "utf8"));

    training.forEach(function(data) {
        classifier.train(data.body, data.mood);
    });
    classifier.dump();
}());