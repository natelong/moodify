/*global require, exports*/
(function() {
    "use strict";

    var fs = require("fs"),
        path = require("path"),
        badWords = fs.readFileSync("./bayes/topWords.json", "utf8"),
        categories = {},
        settings = {
            probability: 0.5,
            filename: "data" + path.sep + "cache.json",
            threshold: 10
        };

    /**
     * @constructor
     */
    var Category = function Category() {
        this.total = 0;
        this.words = {};
    };

    /**
     * Break a piece of text into its words
     * @param {String} text The text to be broken up
     * @returns {Array<String>} The words that make up the given text
     */
    function _toWords(text) {
        var words,
            goodWords = [];

        text = text.replace(/[.,!?":;\-)(]|\d/g,"");
        text = text.replace(/\s+/," ");
        words = text.split(/\s/);

        words.forEach(function(word) {
            word = word.toLowerCase();
            if(badWords.indexOf(word) === -1 && goodWords.indexOf(word) === -1 && word.length > 0) {
                goodWords.push(word);
            }
        });

        return goodWords;
    }

    /**
     * Get the total count of training documents
     * @returns {Number} The total number of training documents
     */
    function _totalTrainingCount() {
        var total = 0;

        Object.keys(categories).forEach(function(key) {
            total += categories[key].total;
        });

        return total;
    }

    /**
     * Increment the count of a word in a category
     * @param {String} word     The word to be incremented
     * @param {String} category The category to increment the word in
     */
    function _incrementWord(word, category) {
        var categoryObject = categories[category];
        if(word in categoryObject) {
            categoryObject[word]++;
        } else {
            categoryObject[word] = 1;
        }
    }

    /**
     * Find the probability that a word falls into a given category
     * @param {String} word     The word to test
     * @param {String} category The name of the category
     * @param {number} The probability that a word falls into a given category
     */
    function _wordInCategoryProbability(word, category) {
        return (categories[category][word] / categories[category].total) || settings.probability;
    }

    /**
     * Find the overall probability that a any body of text falls into a given category
     * @param {String} category The name of the category
     * @returns {Number} The probability that any body of text falls into the category
     */
    function _categoryProbability(category) {
        return categories[category].total / _totalTrainingCount();
    }

    /**
     * Find the class that a given body of text belongs to
     * @param {String} text The text
     * @returns {Object} A hash relating category names to their probabilities for the given text
     */
    function classify(text) {
        var categoryNames = Object.keys(categories),
            words = _toWords(text),
            probabilities = {},
            best,
            maxProb = 0,
            secondMaxProb = 0;

        // do a pass for each category, so we can get the probabilities for each category
        categoryNames.forEach(function(passCategoryName) {
            var totalProbability = 1;

            // get the probability for each word
            words.forEach(function(word) {
                totalProbability *= _wordInCategoryProbability(word, passCategoryName) *
                        _categoryProbability(passCategoryName);
            });

            probabilities[passCategoryName] = totalProbability;
        });

        Object.keys(probabilities).forEach(function(category) {
            if(probabilities[category] > maxProb) {
                secondMaxProb = maxProb;
                maxProb = probabilities[category];
                best = category;
            }
        });

        if(maxProb / secondMaxProb > settings.threshold) {
            return best;
        } else {
            return "unknown";
        }
    }

    /**
     * Train the system that a specific text falls into a given category
     * @param {String} text     The text to be classified
     * @param {String} category The category to classify the text under
     */
    function train(text, category) {
        var words = _toWords(text);

        if(!(category in categories)) {
            categories[category] = new Category();
        }

        categories[category].total++;

        words.forEach(function(word) {
            _incrementWord(word, category);
        });
    }

    /**
     * Dumps the category data to file
     * @param {String?} filename The name of the output file, relative to the current working dir
     */
    function dump(filename) {
        filename = filename || settings.filename;

        fs.writeFileSync("." + path.sep + filename, JSON.stringify(categories), "utf8");
    }

    /**
     * Loads the category data from a file
     * @param {String?} filename The name of the input file, relative to the current working dir
     */
    function load(filename) {
        filename = filename || settings.filename;

        categories = JSON.parse(fs.readFileSync("." + path.sep + filename, "utf8"));
    }

    exports.train = train;
    exports.classify = classify;
    exports.dump = dump;
    exports.load = load;
}());