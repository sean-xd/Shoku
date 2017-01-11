function wfhioGet(cb){
  var request = require("request"),
    parseString = require("xml2js").parseString,
    Magic = Magic || require("_magic"),
    done = Magic(3, data => cb(data.reduce((arr, e) => arr.concat(e), [])), []);
  ["1-remote-software-development", "4-remote-design", "6-remote-devops"].forEach(e => {
    var url = `https://www.wfh.io/categories/${e}/jobs.atom`;
    request(url, (err, res, body) => {
      parseString(body, (err2, data) => done(err2 || data.feed.entry || new Error("No Data")));
    });
  });
}

function wfhioParse(data){
  return data.map(e => {
    var date = new Date(e.updated[0]).getTime(),
      url = e.link[0]["$"].href,
      title = e.title[0],
      titleSplit = title.toLowerCase().split(" "),
      company = url.match(/\w+\/\d+-(.+)/)[1].replace("(", "").replace(")", "").split("-")
        .reduce((arr, str) => {
          var index = titleSplit.indexOf(str), isTitle = index > -1;
          if(isTitle) titleSplit.splice(index, 1);
          return isTitle ? arr : arr.concat([str]);
        }, [])
        .map(str => str[0].toUpperCase() + str.slice(1))
        .join(" "),
      content = e.content[0]["_"],
      source = "wfhio",
      location = "Remote";
    return {company, content, date, location, source, title, url};
  });
}

module.exports = {get: wfhioGet, parse: wfhioParse};
