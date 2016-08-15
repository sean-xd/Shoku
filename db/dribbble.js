var parseURL = require("rss-parser").parseURL,
  getTags = require(__dirname + "/getTags.js");

module.exports = function dribbble(magic){
  parseURL("https://dribbble.com/jobs.rss", (err, data) => {
    var result = data.feed.entries.map(e => {
      var date = new Date(e.pubDate).getTime(),
        titleReg = e.title.match(/(.+) is hiring an? (.+)/),
        delimiter = titleReg[2].indexOf(" in ") > -1 ? " in " : " anywhere",
        titleSplit = titleReg[2].split(delimiter),
        title = titleSplit[0],
        company = titleReg[1],
        location = titleSplit.length > 2 ? titleSplit.slice(1).join(" in ") : titleSplit[1],
        content = e.title,
        url = e.link,
        source = "dribbble",
        tags = getTags({title, content});
      return {date, title, company, content, url, source, location, tags};
    });
    magic(result);
  });
};
