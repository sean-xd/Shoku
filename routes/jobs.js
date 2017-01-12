// Jobs
module.exports = app => {
  var fs = require("fs"),
    db = require("../db/db.json"),
    listings = require("../listings");

  app.get("/jobs", sendJobs);
  app.get("/jobs/:page", sendJobs);

  getJobs();

  function getJobs(){
    db.ttl = Date.now() + (1000 * 60 * 15);
    listings.get(data => {
      db.jobs = listings.parse(data);
      fs.writeFile("../db.json", JSON.stringify(db));
    });
  }

  function sendJobs(req, res){
    if(db.ttl < Date.now()) getJobs();
    res.send(JSON.stringify(db.jobs));
  }
};
