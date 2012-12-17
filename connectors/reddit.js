/*global require, exports, console*/
(function() {
    "use strict";
    var request = require("../util/simplerequests.js"),
        root = "http://www.reddit.com/r/",
        suffix = "/comments.json?sort=new&limit=100",
        comments = [];

    function init(subreddit, complete) {
        complete = complete || function(){};

        fetchData(subreddit, function(data) {
            comments = JSON.parse(data).data.children;

            complete(_formatData(comments));
        });
    }

    function fetchData(subreddit, complete) {
        request(root + subreddit + suffix, complete);
    }

    function dumpData(data) {
        console.log("%s comments", comments.length);
        data.forEach(function(item) {
            console.log(item.data.author + ": " + item.data.body.length);
        });
    }

    /**
     * Conform the data to a useful, shared format
     * @param {Array<Reddit Comment>} comments The comments to be formatted
     * @returns {Array<Post>} The formatted comments
     */
    function _formatData(comments) {
        var formatted = [];

        comments.forEach(function(comment) {
            formatted.push({
                author:  comment.data.author,
                body:    comment.data.body,
                created: comment.data.created_utc,
                id:      comment.data.id
            });
        });

        return formatted;
    }

    exports.init = init;
    exports.dump = dumpData;
}());