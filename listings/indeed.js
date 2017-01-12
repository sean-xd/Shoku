/** @module indeed */
module.exports = {get: indeedGet, parse: indeedParse};

/**
 * Passes API response to callback.
 * @param {Function} cb
 */
function indeedGet(cb){
  var request = request || require("request"),
    parseString = parseString || require("xml2js").parseString,
    apikey = process.env.INDEED || require("../db/apikeys").indeed,
    url = `http://api.indeed.com/ads/apisearch?publisher=${apikey}&v=2&q=developer&sort=date`;
  request(url, (err, res, body) => parseString(body, (err2, data) => cb(err || err2 || data)));
}

/**
 * Parses response into job list.
 * @param {Object} data
 * @returns {Array}
 */
function indeedParse(data){
  return data.response.results[0].result.reduce((list, job) => {
    var company = job.company[0],
      content = job.snippet[0],
      date = new Date(job.date[0]).getTime(),
      location = job.formattedLocationFull[0],
      source = "indeed",
      title = job.jobtitle[0],
      url = job.url[0];
    if(!company || !content || !date || !location || !source || !title || !url) return list;
    if(company.length < 2 || Date.now() - date > 1000 * 60 * 60 * 24 * 30) return list;
    return list.concat([{company, content, date, location, source, title, url}]);
  }, []);
}
