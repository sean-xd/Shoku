function githubGet(cb){
  var request = request || require("request"),
    url = "https://jobs.github.com/positions.json";
  request(url, (err, res, body) => cb(err || body));
}

function githubParse(data){
  return JSON.parse(data).map(e => {
    return {
      company: e.company,
      content: e.description.replace(/https:\/+w+\.applytracking\.com\/track\.aspx\/[A-z0-9]+/g, ""),
      date: new Date(e.created_at).getTime(),
      source: "github",
      title: e.title,
      url: e.url
    };
  }).filter(e => e.date < Date.now());
}

module.exports = {get: githubGet, parse: githubParse};
