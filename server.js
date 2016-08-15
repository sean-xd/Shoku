var fs = require("fs"),
  crypto = require("crypto"),
  spawn = require('child_process').spawn,
  express = require("express"),
  bodyParser = require("body-parser"),
  jwt = require('jsonwebtoken'),
  bearerToken = require('express-bearer-token'),
  request = require("request"),
  jwt = require("jsonwebtoken"),
  app = express(),
  db = require(__dirname + "/db/db.json"),
  users = require(__dirname + "/db/users.json"),
  secret = process.env.SECRET || require("./db/apikeys.js").secret,
  timer = {time: 0},
  hash = str => crypto.createHmac("sha256", secret).update(str).digest("base64"),
  since = () => (Date.now() - timer.time) / 1000,
  Magic = (num, cb, arr) => data => (arr.length === num - 1) ? cb(arr.concat([data])) : arr.push(data),
  sources = [
    "wfhio", "weworkremotely", "remoteok", "coroflot",
    "stackoverflow", "github", "smashingjobs", "dribbble",
    "jobspresso", "themuse", "indeed", "authenticjobs"
  ];

getJobs();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(bearerToken());

// Jobs
app.get("/jobs", sendJobs);
app.get("/jobs/:page", sendJobs);

function sendJobs(req, res){
  var page = req.params.page || 0, mult = 100;
  if(db.ttl < Date.now()) getJobs();
  res.send(JSON.stringify(db.jobs.slice(page * mult, (page * mult) + mult)));
}

function getJobs(){
  console.log("--- Get Jobs > ---");
  timer.time = Date.now();
  db.ttl = Date.now() + (1000 * 60 * 30);

  var pushJobs = Magic(sources.length, data => {
    console.log(`--- > Get Jobs ${since()} ---`);
    db.jobs = data
      .reduce(reduceJobs, [])
      .sort((a, b) => b.date - a.date)
      .reduce(reduceCompanies, []);
    fs.writeFile(__dirname + "/db/db.json", JSON.stringify(db));
  }, []);
  sources.forEach(name => require(`${__dirname}/db/${name}.js`)(pushJobs));
}

function reduceJobs(arr, jobs){
  jobs.forEach(job => {
    var match = arr.find(e => {
      var company = (job.company.length < 2) ? e.company[0] : e.company,
        companyCheck = company === job.company,
        titleCheck = e.title === job.title;
      return companyCheck && titleCheck;
    });
    if(!match && Date.now() - job.date < (1000 * 60 * 60 * 24 * 14)) arr.push(job);
  });
  return arr;
}

function reduceCompanies(arr, job){
  var company = arr.find(e => e.name === job.company) || {name: job.company, jobs: [], latest: 0},
    isntDupe = !company.jobs.find(e => e.title.indexOf(job.title) > -1 || job.title.indexOf(e.title) > -1);
  if(!company.latest) arr.push(company);
  if(job.date > company.latest) company.latest = job.date;
  if(isntDupe) company.jobs.push(job);
  return arr;
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
  authUser(user, req, res);
}

function authUser(user, req, res){
  res.json({user: {name: user.name}, token: jwt.sign({data: user.email}, "lazysecret")});
  // user.token = {ttl: Date.now() + 1000 * 60 * 60 * 24 * 7, hash: hash(user.email + user.last)};
  // fs.writeFile("./db/users.json", JSON.stringify(users), () => {
  //   res.json({user: {name: user.name}, token: user.token});
  // });
}

app.get("/signToken", (req, res) => {
  jwt.verify(req.token, "lazysecret", (err, decoded) => {
    if(err) return res.send({user: false});
    var user = users.find(u => u.email === decoded.data);
    res.json({user: {name: user.name}});
  });
});


app.listen(process.env.PORT || 3000);
