var fs = require("fs"),
  express = require("express"),
  bodyParser = require("body-parser"),
  bearerToken = require('express-bearer-token'),
  app = express();

app.use(express.static(__dirname + "/public"));
app.use("/tracker", express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(bearerToken());

require("./routes/jobs")(app);
require("./routes/users")(app);

app.listen(process.env.PORT || 4259);
