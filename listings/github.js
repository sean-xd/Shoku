var request = require("request"),
  jobChecker = require("./jobChecker");

/** @module github */
module.exports = {
  get: githubGet,
  parser: githubReduce
};

/**
 * Passes JSON response to callback.
 * @param {Function} cb
 */
function githubGet(cb){
  request("https://jobs.github.com/positions.json", (err, res, body) => cb(err || JSON.parse(body)));
}

/**
 * Parses response into job list.
 * @param {Array} list
 * @param {Object} job
 * @returns {Array}
 */
function githubReduce(list, job){
  var newJob = {
    company: job.company,
    content: job.description.replace(/https:\/+w+\.applytracking\.com\/track\.aspx\/[A-z0-9]+/g, ""),
    date: new Date(job.created_at).getTime(),
    location: job.location,
    source: "github",
    title: job.title,
    url: job.url
  };
  return jobChecker(newJob, list);
}
