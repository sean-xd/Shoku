var fs = require("fs"),
  Magic = (num, cb, arr) => data => (arr.length === num - 1) ? cb(arr.concat([data])) : arr.push(data),
  names = [
    "wfhio", "weworkremotely", "remoteok", "coroflot",
    "stackoverflow", "github", "smashingjobs", "dribbble",
    "jobspresso", "themuse", "indeed", "authenticjobs"
  ],
  testComplete = Magic(names.length, () => console.log(fs.readFileSync("./testresults.md").toString()), []),
  testResults = (name, e) => `${name} | ${e.name} | ${e.result ? "PASS" : "**FAIL**"} \n`,
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
      return job[prop] && typeof job[prop] === type;
    }, true);
    magic({name: `all ${prop}s are ${type}s`, result: result});
  }
}

names.forEach(name => {
  var afterAppend = Magic(tests.length, testComplete, []),
    domainCheck = Magic(tests.length, data => {
      data.forEach(e => fs.appendFile("./testresults.md", testResults(name, e), afterAppend));
    }, []);
  require(`../db/${name}.js`)(data => tests.forEach(fn => fn(data, domainCheck)));
});
