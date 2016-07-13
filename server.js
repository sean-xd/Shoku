var fs = require("fs"),
  express = require("express"),
  spawn = require('child_process').spawn,
  app = express(),
  db = {},
  isUpdated = true,
  isUpdating = false;

fs.readFile("./db/db.json", (err, data) => {db = JSON.parse(data);});
getJobs();

app.use(express.static(__dirname + "/public"));
app.get("/jobs", sendJobs);
app.get("/jobs/:page", sendJobs);

function sendJobs(req, res){
  var page = req.params.page || 0,
    mult = 200;
  if(db.ttl < Date.now()) getJobs();
  else if(!isUpdated && !isUpdating) updateJobs();
  res.send(JSON.stringify(db.jobs.slice(page * mult, (page * mult) + mult)));
}

function getJobs(){
  isUpdated = false;
  db.ttl = Date.now() + (1000 * 60 * 60);
  spawn("node", ["./db/getData.js"]);
}

function updateJobs(){
  isUpdating = true;
  fs.readFile("./db/db.json", (err, data) => {
    if(JSON.stringify(db) === data) return;
    db = JSON.parse(data);
    isUpdated = true;
    isUpdating = false;
  });
}

app.listen(3000);
