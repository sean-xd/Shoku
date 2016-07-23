app.directive("joblist", () => ({
  templateUrl: "partials/joblist.html",
  controller: ($scope, $rootScope) => {
    $scope.jobFilter = job => {
      var checkSource = checker($scope, job, "sources", "source"),
        checkContent = checker($scope, job, "tags", "content");
      return checkSource && checkContent;
    }
    $scope.activateJob = job => job.active = !job.active;
  }
}));

app.filter("dateFilter", () => input => {
  var timeSince = Date.now() - input,
    one = {
      second: 1000,
      minute: 60 * 1000,
      hour: 60 * 60 * 1000,
      day: 24 * 60 * 60 * 1000
    };

  function pluralize(type){
    var num = Math.floor(timeSince / one[type]),
      type = num === 1 ? type : type + "s";
    return `${num} ${type} ago`;
  }

  if(timeSince > one.day) return pluralize("day");
  if(timeSince > one.hour) return pluralize("hour");
  if(timeSince > one.minute) return pluralize("minute");
  return "just now";
});

function checker($scope, job, prop, x){
  var offs = $scope.filters[prop].filter(e => e.off).map(e => e.name),
    ons = $scope.filters[prop].filter(e => e.on).map(e => e.name),
    check = !ons.length,
    buildChecker = result => name => {
      var jobProp = name === "java" ? job[x].replace(/javascript/g, "") : job[x];
      if(jobProp.toLowerCase().indexOf(name) > -1) check = result;
    };
  if(!check) ons.forEach(name => {
    var jobProp = name === "java" ? job[x].replace(/javascript/g, "") : job[x];
    if(jobProp.toLowerCase().indexOf(name) > -1) check = true;
  });
  offs.forEach(name => {
    var jobProp = name === "java" ? job[x].replace(/javascript/g, "") : job[x];
    if(jobProp.toLowerCase().indexOf(name) > -1) check = false;
  });
  return check;
}

app.filter('trust', $sce => val => $sce.trustAs("html", val.replace(/<br ?\/?>/g, "")));
