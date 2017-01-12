module.exports = {get: githubGet, parse: githubParse};

/**
 * Passes JSON response to callback.
 * @param {Function} cb
 */
function githubGet(cb){
  var request = request || require("request"),
    url = "https://jobs.github.com/positions.json";
  request(url, (err, res, body) => cb(err || body));
}

/**
 * Parses JSON into job list.
 * @param {String} data
 * @returns {Array}
 */
function githubParse(data){
  return JSON.parse(data).reduce((list, job) => {
    var company = job.company,
      content = job.description.replace(/https:\/+w+\.applytracking\.com\/track\.aspx\/[A-z0-9]+/g, ""),
      date = new Date(job.created_at).getTime(),
      location = job.location,
      source = "github",
      title = job.title,
      url = job.url;
    if(!company || !content || !date || !location || !source || !title || !url) return list;
    if(company.length < 2 || Date.now() - date > 1000 * 60 * 60 * 24 * 30 || date > Date.now()) return list;
    return list.concat([{company, content, date, location, source, title, url}]);
  }, []);
}
