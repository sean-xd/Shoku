var request = require("request"),
  cheerio = require("cheerio"),
  Magic = (num, cb, arr) => data => (arr.length === num - 1) ? cb(arr.concat([data])) : arr.push(data);



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
