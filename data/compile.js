/*global require*/
(function() {
    "use strict";

    var fs = require("fs");

    var posFiles = fs.readdirSync("./pos");
    var negFiles = fs.readdirSync("./neg");

    var trainingFile = fs.createWriteStream("./training.json", {encoding: "utf8"});
    var trainingData = [];

    posFiles.forEach(function(file) {
        var wrapper = {
            mood: "positive",
            body: fs.readFileSync("./pos/" + file, "utf8")
        };

        trainingData.push(wrapper);
    });
    negFiles.forEach(function(file) {
        var wrapper = {
            mood: "negative",
            body: fs.readFileSync("./neg/" + file, "utf8")
        };

        trainingData.push(wrapper);
    });

    trainingFile.end(JSON.stringify(trainingData));
}());