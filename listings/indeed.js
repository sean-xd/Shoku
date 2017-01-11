function indeedGet(cb){
  var request = request || require("request"),
    parseString = parseString || require("xml2js").parseString,
    apikey = process.env.INDEED || require("../db/apikeys").indeed,
    url = `http://api.indeed.com/ads/apisearch?publisher=${apikey}&v=2&q=developer&sort=date`;
  request(url, (err, res, body) => parseString(body, (err2, data) => cb(err || err2 || data)));
}

function indeedParse(data){
  return data.response.results[0].result.map(e => {
    return {
      company: e.company[0],
      content: e.snippet[0],
      date: new Date(e.date[0]).getTime(),
      location: e.formattedLocationFull[0],
      source: "indeed",
      title: e.jobtitle[0],
      url: e.url[0]
    };
  });
}

module.exports = {get: indeedGet, parse: indeedParse};
