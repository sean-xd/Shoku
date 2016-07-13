var request = require("request"),
  parseString = require("xml2js").parseString,
  getTags = require("./getTags.js");

module.exports = function coroflot(url, magic){
  request(url, (err1, response, body) => {
    parseString(body, (err2, result) => {
      result = result.rss.channel[0].item.map(e => {
        var date = new Date(e.pubDate[0]).getTime(),
          companyAndTitle = e.title[0].match(/(.+) is seeking an? (.+)/),
          title = companyAndTitle[2],
          company = companyAndTitle[1],
          content = e.description[0],
          url = e["feedburner:origLink"][0],
          source = "coroflot",
          tags = getTags({title, content});
        return {date, title, company, content, url, source, tags};
      });
      magic(result);
    });
  });
};
