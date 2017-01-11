function weworkremotelyGet(cb){
  var parseURL = parseURL || require("rss-parser").parseURL,
    Magic = Magic || require("_magic"),
    done = Magic(2, data => cb(data[0].feed.entries.concat(data[1].feed.entries)), []);
  ["1-design", "2-programming"].forEach(e => {
    var url = `https://weworkremotely.com/categories/${e}/jobs.rss`;
    parseURL(url, (err, data) => done(err || data || new Error("No Data")));
  });
}

function weworkremotelyParse(data){
  return data.map(e => {
    var company = e.title.split(": ")[0];
    if(company.length > 50) company = company.slice(0,50) + "...";
    return {
      company: company,
      content: e.content,
      date: new Date(e.pubDate).getTime(),
      location: "Remote",
      source: "weworkremotely",
      title: e.title.split(": ")[1],
      url: e.link,
    };
  });
}

module.exports = {get: weworkremotelyGet, parse: weworkremotelyParse};
