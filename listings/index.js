module.exports = {get: getListings, parse: parseListings};

/**
 * Passes listings to callback.
 * @param {Function} cb
 */
function getListings(cb){
  var sources = ["authentic", "coroflot", "dribbble", "github", "indeed",
    "remoteok", "smashingjobs", "stackoverflow", "weworkremotely", "wfhio"],
    Magic = require("_magic"),
    done = Magic(sources.length, cb, []);
  sources.forEach(name => {
    var lib = require(`./${name}.js`);
    lib.get(data => done(lib.parse(data)));
  });
}

/**
 * Reformats jobs into companies.
 * @param {Array} data
 * @returns {Array}
 */
function parseListings(data){
  var hash = {};
  return data.reduce((companies, jobs) => {
    jobs.forEach(job => {
      var jobHash = job.title.replace(/[\- ]/g, "") + job.company;
      if(hash[jobHash]) return;
      hash[jobHash] = true;
      addTagsToJob(job);
      addJobToCompany(job, companies);
    });
    return companies;
  }, []).sort((a, b) => b.latest - a.latest);
}

/**
 * Adds tags property to job.
 * @param {Object} job
 */
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

/**
 * Pushes job to company object in companies array.
 * @param {Object} job
 * @param {Array} companies
 */
function addJobToCompany(job, companies){
  var company = companies.find(e => e.name === job.company) || {name: job.company, jobs: [], latest: 0};
  if(!company.latest) companies.push(company);
  if(job.date > company.latest) company.latest = job.date;
  company.jobs.push(job);
  if(company.jobs.length > 1) company.jobs.sort((a, b) => b.date - a.date);
}
