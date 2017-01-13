var parseURL = require("rss-parser").parseURL,
  request = require("request"),
  cheerio = require("cheerio"),
  Wait = require("../util/Wait"),
  jobChecker = require("./jobChecker");

/** @module coroflot */
module.exports = {
  get: coroflotGet,
  parser: coroflotReduce
};

/**
 * Passes modified XML response to callback.
 * @param {Function} cb
 */
function coroflotGet(cb){
  var url = "http://feeds.feedburner.com/coroflot/AllJobs?format=xml";
  parseURL(url, (err, data) => {
    if(err) return cb(err);
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
 * @param {Array} list
 * @param {Object} job
 * @returns {Array}
 */
function coroflotReduce(list, job){
  var companyAndTitle = job.title.match(/(.+) is seeking an? (.+)/),
    newJob = {
      company: companyAndTitle[1],
      content: job.content,
      date: new Date(job.pubDate).getTime(),
      location: job.contentSnippet,
      source: "coroflot",
      title: companyAndTitle[2],
      url: job.guid
    };
  return jobChecker(newJob, list);
}
