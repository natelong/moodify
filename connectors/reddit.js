var request = require("../simplerequests.js"),
    root = "http://www.reddit.com/r/",
    suffix = "/comments.json?sort=new&limit=100",
    comments = [];

function init(subreddit) {
    fetchData(subreddit, function(data) {
        comments = JSON.parse(data).data.children;
        console.log("%s comments", comments.length);
        dumpData(comments);
    });
}

function fetchData(subreddit, complete) {
    request(root + subreddit + suffix, complete);
}

function dumpData(data) {
    data.forEach(function(item) {
        console.log(item.data.author + ": " + item.data.body.length);
    });
}

exports.init = init;