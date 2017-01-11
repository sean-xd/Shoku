function stackoverflowGet(cb){
  var parseURL = parseURL || require("rss-parser").parseURL,
    url = "https://stackoverflow.com/jobs/feed";
  parseURL(url, (err, data) => cb(err || data));
}

function stackoverflowParse(data){
  return data.feed.entries.map(e => {
    var loc = !!e.title.split(" at ")[1].split(" (")[1],
      titleSplit = e.title.split(" at "),
      titleSplit2 = titleSplit[1].split(" (");
    return {
      company: titleSplit2[0] || "?",
      content: e.content,
      date: new Date(e.pubDate).getTime(),
      location: loc ? titleSplit2[1].slice(0,-1) : e.location || "N/A",
      source: "stackoverflow",
      title: titleSplit[0].split(" (")[0],
      url: e.link
    };
  }).filter(e => !/ä|ö|ü|Ü|ß|ntwick/.test(e.title + e.company + e.content));
}

module.exports = {get: stackoverflowGet, parse: stackoverflowParse};
