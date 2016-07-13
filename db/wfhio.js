var request = require("request"),
  parseString = require("xml2js").parseString,
  getTags = require("./getTags.js");

module.exports = function wfhio(url, magic){
  request(url, (err1, response, body) => {
    parseString(body, (err2, result) => {
      result = result.feed.entry.map(e => {
        var date = new Date(e.updated[0]).getTime(),
          url = e.link[0]["$"].href,
          title = e.title[0],
          titleSplit = title.toLowerCase().split(" "),
          company = url.match(/\w+\/\d+-(.+)/)[1].replace("(", "").replace(")", "").split("-")
            .reduce((arr, str) => {
              var index = titleSplit.indexOf(str), isTitle = index > -1;
              if(isTitle) titleSplit.splice(index, 1);
              return isTitle ? arr : arr.concat([str]);
            }, [])
            .map(str => str[0].toUpperCase() + str.slice(1))
            .join(" "),
          content = e.content[0]["_"],
          source = "wfhio",
          tags = getTags({title, content});
        return {date, title, company, content, url, source, tags};
      });
      magic(result);
    });
  });
};
