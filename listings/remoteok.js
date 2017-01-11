function remoteokGet(cb){
  var request = request || require("request"),
    url = "https://remoteok.io/remote-jobs.json";
  request(url, (err, res, body) => cb(err || body));
}

function remoteokParse(data){
  return JSON.parse(data).map(e => {
    var urlSplit = e.url.split("/"),
      company = e.company[0] ? e.company[0].toUpperCase() + e.company.slice(1) : "?";
    if(company.length > 50) company = company.slice(0,50) + "...";
    urlSplit[urlSplit.length - 2] = "l";
    if(!e.position || !e.company || !e.description) return false;
    return {
      company: company,
      content: e.description,
      date: new Date(e.date).getTime(),
      source: "remoteok",
      title: e.position,
      url: urlSplit.join("/")
    };
  }).filter(e => e && e.date < Date.now());
}

module.exports = {get: remoteokGet, parse: remoteokParse};
