var parseRss = require("parse-rss"),
  getTags = require("./getTags.js");

module.exports = function jobspresso(url, magic){
  parseRss(url, (err, data) => {
    data = data.map(e => {
      var date = new Date(e.pubDate).getTime(),
        title = e.title,
        company = e["job_listing:company"]["#"],
        location = "Remote",
        content = e.description,
        url = e.link,
        source = "jobspresso",
        tags = getTags({title, content});
      return {date, title, company, location, content, url, source, tags};
    });
    magic(data);
  });
};
