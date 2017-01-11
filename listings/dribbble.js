function dribbbleGet(cb){
  var parseURL = parseURL || require("rss-parser").parseURL,
    url = "https://dribbble.com/jobs.rss";
  parseURL(url, (err, data) => cb(err || data || new Error("No Data")));
}

function dribbbleParse(data){
  return data.feed.entries.map(e => {
    var titleReg = e.title.match(/(.+) is hiring an? (.+)/),
      delimiter = titleReg[2].indexOf(" in ") > -1 ? " in " : " anywhere",
      titleSplit = titleReg[2].split(delimiter);
    return {
      company: titleReg[1],
      content: e.title,
      date: new Date(e.pubDate).getTime(),
      location: titleSplit.length > 2 ? titleSplit.slice(1).join(" in ") : titleSplit[1],
      source: "dribbble",
      title: titleSplit[0],
      url: e.link,
    };
  });
}

module.exports = {get: dribbbleGet, parse: dribbbleParse};
