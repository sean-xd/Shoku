var fs = require("fs"),
  express = require("express"),
  bodyParser = require("body-parser"),
  bearerToken = require('express-bearer-token'),
  app = express(),
  updateListings = require("./listings");
  db = require("./db/db.json");

updateListings(db);

app.use(express.static(__dirname + "/public")); // eslint-disable-line no-use-before-define
app.use("/tracker", express.static(__dirname + "/public")); // eslint-disable-line no-use-before-define
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(bearerToken());

app.get("/jobs", (req, res) => {
  if(db.ttl < Date.now()) updateListings(db, () => fs.writeFile("../db.json", JSON.stringify(db)));
  res.send(JSON.stringify(db.companies));
});

require("./routes/users")(app);

app.listen(process.env.PORT || 4259);
