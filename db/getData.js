var fs = require("fs"),
  request = require("request"),
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
  sources = [
    "wfhio", "weworkremotely", "remoteok", "coroflot",
    "stackoverflow", "github", "smashingjobs", "dribbble",
    "jobspresso", "themuse", "indeed", "authenticjobs"
  ],
  pushJobs = Magic(sources.length, data => {
    var result = {};
    result.jobs = data.reduce(concat, []).reduce(noDupes, []).filter(notTwoWeeks).sort((a, b) => b.date - a.date).reduce(reduceCompanies, []);
    result.ttl = Date.now() + (1000 * 60 * 60);
    fs.writeFile("./db/db.json", JSON.stringify(result), () => {
      request({method: "POST", url: "http://localhost:3000/jobs/update", body: require("./apikeys.js").secret});
    });
  }, []);

sources.forEach(name => require(`./${name}.js`)(pushJobs));

function reduceCompanies(arr, job){
  var company = arr.find(e => e.name === job.company) || {name: job.company, jobs: [], latest: 0},
    isntDupe = !company.jobs.find(e => e.title.indexOf(job.title) > -1 || job.title.indexOf(e.title) > -1);
  if(!company.latest) arr.push(company);
  if(job.date > company.latest) company.latest = job.date;
  if(isntDupe) company.jobs.push(job);
  return arr;
}
