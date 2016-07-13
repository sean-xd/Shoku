var parseURL = require("rss-parser").parseURL,
  getTags = require("./getTags.js");

module.exports = function stackOverflow(url, magic){
  parseURL(url, (err, data) => {
    var result = data.feed.entries.map(e => {
      var date = new Date(e.pubDate).getTime(),
        titleSplit = e.title.split(" at "),
        title = titleSplit[0].split(" (")[0],
        company = titleSplit[1].split(" (")[0],
        content = e.content,
        url = e.link,
        source = "stackoverflow",
        tags = getTags({title, content});
      return {date, title, company, content, url, source, tags};
    });
    result = result.filter(e => !/ä|ö|ü|Ü|ß|ntwick/.test(e.title + e.company + e.content));
    magic(result);
  });
};
