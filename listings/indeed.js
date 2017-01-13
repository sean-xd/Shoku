var request = require("request"),
  parseString = require("xml2js").parseString,
  apikey = process.env.INDEED || require("../db/apikeys").indeed,
  jobChecker = require("./jobChecker");

/** @module indeed */
module.exports = {
  get: indeedGet,
  parser: indeedReduce
};

/**
 * Passes API response to callback.
 * @param {Function} cb
 */
function indeedGet(cb){
  var url = `http://api.indeed.com/ads/apisearch?publisher=${apikey}&v=2&q=developer&sort=date`;
  request(url, (err, res, body) => {
    parseString(body, (err2, data) => cb(err || err2 || data.response.results[0].result));
  });
}

/**
 * Parses response into job list.
 * @param {Array} list
 * @param {Object} job
 * @returns {Array}
 */
function indeedReduce(list, job){
  var newJob = {
    company: job.company[0],
    content: job.snippet[0],
    date: new Date(job.date[0]).getTime(),
    location: job.formattedLocationFull[0],
    source: "indeed",
    title: job.jobtitle[0],
    url: job.url[0]
  };
  return jobChecker(newJob, list);
}
