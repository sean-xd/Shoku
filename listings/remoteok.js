var request = require("request"),
  jobChecker = require("./jobChecker");

/** @module remoteok */
module.exports = {
  get: remoteokGet,
  parser: remoteokReduce
};

/**
 * Passes JSON response to callback.
 * @param {Function} cb
 */
function remoteokGet(cb){
  request("https://remoteok.io/remote-jobs.json", (err, res, body) => {
    if(body.indexOf("Fatal error") > -1) return cb([]);
    cb(JSON.parse(body));
  });
}

/**
 * Parses response into job list.
 * @param {Array} list
 * @param {Object} job
 * @returns {Array}
 */
function remoteokReduce(list, job){
  var company = job.company[0] ? job.company[0].toUpperCase() + job.company.slice(1) : "?",
    urlSplit = job.url.split("/");
  urlSplit[urlSplit.length - 2] = "l";
  if(company.length > 50) company = company.slice(0,50) + "...";
  var newJob = {
    company,
    content: job.description,
    date: new Date(job.date).getTime(),
    location: "Remote",
    source: "remoteok",
    title: job.position,
    url: urlSplit.join("/")
  };
  return jobChecker(newJob, list);
}
