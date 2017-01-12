module.exports = {get: weworkremotelyGet, parse: weworkremotelyParse};

/**
 * Passes RSS response to callback.
 * @param {Function} cb
 */
function weworkremotelyGet(cb){
  var parseURL = parseURL || require("rss-parser").parseURL,
    Magic = Magic || require("_magic"),
    done = Magic(2, data => cb(data[0].feed.entries.concat(data[1].feed.entries)), []);
  ["1-design", "2-programming"].forEach(e => {
    var url = `https://weworkremotely.com/categories/${e}/jobs.rss`;
    parseURL(url, (err, data) => done(err || data || new Error("No Data")));
  });
}

/**
 * Parses RSS array into job list.
 * @param {Array} data
 * @returns {Array}
 */
function weworkremotelyParse(data){
  return data.reduce((list, job) => {
    var company = job.title.split(": ")[0],
      content = job.content,
      date = new Date(job.pubDate).getTime(),
      location = "Remote",
      source = "weworkremotely",
      title = job.title.split(": ")[1],
      url = job.link;
    if(company.length > 50) company = company.slice(0,50) + "...";
    if(!company || !content || !date || !location || !source || !title || !url) return list;
    if(company.length < 2 || Date.now() - date > 1000 * 60 * 60 * 24 * 30 || date > Date.now()) return list;
    return list.concat([{company, content, date, location, source, title, url}]);
  }, []);
}
