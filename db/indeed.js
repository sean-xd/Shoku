var request = require("request"),
  parseString = require("xml2js").parseString,
  apikey = process.env.INDEED || require("./apikeys.js").indeed;

module.exports = function indeed(magic){
  request(`http://api.indeed.com/ads/apisearch?publisher=${apikey}&v=2&q=developer&sort=date`, (err1, res, body) => {
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
