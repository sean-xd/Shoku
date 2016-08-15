var fs = require("fs"),
  crypto = require("crypto"),
  express = require("express"),
  bodyParser = require("body-parser"),
  jwt = require('jsonwebtoken'),
  bearerToken = require('express-bearer-token'),
  jwt = require("jsonwebtoken"),
  app = express(),
  db = require(__dirname + "/db/db.json"),
  users = require(__dirname + "/db/users.json"),
  hash = str => crypto.createHmac("sha256", "ohwow").update(str).digest("base64"),
  getJobs = require("./db/getJobs.js");

getJobs(db);

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(bearerToken());

// Jobs
app.get("/jobs", sendJobs);
app.get("/jobs/:page", sendJobs);

function sendJobs(req, res){
  var page = req.params.page || 0, mult = 100;
  if(db.ttl < Date.now()) getJobs(db);
  res.send(JSON.stringify(db.jobs.slice(page * mult, (page * mult) + mult)));
}

// Users
app.post("/signup", (req, res) => {
  var user = users.find(u => u.email === req.body.email);
  !user ? createUser(req, res) : res.json({user: false});
});

app.post("/signin", (req, res) => {
  var user = users.find(u => u.email === req.body.email);
  (user && user.hash === hash(req.body.password)) ? authUser(user, req, res) : res.json({user: false});
});

function createUser(req, res){
  var user = {
    email: req.body.email,
    hash: hash(req.body.password),
    name: req.body.email.split("@")[0]
  };
  users.push(user);
  fs.writeFile("./db/users.json", JSON.stringify(users));
  authUser(user, req, res);
}

function authUser(user, req, res){
  res.json({user: {name: user.name}, token: jwt.sign({data: user.email}, "lazysecret")});
}

app.get("/signToken", (req, res) => {
  jwt.verify(req.token, "lazysecret", (err, decoded) => {
    if(err) return res.send({user: false});
    var user = users.find(u => u.email === decoded.data);
    res.json({user: {name: user.name}});
  });
});

app.listen(process.env.PORT || 3000);
