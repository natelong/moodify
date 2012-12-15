/*global exports, console*/
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

    var _backend,
        _minProb = 0,
        _weight = 1,
        _assumedProb = 0.5,
        _badWords = ["", "to", "and", "the", "it", "i", "a", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

    /**
     * Break a piece of text into its words
     * @param {String} text The text to be broken up
     * @returns {Array<String>} The words that make up the given text
     */
    function _toWords(text) {
        var words = text.split(/\W/),
            goodWords = [];

        words.forEach(function(word) {
            word = word.toLowerCase();
            if(_badWords.indexOf(word) === -1) {
                goodWords.push(word);
            }
        });

        return goodWords;
    }

    /**
     * Calculate the raw probability that a word matches a category
     * @param {String} word The word to be categorized
     * @param {String} cat  The category against which to measure the word
     */
    function _wordProb(word, cat) {
        var totalWordsInCat = _backend.wordsInCatCount(cat);

        // console.log("'" + word + "' makes up " + _backend.wordsInCatCount(cat, word) + " of " + totalWordsInCat + " in '" + cat + "'");

        if(totalWordsInCat === 0) {
            return 0;
        }

        return _backend.wordsInCatCount(cat, word) / totalWordsInCat;
    }

    /**
     * Calculate that probability that a given word matches a category, with weighting
     *  and assumptions factored into the calculation
     * @param {String} word The word to be classified
     * @param {String} cat  The category against which the word should be measured
     */
    function _wordCatProb(word, cat) {
        var startingProb = _wordProb(word, cat),
            totals = _backend.totalWordCount(word);

        return (_weight * _assumedProb + totals * startingProb) / (_weight + totals);
    }

    /**
     * Calculate the raw probability that a piece of text matches a category
     * @param {String} text The text to be classified
     * @param {String} cat  The category against which the text should be measured
     */
    function _textProb(text, cat) {
        var words = _toWords(text),
            prob = 1;

        words.forEach(function(word) {
            prob *= _wordCatProb(word, cat);
        });

        return prob;
    }

    /**
     * Calculate the probability that a piece of text matches a category,
     *  normalized by the probability of the category itself
     * @param {String} text The text to be classified
     * @param {String} cat  The category against which to test the text
     * @returns {Number}    The probability that the text is falls into the category
     */
    function _textCatProb(text, cat) {
        var catProb = _backend.getTrainCount(cat) / _backend.getTrainCount(),
            textProb = _textProb(text, cat);

        // console.log("\nTraining for '" + cat + "': " + _backend.getTrainCount(cat) + "/" + _backend.getTrainCount() + " = " + catProb.toFixed(2));

        return catProb * textProb;
    }

    /**
     * Get the scores for a body of text in each category
     * @param {String} text The text to be classified
     * @returns {Object}    An object map of categories to probabilities
     */
    function _catScores(text) {
        var cats = _backend.getCategories(),
            probs = {};

        cats.forEach(function(cat) {
            probs[cat] = _textCatProb(text, cat);
        });

        return probs;
    }

    /**
     * Classify a given piece of text to find the probability
     *  that it falls into each category of text
     * @param {String} text The text to be classified
     */
    function classify(text) {
        var maxProb = _minProb,
            best,
            scores;

        scores = _catScores(text);
        return scores;
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