var parseURL = require("rss-parser").parseURL,
  getTags = require("./getTags.js");

module.exports = function weworkremotely(url, magic){
  parseURL(url, (err, data) => {
    var result = data.feed.entries.map(e => {
      var date = new Date(e.pubDate).getTime(),
        title = e.title.split(": ")[1],
        company = e.title.split(": ")[0],
        content = e.content,
        url = e.link,
        source = "weworkremotely",
        tags = getTags({title, content});
      if(company.length > 50) company = company.slice(0,50) + "...";
      return {date, title, company, content, url, source, tags};
    });
    magic(result);
  });
};
