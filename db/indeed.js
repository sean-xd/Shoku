var request = require("request"),
  parseString = require("xml2js").parseString,
  getTags = require("./getTags.js");

module.exports = function indeed(url, magic){
  request(url, (err1, res, body) => {
    parseString(body, (err2, data) => {
      var result = data.response.results[0].result.map(e => {
        var date = new Date(e.date[0]).getTime(),
          title = e.jobtitle[0],
          company = e.company[0],
          content = e.snippet[0],
          location = e.formattedLocationFull[0],
          url = e.url[0],
          source = "indeed",
          tags = getTags({title, content});
        return {date, title, company, content, location, url, source, tags};
      });
      magic(result);
    });
  });
};
