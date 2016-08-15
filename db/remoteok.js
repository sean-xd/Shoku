var request = require("request"),
  getTags = require(__dirname + "/getTags.js");

module.exports = function remoteok(magic){
  request("https://remoteok.io/index.json", (e, r, body) => {
    var result = JSON.parse(body).map(obj => {
      var date = new Date(obj.date).getTime(),
        title = obj.position,
        company = obj.company[0] ? obj.company[0].toUpperCase() + obj.company.slice(1) : "?",
        content = obj.description,
        urlSplit = obj.url.split("/");
      urlSplit[urlSplit.length - 2] = "l";
      var url = urlSplit.join("/"),
        source = "remoteok",
        tags = getTags({title, content});
      if(company.length > 50) company = company.slice(0,50) + "...";
      if(!title || !company || !content) return false;
      return {date, title, company, content, url, source, tags};
    });
    result = result.filter(e => e);
    result = result.filter(e => e.date < Date.now());
    magic(result);
  });
};
