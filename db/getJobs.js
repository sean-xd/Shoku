var fs = require("fs"),
  Magic = require("_magic"),
  sources = [
    "wfhio", "weworkremotely", "remoteok", "coroflot",
    "stackoverflow", "github", "smashingjobs", "dribbble",
    "indeed", "authentic"
  ];

function isJobBroken(job, hash){
  var noJob = !job || job.company.length < 2,
    olderThan30 = Date.now() - job.date > 1000 * 60 * 60 * 24 * 30,
    jobHash = (job.title || "").replace(/[\- ]/g, "") + job.company;
  if(noJob || olderThan30 || hash[jobHash]) return true;
  hash[jobHash] = true;
}

function addTagsToJob(job){
  var content = job.content ? job.content.toLowerCase() : "",
    title = job.title.toLowerCase(),
    tags = ["javascript", "developer", "designer", "engineer", "aws", "full stack", "ios",
      "rails", "python", "android", "node", "react", "angular", ".net", "manager", "java"];
  job.tags = tags.filter(tag => {
    if(tag === "java"){
      content = content.replace(/javascript/g, "");
      title = title.replace(/javascript/g, "");
    }
    return content.indexOf(tag) > -1 || title.indexOf(tag) > -1;
  });
}

function addJobToCompany(job, companies){
  var company = companies.find(e => e.name === job.company) || {name: job.company, jobs: [], latest: 0};
  if(!company.latest) companies.push(company);
  if(job.date > company.latest) company.latest = job.date;
  company.jobs.push(job);
  if(company.jobs.length > 1) company.jobs.sort((a, b) => b.date - a.date);
}

function getJobs(db){
  db.ttl = Date.now() + (1000 * 60 * 15);
  var pushJobs = Magic(sources.length, data => {
    var hash = {};
    db.jobs = data.reduce((companies, jobs) => {
      jobs.forEach(job => {
        if(isJobBroken(job, hash)) return;
        addTagsToJob(job);
        addJobToCompany(job, companies);
      });
      return companies;
    }, []).sort((a, b) => b.latest - a.latest);
    fs.writeFile(__dirname + "/db.json", JSON.stringify(db));
  }, []);
  sources.forEach(name => {
    var lib = require(`../listings/${name}.js`);
    lib.get(data => pushJobs(lib.parse(data)));
  });
}

module.exports = getJobs;
