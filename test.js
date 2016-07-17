var request = require("request"),
  parseURL = require("rss-parser").parseURL,
  cheerio = require("cheerio"),
  Magic = (num, cb, arr) => data => (arr.length === num - 1) ? cb(arr.concat([data])) : arr.push(data);
