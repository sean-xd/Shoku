var request = require("request"),
  parseURL = require("rss-parser").parseURL,
  cheerio = require("cheerio"),
  Magic = (num, cb, arr) => data => (arr.length === num - 1) ? cb(arr.concat([data])) : arr.push(data),
  getTags = require(__dirname + "/getTags.js");

module.exports = function coroflot(magic){
  parseURL("http://feeds.feedburner.com/coroflot/AllJobs?format=xml", (err, data) => {
    var results = data.feed.entries;
      inception = Magic(data.feed.entries.length, magic, []);
    data.feed.entries.map(e => {
      var date = new Date(e.pubDate).getTime(),
        companyAndTitle = e.title.match(/(.+) is seeking an? (.+)/),
        title = companyAndTitle[2],
        company = companyAndTitle[1],
        location = e.contentSnippet,
        url = e.guid,
        source = "coroflot";
      request(url, (err2, response, body) => {
        var $ = cheerio.load(body),
          content = $("#job_description_public p").html(),
          tags = getTags({title, content});
        inception({date, title, company, location, content, url, source, tags});
      });
    });
  });
};
