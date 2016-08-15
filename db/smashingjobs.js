var parseURL = require("rss-parser").parseURL;

module.exports = function smashingjobs(magic){
  parseURL("http://jobs.smashingmagazine.com/rss/all/all", (err, data) => {
    if(!data) return magic([]);
    var result = data.feed.entries.map(e => {
      var date = new Date(e.pubDate).getTime(),
        titleSplit = e.title.split(" - "),
        title = titleSplit[0].trim(),
        company = titleSplit[1],
        location = titleSplit[2],
        content = e.content,
        url = e.link,
        source = "smashingjobs",
        tags = getTags({title, content});
      return {date, title, company, content, url, source, tags};
    });
    result = result.filter(e => !/ä|ö|ü|Ü|ß|ntwick/.test(e.title + e.company + e.content));
    magic(result);
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
