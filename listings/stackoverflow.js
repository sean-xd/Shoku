var parseURL = require("rss-parser").parseURL,
  jobChecker = require("./jobChecker");

/** @module stackoverflow */
module.exports = {
  get: stackoverflowGet,
  parser: stackoverflowReduce
};

/**
 * Passes XML response to callback.
 * @param {Function} cb
 */
function stackoverflowGet(cb){
  parseURL("https://stackoverflow.com/jobs/feed", (err, data) => cb(err || data.feed.entries));
}

/**
 * Parses response into job list.
 * @param {Array} list
 * @param {Object} job
 * @returns {Array}
 */
function stackoverflowReduce(list, job){
  var loc = !!job.title.split(" at ")[1].split(" (")[1],
    titleSplit = job.title.split(" at "),
    titleSplit2 = titleSplit[1].split(" ("),
    newJob = {
      company: titleSplit2[0] || "?",
      content: job.content,
      date: new Date(job.pubDate).getTime(),
      location: loc ? titleSplit2[1].slice(0,-1) : job.location || "N/A",
      source: "stackoverflow",
      title: titleSplit[0].split(" (")[0],
      url: job.link
    };
  return jobChecker(newJob, list);
}
