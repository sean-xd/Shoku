var fs = require("fs"),
  Magic = (num, cb, arr) => data => (arr.length === num - 1) ? cb(arr.concat([data])) : arr.push(data),
  names = [
    "wfhio", "weworkremotely", "remoteok", "coroflot",
    "stackoverflow", "github", "smashingjobs", "dribbble",
    "jobspresso", "themuse", "indeed", "authenticjobs"
  ],
  testcomplete = Magic(names.length, () => console.log(fs.readFileSync("./testresults.md").toString()), []),
  tests = [
    testType("date", "number"),
    testType("title", "string"),
    testType("company", "string"),
    testType("content", "string"),
    testType("url", "string"),
    testType("source", "string"),
    testType("tags", "array")
  ];

fs.writeFile("./testresults.md", "#Test Results \n Domain | Test | Result \n --- | --- | --- \n");

function testType(prop, type){
  return (data, magic) => {
    var result = data.reduce((check, job) => {
      if(!check) return false;
      if(type === "array") return Array.isArray(job[prop]);
      if(!job[prop] || typeof job[prop] !== type) console.log(job);
      return job[prop] && typeof job[prop] === type;
    }, true);
    magic({name: `all ${prop}s are ${type}s`, result: result});
  }
}

names.forEach(name => {
  var afterAppend = Magic(tests.length, testcomplete, []),
    domainCheck = Magic(tests.length, data => {
      data.forEach(e => {
        fs.appendFile("./testresults.md", `${name} | ${e.name} | ${e.result ? "PASS" : "**FAIL**"} \n`, afterAppend);
      });
  }, []);
  require(`../db/${name}.js`)(data => tests.forEach(fn => fn(data, domainCheck)));
});

// coroflot(pushJobs);
// stackoverflow("https://stackoverflow.com/jobs/feed", pushJobs);
// github("https://jobs.github.com/positions.json", pushJobs);
// smashingjobs("http://jobs.smashingmagazine.com/rss/all/all", pushJobs);
// dribbble("https://dribbble.com/jobs.rss", pushJobs);
// jobspresso("https://jobspresso.co/?feed=job_feed&job_types=designer%2Cdeveloper%2Cmarketing%2Cproject-mgmt%2Csupport%2Csys-admin%2Cvarious%2Cwriting&search_location&job_categories&search_keywords", pushJobs);
// themuse(`https://api-v2.themuse.com/jobs?apikey=${apikeys.themuse}&page=`, pushJobs);
// indeed(`http://api.indeed.com/ads/apisearch?publisher=${apikeys.indeed}&v=2&q=developer&sort=date`, pushJobs);
// authenticjobs(`https://authenticjobs.com/api/?api_key=${apikeys.authenticjobs}&method=aj.jobs.search&format=json&perpage=10`, pushJobs);
