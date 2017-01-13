var parseURL = require("rss-parser").parseURL,
  Wait = require("../util/Wait"),
  jobChecker = require("./jobChecker");

/** @module weworkremotely */
module.exports = {
  get: weworkremotelyGet,
  parser: weworkremotelyReduce
};

/**
 * Passes RSS response to callback.
 * @param {Function} cb
 */
function weworkremotelyGet(cb){
  var done = Wait(2, data => cb(data[0].feed.entries.concat(data[1].feed.entries)), []);
  ["1-design", "2-programming"].forEach(e => {
    var url = `https://weworkremotely.com/categories/${e}/jobs.rss`;
    parseURL(url, (err, data) => done(err || data));
  });
}

/**
 * Parses response into job list.
 * @param {Array} list
 * @param {Object} job
 * @returns {Array}
 */
function weworkremotelyReduce(list, job){
  var company = job.title.split(": ")[0];
  if(company.length > 50) company = company.slice(0,50) + "...";
  var newJob = {
    company,
    content: job.content,
    date: new Date(job.pubDate).getTime(),
    location: "Remote",
    source: "weworkremotely",
    title: job.title.split(": ")[1],
    url: job.link
  };
  return jobChecker(newJob, list);
}
