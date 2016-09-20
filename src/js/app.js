var ls = localStorage,
  app = angular.module("app", []);

app.controller("BodyController", ($scope, $http, TagsService, SignService, CompanyService) => {
  $scope.open = {};
  TagsService($scope);
  SignService($scope);
  CompanyService($scope);

  $scope.jobFilter = job => {
    var checkSource = checker($scope, job, "sources", "source"),
      checkContent = checker($scope, job, "tags", "content");
    return checkSource && checkContent;
  }

  $scope.activateJob = job => job.active = !job.active;

  document.addEventListener("scroll", e => {
    var almostBottom = document.body.scrollTop > document.body.scrollHeight - document.body.clientHeight - 200,
      topToggle = document.body.scrollTop === 0 || (document.body.scrollTop > 0 && !$scope.isScrolled),
      atBottom = document.body.scrollTop === document.body.scrollHeight - document.body.clientHeight,
      notAtBottom = !atBottom && $scope.atBottom,
      newAtBottom = atBottom && !$scope.atBottom;
    if(almostBottom && $scope.companyLimit < $scope.companies.length) $scope.companyLimit += 10;
    if(topToggle) $scope.isScrolled = !$scope.isScrolled;
    if(notAtBottom) $scope.atBottom = false;
    if(newAtBottom) $scope.atBottom = true;
    if(almostBottom || topToggle || notAtBottom || newAtBottom) $scope.$apply();
  });
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
