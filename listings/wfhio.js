var request = require("request"),
  parseString = require("xml2js").parseString,
  parseURL = require("rss-parser").parseURL;

/** @module wfhio */
module.exports = {get: wfhioGet, parse: data => data.reduce(wfhioReducer, [])};

/**
 * Passes XML response to callback.
 * @param {Function} cb
 */
function wfhioGet(cb){
  var done = Wait(3, data => cb(data.reduce((arr, e) => arr.concat(e), [])), []);
  ["1-remote-software-development", "4-remote-design", "6-remote-devops"].forEach(path => {
    request(`https://www.wfh.io/categories/${path}/jobs.atom`, (err, res, body) => {
      parseString(body, (err2, data) => done(err || err2 || data.feed.entry));
    });
  });
}

/**
 * Format job array.
 * @param {Array} list
 * @param {Object} job
 * @returns {Array}
 */
function wfhioReducer(list, job){
  var date = new Date(job.updated[0]).getTime(),
    url = job.link[0]["$"].href,
    title = job.title[0],
    titleSplit = title.toLowerCase().split(" "),
    company = url.match(/\w+\/\d+-(.+)/)[1].replace("(", "").replace(")", "").split("-")
      .reduce((arr, str) => {
        var index = titleSplit.indexOf(str), isTitle = index > -1;
        if(isTitle) titleSplit.splice(index, 1);
        return isTitle ? arr : arr.concat([str]);
      }, [])
      .map(str => str[0].toUpperCase() + str.slice(1))
      .join(" "),
    content = job.content[0]["_"],
    source = "wfhio",
    location = "Remote";
  if(!company || !content || !date || !location || !source || !title || !url) return list;
  if(company.length < 2 || Date.now() - date > 1000 * 60 * 60 * 24 * 30 || date > Date.now()) return list;
  return list.concat([{company, content, date, location, source, title, url}]);
}

function Wait(num, cb, args){
  return data => (args.length === num - 1) ? cb(args.concat([data])) : args.push(data);
}
