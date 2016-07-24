// var request = require("request"),
//   cheerio = require("cheerio"),
//   Magic = (num, cb, arr) => data => (arr.length === num - 1) ? cb(arr.concat([data])) : arr.push(data);

var request = require("request"),
  parseString = require("xml2js").parseString,
  getTags = require("./db/getTags.js"),
  Magic = (num, cb, arr) => data => (arr.length === num - 1) ? cb(arr.concat([data])) : arr.push(data),
  urls = ["1-remote-software-development", "4-remote-design", "6-remote-devops"];

function wfhio(magic){
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

wfhio(pushJobs);

function pushJobs(e){console.log(e[0]);}

// function hackernews(url, magic){
//   request(url, (err, response, body) => {
//     var ids = JSON.parse(body).submitted.slice(0,3);
//     ids.forEach(id => {
//       request(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, (err2, res2, body2) => {
//         var thread = JSON.parse(body2);
//         if(thread.title.indexOf("hiring") === -1) return;
//         var inception = Magic(thread.kids.length, magic, []);
//         thread.kids.forEach(e => {
//           request(`https://hacker-news.firebaseio.com/v0/item/${e}.json`, (err3, res3, body3) => {
//             var job = body3;
//             inception(job);
//           });
//         });
//       });
//     });
//   });
// }
//
// hackernews("https://hacker-news.firebaseio.com/v0/user/whoishiring.json", e => console.log(e[0]));

// function remotive(url, magic){
//   request(url, (err, res, body) => {
//     var $ = cheerio.load(body);
//     magic(data);
//   });
// }
//
// remotive("http://jobs.remotive.io/", e => console.log(e[0]));
