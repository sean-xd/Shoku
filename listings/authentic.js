function authenticGet(cb){
  var request = request || require("request"),
    apikey = process.env.AUTHENTIC || require("../db/apikeys").authentic,
    url = `https://authenticjobs.com/api/?api_key=${apikey}&method=aj.jobs.search&format=json&perpage=10`;
  request(url, (err, res, body) => cb(err || body));
}

function authenticParse(data){
  return JSON.parse(data).listings.listing.map(e => {
    if(!e.company) return false;
    return {
      company: e.company.name,
      content: e.description,
      date: new Date(e.post_date).getTime(),
      location: e.telecommuting ? "Remote" : e.company.location.name,
      source: "authenticjobs",
      title: e.title.split(" @")[0] || e.title,
      url: e.url
    };
  });
}

module.exports = {get: authenticGet, parse: authenticParse};
