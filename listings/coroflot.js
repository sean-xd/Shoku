module.exports = {get: coroflotGet, parse: coroflotParse};

/**
 * Passes modified XML response to callback.
 * @param {Function} cb
 */
function coroflotGet(cb){
  var parseURL = parseURL || require("rss-parser").parseURL,
    request = request || require("request"),
    cheerio = cheerio || require("cheerio"),
    Magic = Magic || require("_magic"),
    url = "http://feeds.feedburner.com/coroflot/AllJobs?format=xml";
  parseURL(url, (err, data) => {
    if(!data || !data.feed || !data.feed.entries) return cb(new Error("No Data Entries"));
    var done = Magic(data.feed.entries.length, cb, []);
    data.feed.entries.forEach(job => {
      request(job.guid, (err2, res, body) => {
        job.content = cheerio.load(body)("#job_description_public p").html();
        done(job);
      });
    });
  });
}

/**
 * Parses response into job list.
 * @param {Array} data
 * @returns {Array}
 */
function coroflotParse(data){
  return data.reduce((list, job) => {
    var companyAndTitle = job.title.match(/(.+) is seeking an? (.+)/),
      company = companyAndTitle[1],
      content = job.content,
      date = new Date(job.pubDate).getTime(),
      location = job.contentSnippet,
      source = "coroflot",
      title = companyAndTitle[2],
      url = job.guid;
    if(!company || !content || !date || !location || !source || !title || !url) return list;
    if(company.length < 2 || Date.now() - date > 1000 * 60 * 60 * 24 * 30) return list;
    return list.concat([{company, content, date, location, source, title, url}]);
  }, []);
}
