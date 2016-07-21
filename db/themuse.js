var request = require("request"),
  Magic = (num, cb, arr) => data => (arr.length === num - 1) ? cb(arr.concat([data])) : arr.push(data),
  getTags = require("./getTags.js");

module.exports = function themuse(url, magic){
  var inception = Magic(5, data => magic(data.reduce((arr, e) => arr.concat(e))), []);
  [1,2,3,4,5].forEach(i => {
    var _url = url + i;
    request(_url, (err, res, body) => {
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
