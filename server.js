var fs = require("fs"),
  crypto = require("crypto"),
  spawn = require('child_process').spawn,
  express = require("express"),
  bodyParser = require("body-parser"),
  jwt = require("jsonwebtoken"),
  app = express(),
  db = require("./db/db.json"),
  users = require("./db/users.json"),
  secret = require("./db/apikeys.js").secret,
  hash = str => crypto.createHmac("sha256", secret).update(str).digest("base64"),
  isUpdated = true;

getJobs();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

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
  authUser(user, req, res);
}

function authUser(user, req, res){
  // var token = jwt.sign(email, secret, {expiresInMinutes: 60 * 24});
  user.token = {ttl: Date.now() + 1000 * 60 * 60 * 24 * 7, hash: hash(user.email + user.last)};
  fs.writeFile("./db/users.json", JSON.stringify(users), () => {
  console.log(user.name);
    res.json({user: {name: user.name}, token: user.token});
  });
}

// app.post("/myjobs", (req, res) => {
//   var token = req.body.token;
//   jwt.verify(token, secret, (err, decoded) => {
//     if(err) return res.json({user: false});
//     user =
//     req.decoded = decoded;
//     res.json({})
//   });
// });

// Jobs
app.get("/jobs", sendJobs);
app.get("/jobs/:page", sendJobs);
app.post("/jobs/update", (req, res) => {
  console.log("--- Updated Jobs ---");
  if(req.body.secret === secret) db = req.body.db;
  res.send(null);
});

function sendJobs(req, res){
  var page = req.params.page || 0, mult = 500;
  if(db.ttl < Date.now()) getJobs();
  res.send(JSON.stringify(db.jobs.slice(page * mult, (page * mult) + mult)));
}

function getJobs(){
  db.ttl = Date.now() + (1000 * 60 * 30);
  spawn("node", ["./db/getData.js"]);
}

app.listen(3000);
