function coroflotGet(cb){
  var parseURL = parseURL || require("rss-parser").parseURL,
    request = request || require("request"),
    cheerio = cheerio || require("cheerio"),
    Magic = Magic || require("_magic"),
    url = "http://feeds.feedburner.com/coroflot/AllJobs?format=xml";
  parseURL(url, (err, data) => {
    if(!data || !data.feed || !data.feed.entries) return cb(new Error("No Data Entries"));
    var done = Magic(data.feed.entries.length, cb, []);
    data.feed.entries.forEach(e => {
      request(e.guid, (err2, res, body) => {
        e.content = cheerio.load(body)("job_description_public p").html();
        done(e);
      });
    });
  });
}

function coroflotParse(data){
  return data.map(e => {
    var companyAndTitle = e.title.match(/(.+) is seeking an? (.+)/);
    return {
      company: companyAndTitle[1],
      content: e.content,
      date: new Date(e.pubDate).getTime(),
      location: e.contentSnippet,
      source: "coroflot",
      title: companyAndTitle[2],
      url: e.guid
    };
  });
}

module.exports = {get: coroflotGet, parse: coroflotParse};
