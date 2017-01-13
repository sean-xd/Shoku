var parseURL = require("rss-parser").parseURL,
  jobChecker = require("./jobChecker");

/** @module smashingjobs */
module.exports = {
  get: smashingjobsGet,
  parser: smashingjobsReduce
};

/**
 * Passes XML response to callback.
 * @param {Function} cb
 */
function smashingjobsGet(cb){
  var url = "http://jobs.smashingmagazine.com/rss/all/all";
  parseURL(url, (err, data) => cb(err || data.feed.entries));
}

/**
 * Parses response into job list.
 * @param {Array} list
 * @param {Object} job
 * @returns {Array}
 */
function smashingjobsReduce(list, job){
  var titleSplit = job.title.split(" - "),
    newJob = {
      company: titleSplit[1],
      content: job.content,
      date: new Date(job.pubDate).getTime(),
      location: titleSplit[2],
      source: "smashingjobs",
      title: titleSplit[0].trim(),
      url: job.link
    };
  return jobChecker(newJob, list);
}
