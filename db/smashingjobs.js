var parseURL = require("rss-parser").parseURL,
  getTags = require("./getTags.js");

module.exports = function smashingjobs(url, magic){
  parseURL(url, (err, data) => {
    if(!data) return magic([]);
    var result = data.feed.entries.map(e => {
      var date = new Date(e.pubDate).getTime(),
        titleSplit = e.title.split(" - "),
        title = titleSplit[0].trim(),
        company = titleSplit[1],
        location = titleSplit[2],
        content = e.content,
        url = e.link,
        source = "smashingjobs",
        tags = getTags({title, content});
      return {date, title, company, content, url, source, tags};
    });
    result = result.filter(e => !/ä|ö|ü|Ü|ß|ntwick/.test(e.title + e.company + e.content));
    magic(result);
  });
};
