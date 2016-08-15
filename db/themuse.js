var request = require("request"),
  Magic = (num, cb, arr) => data => (arr.length === num - 1) ? cb(arr.concat([data])) : arr.push(data),
  apikey = process.env.THEMUSE || require("./apikeys.js").themuse;

module.exports = function themuse(magic){
  var inception = Magic(5, data => magic(data.reduce((arr, e) => arr.concat(e))), []);
  ["1","2","3","4","5"].forEach(i => {
    request(`https://api-v2.themuse.com/jobs?apikey=${apikey}&page=${i}`, (err, res, body) => {
      var data = JSON.parse(body).results.map(e => {
        var date = new Date(e.publication_date).getTime(),
          title = e.name,
          company = e.company.name,
          content = e.contents,
          location = e.locations.reduce((locs, loc) => locs += `${loc.name} `, "").slice(0,-1),
          url = e.refs.landing_page,
          source = "the muse",
          tags = getTags({title, content});
        return {date, title, company, content, location, url, source, tags};
      });
      inception(data);
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
