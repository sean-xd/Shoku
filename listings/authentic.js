module.exports = {get: authenticGet, parse: authenticParse};

/**
 * Passes JSON response to callback.
 * @param {Function} cb
 */
function authenticGet(cb){
  var request = request || require("request"),
    apikey = process.env.AUTHENTIC || require("../db/apikeys").authentic,
    url = `https://authenticjobs.com/api/?api_key=${apikey}&method=aj.jobs.search&format=json&perpage=10`;
  request(url, (err, res, body) => cb(err || body));
}

/**
 * Parses JSON into job list.
 * @param {String} data
 * @returns {Array}
 */
function authenticParse(data){
  return JSON.parse(data).listings.listing.reduce((list, job) => {
    var company = job.company.name,
      content = job.description,
      date = new Date(job.post_date).getTime(),
      location = job.telecommuting ? "Remote" : job.company.location.name,
      source = "authenticjobs",
      title = job.title.split(" @")[0] || job.title,
      url = job.url;
    if(!company || !content || !date || !location || !source || !title || !url) return list;
    if(company.length < 2 || Date.now() - date > 1000 * 60 * 60 * 24 * 30) return list;
    return list.concat([{company, content, date, location, source, title, url}]);
  }, []);
}
