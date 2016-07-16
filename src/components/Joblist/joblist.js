app.directive("joblist", () => ({
  templateUrl: "partials/joblist.html",
  controller: ($scope, $rootScope) => {
    $scope.jobFilter = job => {
      var checker = buildChecker($scope, job);
      return checker("sources", "source") && checker("tags", "content") && checker("tags", "title");
    }
    $scope.searchFor = tag => $rootScope.search = tag;
    $scope.activateJob = job => {
      job.active = !job.active;
      $rootScope.activeJob = !$rootScope.activeJob;
    };
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

function buildChecker($scope, job){
  return (prop, x) => $scope[prop].filter(e => e.off).map(e => e.name).reduce((check, name) => {
    if(!check) return false;
    var jobProp = (name === "java") ? job[x].replace(/javascript/g, "") : job[x];
    return jobProp.toLowerCase().indexOf(name) === -1;
  }, true);
}

app.filter('trust', $sce => val => $sce.trustAs("html", val.replace(/<br ?\/?>/g, "")));
