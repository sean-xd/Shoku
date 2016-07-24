var request = require("request"),
  parseString = require("xml2js").parseString,
  getTags = require("./getTags.js"),
  Magic = (num, cb, arr) => data => (arr.length === num - 1) ? cb(arr.concat([data])) : arr.push(data),
  urls = ["1-remote-software-development", "4-remote-design", "6-remote-devops"];

module.exports = function wfhio(magic){
  var inception = Magic(urls.length, data => {
    var result = data.reduce((arr, e) => arr.concat(e), []);
    magic(result);
  }, []);
  urls.forEach(path => {
    request(`https://www.wfh.io/categories/${path}/jobs.atom`, (err1, response, body) => {
      parseString(body, (err2, result) => {
        if(!result.feed) magic([]);
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
        inception(result);
      });
    });
  });
};
