/** @module remoteok */
module.exports = {get: remoteokGet, parse: remoteokParse};

/**
 * Passes JSON response to callback.
 * @param {Function} cb
 */
function remoteokGet(cb){
  var request = request || require("request"),
    url = "https://remoteok.io/remote-jobs.json";
  request(url, (err, res, body) => cb(err || body));
}

/**
 * Parses JSON into job list.
 * @param {String} data
 * @returns {Array}
 */
function remoteokParse(data){
  return JSON.parse(data).reduce((list, job) => {
    var urlSplit = job.url.split("/");
    urlSplit[urlSplit.length - 2] = "l";
    var company = job.company[0] ? job.company[0].toUpperCase() + job.company.slice(1) : "?",
      content = job.description,
      date = new Date(job.date).getTime(),
      location = "Remote",
      source = "remoteok",
      title = job.position,
      url = urlSplit.join("/");
    if(company.length > 50) company = company.slice(0,50) + "...";
    if(!company || !content || !date || !location || !source || !title || !url) return list;
    if(company.length < 2 || Date.now() - date > 1000 * 60 * 60 * 24 * 30 || date > Date.now()) return list;
    return list.concat([{company, content, date, location, source, title, url}]);
  }, []);
}
