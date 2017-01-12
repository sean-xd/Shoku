module.exports = {get: wfhioGet, parse: wfhioParse};

/**
 * Passes XML response to callback.
 * @param {Function} cb
 */
function wfhioGet(cb){
  var request = require("request"),
    parseString = require("xml2js").parseString,
    parseURL = require("rss-parser").parseURL,
    Magic = Magic || require("_magic"),
    done = Magic(3, data => cb(data.reduce((arr, e) => arr.concat(e), [])), []);
  ["1-remote-software-development", "4-remote-design", "6-remote-devops"].forEach(e => {
    var url = `https://www.wfh.io/categories/${e}/jobs.atom`;
    request(url, (err, res, body) => {
      parseString(body, (err2, data) => done(err2 || data.feed.entry || new Error("No Data")));
    });
  });
}

/**
 * Parses array into job list.
 * @param {Array} data
 * @returns {Array}
 */
function wfhioParse(data){
  return data.reduce((list, job) => {
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
  }, []);
}
