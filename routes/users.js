module.exports = app => {
  var fs = require("fs"),
    crypto = require("crypto"),
    hash = str => crypto.createHmac("sha256", "ohwow").update(str).digest("base64"),
    jwt = require('jsonwebtoken'),
    users = require("../db/users.json");

  app.post("/signup", signUp);
  app.post("/signin", signIn);
  app.get("/signToken", signToken);
  app.post("/track", updateTrackedJobs);

  function signUp(req, res){
    var user = users.find(u => u.email === req.body.email);
    if(user) return res.json({user: false});
    user = {
      email: req.body.email,
      hash: hash(req.body.password),
      name: req.body.email.split("@")[0]
    };
    users.push(user);
    fs.writeFile("../db/users.json", JSON.stringify(users));
    authUser(user, req, res);
  }

  function signIn(req, res){
    var user = users.find(u => u.email === req.body.email);
    (user && user.hash === hash(req.body.password)) ? authUser(user, req, res) : res.json({user: false});
  }

  function signToken(req, res){
    jwt.verify(req.token, "lazysecret", (err, decoded) => {
      if(err) return res.send({user: false});
      var user = users.find(u => u.email === decoded.data);
      authUser(user, req, res);
    });
  }

  function authUser(user, req, res){
    res.json({
      user: {name: user.name, tracked: user.tracked},
      token: jwt.sign({data: user.email}, "lazysecret")
    });
  }

  function updateTrackedJobs(req, res){
    jwt.verify(req.body.token, "lazysecret", (err, decoded) => {
      if(err) return res.sendStatus(503);
      var user = users.find(u => u.email === decoded.data);
      user.tracked = req.body.tracked;
      fs.writeFile("../db/users.json", JSON.stringify(users));
      res.sendStatus(200);
    });
  }
};
