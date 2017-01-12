var parseURL = require("rss-parser").parseURL,
  request = require("request"),
  cheerio = require("cheerio"),
  Wait = require("../util/Wait"),
  jobChecker = require("./jobChecker");

/** @module coroflot */
module.exports = {get: coroflotGet, parse: data => data.reduce(coroflotReducer, [])};

/**
 * Passes modified XML response to callback.
 * @param {Function} cb
 */
function coroflotGet(cb){
  var url = "http://feeds.feedburner.com/coroflot/AllJobs?format=xml";
  parseURL(url, (err, data) => {
    if(err || !data || !data.feed || !data.feed.entries) return cb(new Error("No Data Entries"));
    var done = Wait(data.feed.entries.length, cb, []);
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
function coroflotReducer(list, job){
  var companyAndTitle = job.title.match(/(.+) is seeking an? (.+)/),
    company = companyAndTitle[1],
    content = job.content,
    date = new Date(job.pubDate).getTime(),
    location = job.contentSnippet,
    source = "coroflot",
    title = companyAndTitle[2],
    url = job.guid;
  return jobChecker({company, content, date, location, source, title, url}, list);
}
