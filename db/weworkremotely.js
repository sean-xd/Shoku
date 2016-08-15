var parseURL = require("rss-parser").parseURL,
  Magic = (num, cb, arr) => data => (arr.length === num - 1) ? cb(arr.concat([data])) : arr.push(data),
  urls = ["1-design", "2-programming"];

module.exports = function weworkremotely(magic){
  var inception = Magic(urls.length, data => {
    var result = data.reduce((arr, e) => arr.concat(e), []);
    magic(result);
  }, []);
  urls.forEach(path => {
    parseURL(`https://weworkremotely.com/categories/${path}/jobs.rss`, (err, data) => {
      var result = data.feed.entries.map(e => {
        var date = new Date(e.pubDate).getTime(),
          title = e.title.split(": ")[1],
          company = e.title.split(": ")[0],
          content = e.content,
          url = e.link,
          source = "weworkremotely",
          tags = getTags({title, content});
        if(company.length > 50) company = company.slice(0,50) + "...";
        return {date, title, company, content, url, source, tags};
      });
      inception(result);
    });
  });
};

function getTags(obj){
 var content = obj.content.toLowerCase(),
   title = obj.title.toLowerCase(),
   tags = ["javascript", "developer", "designer", "engineer", "aws", "full stack", "ios",
     "rails", "python", "android", "node", "react", "angular", ".net", "manager", "java"];
 return tags.filter(tag => {
   if(tag === "java"){
     content = content.replace(/javascript/g, "");
     title = title.replace(/javascript/g, "");
   }
   return content.indexOf(tag) > -1 || title.indexOf(tag) > -1;
 });
}
