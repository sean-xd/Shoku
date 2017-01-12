module.exports = {get: dribbbleGet, parse: dribbbleParse};

/**
 * Passes RSS response to callback.
 * @param {Function} cb
 */
function dribbbleGet(cb){
  var parseURL = parseURL || require("rss-parser").parseURL,
    url = "https://dribbble.com/jobs.rss";
  parseURL(url, (err, data) => cb(err || data || new Error("No Data")));
}

/**
 * Parses RSS response into job list.
 * @param {Object} data
 * @returns {Array}
 */
function dribbbleParse(data){
  return data.feed.entries.reduce((list, job) => {
    var titleReg = job.title.match(/(.+) is hiring an? (.+)/),
      delimiter = titleReg[2].indexOf(" in ") > -1 ? " in " : " anywhere",
      titleSplit = titleReg[2].split(delimiter),
      company = titleReg[1],
      content = job.title,
      date = new Date(job.pubDate).getTime(),
      location = titleSplit.length > 2 ? titleSplit.slice(1).join(" in ") : titleSplit[1],
      source = "dribbble",
      title = titleSplit[0],
      url = job.link;
    if(!company || !content || !date || !location || !source || !title || !url) return list;
    if(company.length < 2 || Date.now() - date > 1000 * 60 * 60 * 24 * 30) return list;
    return list.concat([{company, content, date, location, source, title, url}]);
  }, []);
}
