var parseURL = require("rss-parser").parseURL,
  jobChecker = require("./jobChecker");

/** @module dribbble */
module.exports = {
  get: dribbbleGet,
  parser: dribbbleReduce
};

/**
 * Passes RSS response to callback.
 * @param {Function} cb
 */
function dribbbleGet(cb){
  parseURL("https://dribbble.com/jobs.rss", (err, data) => cb(err || data.feed.entries));
}

/**
 * Parses response into job list.
 * @param {Array} list
 * @param {Object} job
 * @returns {Array}
 */
function dribbbleReduce(list, job){
  var titleReg = job.title.match(/(.+) is hiring an? (.+)/),
    delimiter = titleReg[2].indexOf(" in ") > -1 ? " in " : " anywhere",
    titleSplit = titleReg[2].split(delimiter),
    newJob = {
      company: titleReg[1],
      content: job.title,
      date: new Date(job.pubDate).getTime(),
      location: titleSplit.length > 2 ? titleSplit.slice(1).join(" in ") : titleSplit[1],
      source: "dribbble",
      title: titleSplit[0],
      url: job.link
    };
  return jobChecker(newJob, list);
}
