var fs = require("fs"),
  Magic = (num, cb, arr) => data => (arr.length === num - 1) ? cb(arr.concat([data])) : arr.push(data),
  concat = (arr1, arr2) => arr1.concat(arr2),
  notTwoWeeks = e => Date.now() - e.date < (1000 * 60 * 60 * 24 * 14),
  noDupes = (arr, obj) => {
    var matching = arr.find(e => {
      var company = (obj.company.length < 2) ? e.company[0] : e.company;
      return company === obj.company && e.title === obj.title;
    });
    return matching ? arr : arr.concat([obj]);
  },
  wfhio = require("./wfhio.js"),
  weworkremotely = require("./weworkremotely.js"),
  remoteok = require("./remoteok.js"),
  coroflot = require("./coroflot.js"),
  stackoverflow = require("./stackoverflow.js"),
  github = require("./github.js"),
  smashingjobs = require("./smashingjobs.js"),
  dribbble = require("./dribbble.js"),
  sourcesLength = 12;

var pushJobs = Magic(sourcesLength, data => {
  var result = {};
  result.jobs = data.reduce(concat, []).reduce(noDupes, []).filter(notTwoWeeks).sort((a, b) => b.date - a.date),
  result.ttl = Date.now() + (1000 * 60 * 60);
  fs.writeFileSync("./db/db.json", JSON.stringify(result));
}, []);

wfhio("https://www.wfh.io/categories/1-remote-software-development/jobs.atom", pushJobs);
wfhio("https://www.wfh.io/categories/4-remote-design/jobs.atom", pushJobs);
wfhio("https://www.wfh.io/categories/6-remote-devops/jobs.atom", pushJobs);
weworkremotely("https://weworkremotely.com/categories/1-design/jobs.rss", pushJobs);
weworkremotely("https://weworkremotely.com/categories/2-programming/jobs.rss", pushJobs);
remoteok("https://remoteok.io/index.json", pushJobs);
coroflot("http://feeds.feedburner.com/coroflot/AllJobs?format=xml", pushJobs);
stackoverflow("https://stackoverflow.com/jobs/feed", pushJobs);
github("https://jobs.github.com/positions.json", pushJobs);
smashingjobs("http://jobs.smashingmagazine.com/rss/all/all", pushJobs);
dribbble("https://dribbble.com/jobs.rss", pushJobs);
jobspresso("https://jobspresso.co/?feed=job_feed&job_types=designer%2Cdeveloper%2Cmarketing%2Cproject-mgmt%2Csupport%2Csys-admin%2Cvarious%2Cwriting&search_location&job_categories&search_keywords", pushJobs);
