var parseRss = require("parse-rss"),
  getTags = require("./getTags.js");

module.exports = function jobspresso(magic){
  parseRss("https://jobspresso.co/?feed=job_feed&job_types=designer%2Cdeveloper%2Cmarketing%2Cproject-mgmt%2Csupport%2Csys-admin%2Cvarious%2Cwriting&search_location&job_categories&search_keywords", (err, data) => {
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
