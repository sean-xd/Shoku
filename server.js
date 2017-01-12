var express = require("express"),
  bodyParser = require("body-parser"),
  bearerToken = require('express-bearer-token'),
  app = express(),
  listings = require("./listings");
  db = require("../db/db.json");

listings.update(db);

app.use(express.static(__dirname + "/public"));
app.use("/tracker", express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(bearerToken());

app.get("/jobs", (req, res) => {
  if(db.ttl < Date.now()) listings.update(db);
  res.send(JSON.stringify(db.jobs));
});

require("./routes/users")(app);

app.listen(process.env.PORT || 4259);
