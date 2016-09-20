var ls = localStorage,
  app = angular.module("app", []);

app.controller("BodyController", ($scope, $http, TagsService, SignService) => {
  $scope.open = {};
  TagsService($scope);
  SignService($scope);

  $scope.jobFilter = job => {
    var checkSource = checker($scope, job, "sources", "source"),
      checkContent = checker($scope, job, "tags", "content");
    return checkSource && checkContent;
  }

  $scope.activateJob = job => job.active = !job.active;
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
