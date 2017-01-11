function smashingjobsGet(cb){
  var parseURL = parseURL || require("rss-parser").parseURL,
    url = "http://jobs.smashingmagazine.com/rss/all/all";
  parseURL(url, (err, data) => cb(err || data));
}

function smashingjobsParse(data){
  return data.feed.entries.map(e => {
    var titleSplit = e.title.split(" - ");
    return {
      company: titleSplit[1],
      content: e.content,
      date: new Date(e.pubDate).getTime(),
      location: titleSplit[2],
      source: "smashingjobs",
      title: titleSplit[0].trim(),
      url: e.link
    };
  }).filter(e => !/ä|ö|ü|Ü|ß|ntwick/.test(e.title + e.company + e.content));
}

module.exports = {get: smashingjobsGet, parse: smashingjobsParse};
