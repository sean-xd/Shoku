var parseURL = require("rss-parser").parseURL,
  getTags = require(__dirname + "/getTags.js");

module.exports = function stackoverflow(magic){
  parseURL("https://stackoverflow.com/jobs/feed", (err, data) => {
    var result = data.feed.entries.map(e => {
      var loc = !!e.title.split(" at ")[1].split(" (")[1],
        date = new Date(e.pubDate).getTime(),
        titleSplit = e.title.split(" at "),
        title = titleSplit[0].split(" (")[0],
        titleSplit2 = titleSplit[1].split(" ("),
        company = titleSplit2[0] || "?",
        location = loc ? titleSplit2[1].slice(0,-1) : e.location || "N/A",
        content = e.content,
        url = e.link,
        source = "stackoverflow",
        tags = getTags({title, content});
      return {date, title, company, content, url, source, location, tags};
    });
    result = result.filter(e => !/ä|ö|ü|Ü|ß|ntwick/.test(e.title + e.company + e.content));
    magic(result);
  });
};
