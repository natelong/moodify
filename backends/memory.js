/*global exports, console*/
(function() {
    "use strict";

    var _cats = {},
        _words = {},
        _trainingCount = 0,
        _totalWords = 0,
        _totalCats = 0;

    /**
     * A category object
     * @constructor
     */
    var Category = function Category() {
        _totalCats++;
        this.totalWords = 0;
        this.trainingCount = 0;
        this.words = {};
    };

    /**
     * A word object
     * @constructor
     */
    var Word = function Word() {
        _totalWords++;
        this.categories = {};
        this.totalCategories = 0;
        this.total = 0;
    };

    /**
     * Get the total number of times a word appears
     */
    function totalWordCount(word) {
        if(word && (word in _words)) {
            return _words[word].total;
        } else {
            return 0;
        }
    }

    /**
     * Count a word as appearing in a given category
     * @param {String} word     The word to assign to the category
     * @param {String} category The category to which the word should be assigned
     */
    function incrementWord(word, category) {
        var tmpWord = _words[word],
            tmpCat = _cats[category];

        if(!tmpWord) {
            tmpWord = new Word();
        }

        if(!(category in tmpWord.categories)) {
            tmpWord.categories[category] = 1;
            tmpWord.totalCategories++;
        } else {
            tmpWord.categories[category]++;
        }

        tmpWord.total++;

        if(!tmpCat) {
            tmpCat = new Category();
        }

        if(!(word in tmpCat.words)) {
            tmpCat.words[word] = 1;
            tmpCat.totalWords++;
        } else {
            tmpCat.words[word]++;
        }

        _words[word] = tmpWord;
        _cats[category] = tmpCat;
    }

    /**
     * Increment a category
     * @param {String} category The category to be incremented
     */
    function incrementCategory(category) {
        var tmpCat = _cats[category];

        if(!tmpCat) {
            tmpCat = new Category();
        }

        tmpCat.trainingCount++;
        _trainingCount++;

        _cats[category] = tmpCat;
    }

    /**
     * Retrieve a list of categories
     * @returns {Array<String>} An array of category names
     */
    function getCategories() {
        return Object.keys(_cats);
    }

    /**
     * Get the total number of training items, or number of training items in
     *  a specific category, if a category is passed in
     * @param {String?} category Optional: A category by which to narrow the result
     */
    function getTrainCount(category) {
        if(category && (category in _cats)) {
            return _cats[category].trainingCount;
        }

        return _trainingCount;
    }

    /**
     * Get the total number of words appearing in a category, or the number of times a
     *  specific word appears in a category, if words is passed in
     * @param {String} category The category to use to limit the search
     * @param {String?} word    Optional: The word to use to limit the search
     */
    function wordsInCatCount(category, word) {
        if(!category || !(category in _cats)) {
            throw "Category " + category + "does not exist.";
        }

        if(word) {
            if (word in _cats[category].words) {
                return _cats[category].words[word];
            } else {
                return 0;
            }
        }

        return _cats[category].totalWords;
    }

    /**
     * Sorts the words object and returns an array
     */
    function _sortWords(category) {
        var keys = Object.keys(_cats[category].words),
            wordList = [];

        function wordSorter(a, b) {
            return a.count - b.count;
        }

        keys.forEach(function(key) {
            wordList.push({
                word: key,
                count: _cats[category].words[key]
            });
        });

        return wordList.sort(wordSorter).reverse();
    }

    /**
     * Returns the contents of the backend
     */
    function dump() {
        var contents = "";
        contents += "========";
        contents += "backend dump";
        contents += "========";
        // contents += JSON.stringify(_cats);
        // contents += JSON.stringify(_words);
        // contents += JSON.stringify(_trainingCount);
        // contents += JSON.stringify(_totalWords);
        // contents += JSON.stringify(_totalCats);
        var words = _sortWords("negative");
        words.forEach(function(word) {
            contents += "\n" + word.word + ": " + word.count;
        });
        contents += "========";

        return contents;
    }

    exports.incrementWord = incrementWord;
    exports.incrementCategory = incrementCategory;
    exports.getCategories = getCategories;
    exports.getTrainCount = getTrainCount;
    exports.wordsInCatCount = wordsInCatCount;
    exports.totalWordCount = totalWordCount;
    exports.dump = dump;
}());