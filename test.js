var request = require("request"),
  parseString = require('xml2js').parseString,
  parseURL = require('rss-parser').parseURL;

// request("http://www.workingnomads.co/jobs", (e, r, body) => {
//   console.log(body);
// });

// request("https://jobbatical.com/explore", (e, r, body) => {
//   console.log(body);
// });

var jsdom = require("jsdom");

// jsdom.env("", [])
