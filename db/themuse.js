var request = require("request"),
  Magic = (num, cb, arr) => data => (arr.length === num - 1) ? cb(arr.concat([data])) : arr.push(data),
  getTags = require("./getTags.js"),
  apikey = process.env.THEMUSE || require("./apikeys.js").themuse;

module.exports = function themuse(magic){
  var inception = Magic(5, data => magic(data.reduce((arr, e) => arr.concat(e))), []);
  ["1","2","3","4","5"].forEach(i => {
    request(`https://api-v2.themuse.com/jobs?apikey=${apikey}&page=${i}`, (err, res, body) => {
      var data = JSON.parse(body).results.map(e => {
        var date = new Date(e.publication_date).getTime(),
          title = e.name,
          company = e.company.name,
          content = e.contents,
          location = e.locations.reduce((locs, loc) => locs += `${loc.name} `, "").slice(0,-1),
          url = e.refs.landing_page,
          source = "the muse",
          tags = getTags({title, content});
        return {date, title, company, content, location, url, source, tags};
      });
      inception(data);
    });
  });
};
