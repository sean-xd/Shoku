var request = require("request"),
  getTags = require("./getTags.js");

module.exports = function github(magic){
  request("https://jobs.github.com/positions.json", (e, r, body) => {
    var result = JSON.parse(body).map(e => {
      var date = new Date(e.created_at).getTime(),
        title = e.title,
        company = e.company,
        content = e.description,
        url = e.url,
        source = "github",
        tags = getTags({title, content});
      return {date, title, company, content, url, source, tags};
    });
    result = result.filter(e => e.date < Date.now());
    magic(result);
  });
};
