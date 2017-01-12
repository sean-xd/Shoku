module.exports = {get: smashingjobsGet, parse: smashingjobsParse};

/**
 * Passes XML response to callback.
 * @param {Function} cb
 */
function smashingjobsGet(cb){
  var parseURL = parseURL || require("rss-parser").parseURL,
    url = "http://jobs.smashingmagazine.com/rss/all/all";
  parseURL(url, (err, data) => cb(err || data));
}

/**
 * Parses XML object into job list.
 * @param {Object} data
 * @returns {Array}
 */
function smashingjobsParse(data){
  return data.feed.entries.reduce((list, job) => {
    var titleSplit = job.title.split(" - "),
      company = titleSplit[1],
      content = job.content,
      date = new Date(job.pubDate).getTime(),
      location = titleSplit[2],
      source = "smashingjobs",
      title = titleSplit[0].trim(),
      url = job.link;
    if(!company || !content || !date || !location || !source || !title || !url) return list;
    if(company.length < 2 || Date.now() - date > 1000 * 60 * 60 * 24 * 30) return list;
    if(/ä|ö|ü|Ü|ß|ntwick/.test(job.title + job.company + job.content)) return list;
    return list.concat([{company, content, date, location, source, title, url}]);
  }, []);
}
