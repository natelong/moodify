/*global exports, console, require*/
/**
 * Backend Spec
 *  incrementWord(word, cat)
 *  incrementCategory(cat)
 *  getCategories()
 *  getTrainCount(cat?)
 *  wordsInCatCount(cat, word?)
 */
(function() {
    "use strict";

    var fs = require("fs");

    var _backend,
        _minProb = 0,
        _weight = 1,
        _assumedProb = 0.5,
        _badWords = fs.readFileSync("./bayes/topWords.json", "utf8");

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
            if(_badWords.indexOf(word) === -1 && goodWords.indexOf(word) === -1 && word.length > 0) {
                goodWords.push(word);
            }
        });

        return goodWords;
    }

    /**
     * Calculate the raw probability that a word matches a category
     *  defined as P(cat|word)
     * @param {String} word The word to be categorized
     * @param {String} cat  The category against which to measure the word
     */
    function _wordProb(word, cat) {
        var wordsInCat = _backend.wordsInCatCount(cat, word),
            catCount = _backend.getTrainCount(cat),
            prob = wordsInCat / catCount;

        // console.log("Probability of %s in %s: %s", word, cat, prob || 0.5);
        return prob || 0.5;
    }

    function _catProb(cat) {
        var catCount = _backend.getTrainCount(cat),
            totalCount = _backend.getTrainCount(),
            prob = catCount / totalCount;

        return prob;
    }

    /**
     * Calculate the raw probability that a piece of text matches a category
     * @param {String} text The text to be classified
     * @param {String} cat  The category against which the text should be measured
     */
    function _textCatProb(text, cat) {
        var words = _toWords(text),
            prob = 1;

        words.forEach(function(word) {
            prob *= _wordProb(word, cat);
        });

        prob *= _catProb(cat);

        // console.log("Final probability of text in %s: %s", cat, prob);
        return prob;
    }

    /**
     * Get the scores for a body of text in each category
     * @param {String} text The text to be classified
     * @returns {Object}    An object map of categories to probabilities
     */
    function _catScores(text) {
        var cats = _backend.getCategories(),
            probs = {},
            catsProb = 1;

        cats.forEach(function(cat) {
            catsProb *= _catProb(cat);
        });

        cats.forEach(function(cat) {
            probs[cat] = _textCatProb(text, cat) / catsProb;
        });

        return probs;
    }

    /**
     * Classify a given piece of text to find the probability
     *  that it falls into each category of text
     * @param {String} text The text to be classified
     */
    function classify(text) {
        var maxProb = 0,
            best,
            scores,
            threshold = 0.2;

        scores = _catScores(text);

        Object.keys(scores).forEach(function(key) {
            if(scores[key] > maxProb) {
                maxProb = scores[key];
                best = key;
            }
        });

        if(maxProb > threshold) {
            return best;
        } else {
            return "unknown";
        }
    }

    /**
     * Train the classifier on a given piece of text
     * @param {String} category The category to which a piece of text should belong
     * @param {String} text     The text to assign to the category
     */
    function train(category, text) {
        var words = _toWords(text);
        words.forEach(function(word) {
            _backend.incrementWord(word, category);
        });

        _backend.incrementCategory(category);
    }

    /**
     * Initialize the classifier with the given backend
     * @param {Object} backend The storage engine to use for the classification data
     */
    function init(backend) {
        _backend = backend;
    }

    exports.train = train;
    exports.init = init;
    exports.classify = classify;
}());