var request = require("request");

module.exports = function github(magic){
  request("https://jobs.github.com/positions.json", (e, r, body) => {
    var result = JSON.parse(body).map(e => {
      var date = new Date(e.created_at).getTime(),
        title = e.title,
        company = e.company,
        content = e.description,
        url = e.url,
        source = "github",
        tags = getTags({title, content});
      return {date, title, company, content, url, source, tags};
    });
    result = result.filter(e => e.date < Date.now());
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
