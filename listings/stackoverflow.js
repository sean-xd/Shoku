module.exports = {get: stackoverflowGet, parse: stackoverflowParse};

/**
 * Passes XML response to callback.
 * @param {Function} cb
 */
function stackoverflowGet(cb){
  var parseURL = parseURL || require("rss-parser").parseURL,
    url = "https://stackoverflow.com/jobs/feed";
  parseURL(url, (err, data) => cb(err || data));
}

/**
 * Parses XML into job list.
 * @param {Object} data
 * @returns {Array}
 */
function stackoverflowParse(data){
  return data.feed.entries.reduce((list, job) => {
    var loc = !!job.title.split(" at ")[1].split(" (")[1],
      titleSplit = job.title.split(" at "),
      titleSplit2 = titleSplit[1].split(" ("),
      company = titleSplit2[0] || "?",
      content = job.content,
      date = new Date(job.pubDate).getTime(),
      location = loc ? titleSplit2[1].slice(0,-1) : job.location || "N/A",
      source = "stackoverflow",
      title = titleSplit[0].split(" (")[0],
      url = job.link;
    if(!company || !content || !date || !location || !source || !title || !url) return list;
    if(company.length < 2 || Date.now() - date > 1000 * 60 * 60 * 24 * 30) return list;
    if(/ä|ö|ü|Ü|ß|ntwick/.test(job.title + job.company + job.content)) return list;
    return list.concat([{company, content, date, location, source, title, url}]);
  }, []);
}
