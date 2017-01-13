var request = require("request"),
  apikey = process.env.AUTHENTIC || require("../db/apikeys").authentic, // eslint-disable-line no-use-before-define
  jobChecker = require("./jobChecker");

/** @module authentic */
module.exports = {
  get: authenticGet,
  parser: authenticReduce
};

/**
 * Passes JSON response to callback.
 * @param {Function} cb
 */
function authenticGet(cb){
  var url = `https://authenticjobs.com/api/?api_key=${apikey}&method=aj.jobs.search&format=json&perpage=10`;
  request(url, (err, res, body) => cb(err || JSON.parse(body).listings.listing));
}

/**
 * Parses response into job list.
 * @param {Array} list
 * @param {Object} job
 * @returns {Array}
 */
function authenticReduce(list, job){
  var newJob = {
    company: job.company.name,
    content: job.description,
    date: new Date(job.post_date).getTime(),
    location: job.telecommuting ? "Remote" : job.company.location.name,
    source: "authenticjobs",
    title: job.title.split(" @")[0] || job.title,
    url: job.url
  };
  return jobChecker(newJob, list);
}
