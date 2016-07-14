var ls = localStorage, app = angular.module("app", ["ngAnimate"]);

app.controller("BodyController", ["$scope", "$http", "$sce", ($scope, $http, $sce) => {
  $scope.jobs = [];
  $scope.companies = [];
  $scope.companyLimit = 10;

  $scope.sources = ls.sources ? JSON.parse(ls.sources) : [
    {name: "wfhio", color: "darkgrey", off: false},
    {name: "weworkremotely", color: "lightgrey", off: false},
    {name: "remoteok", color: "blue", off: false},
    {name: "coroflot", color: "orange", off: false},
    {name: "stackoverflow", color: "white", off: false},
    {name: "github", color: "darkgrey", off: false}
  ];
  $scope.fromContent = ls.fromContent ? JSON.parse(ls.fromContent) : [
    {name: "nodejs", color: "green", off: false},
    {name: "rails", color: "red", off: false},
    {name: "python", color: "blue", off: false},
    {name: "javascript", color: "yellow", off: false},
    {name: ".net", color: "grey", off: false},
    {name: "java", color: "orange", off: false},
    {name: "angular", color: "red", off: false},
    {name: "react", color: "blue", off: false},
    {name: "android", color: "green", off: false},
    {name: "ios", color: "white", off: false},
    {name: "aws", color: "darkgrey", off: false},
    {name: "full stack", color: "grey", off: false},
    {name: "frontend", color: "lightgrey", off: false},
    {name: "backend", color: "darkgrey", off: false},
    {name: "developer", color: "yellow", off: false},
    {name: "designer", color: "purple", off: false},
    {name: "engineer", color: "blue", off: false},
    {name: "manager", color: "red", off: false}
  ];

  $scope.searchFor = tag => $scope.search = tag;

  $scope.getColor = name => {
    var findSource = $scope.sources.find(e => e.name === name),
      findContent = $scope.fromContent.find(e => e.name === name);
    if(findSource) return findSource.color;
    if(findContent) return findContent.color;
  };

  $scope.tagOff = tag => {
    tag.off = !tag.off;
    ls.sources = JSON.stringify($scope.sources);
    ls.fromContent = JSON.stringify($scope.fromContent);
  };

  $scope.clearTags = () => {
    $scope.fromContent.forEach(e => e.off = false);
    $scope.sources.forEach(e => e.off = false);
    ls.sources = JSON.stringify($scope.sources);
    ls.fromContent = JSON.stringify($scope.fromContent);
  };

  function checkProp(job, prop, name, x){
    var check = (name === "java") ? job[prop].replace(/javascript/g, "") : job[prop];
    return check.toLowerCase().indexOf(name) === -1;
  }

  $scope.tagFilter = job => {
    var sources = $scope.sources.filter(e => e.off).map(e => e.name).reduce((check, name) => {
        if(!check) return false;
        return checkProp(job, "source", name, 1);
      }, true),
      content = $scope.fromContent.filter(e => e.off).map(e => e.name).reduce((check, name) => {
        if(!check) return false;
        return (checkProp(job, "title", name) && checkProp(job, "content", name));
      }, true);
    return sources && content;
  };

  $scope.companyFilter = function(company){
    var result = true;
    company.jobs.forEach(job => {
      if(!result) return;
      if(!$scope.tagFilter(job)) result = false;
    });
    return result;
  };

  $scope.toggleSidebar = () => $scope.sidebarOpen = !$scope.sidebarOpen;

  $scope.activateJob = job => {
    job.active = !job.active;
    $scope.activeJob = !$scope.activeJob;
  };

  document.addEventListener("scroll", e => {
    var apply = false;

    if(document.body.scrollTop > document.body.scrollHeight - document.body.clientHeight - 100){
      $scope.companyLimit += 10;
      apply = true;
    }

    if(document.body.scrollTop === 0 || (document.body.scrollTop > 0 && !$scope.isScrolled)){
      $scope.isScrolled = !$scope.isScrolled;
      apply = true;
    }
    if(apply) $scope.$apply();
  });

  $http.get('/jobs').then(data => {
    $scope.jobs = data.data;
    $scope.companies = $scope.jobs.reduce((arr, job) => {
      var company = arr.find(e => e.name === job.company) || {name: job.company, jobs: [], latest: 0};
      if(!company.latest) arr.push(company);
      if(job.date > company.latest) company.latest = job.date;
      company.jobs.push(job);
      return arr;
    }, []);
  });
}]);

app.filter('trust', $sce => val => $sce.trustAs("html", val.replace(/<br ?\/?>/g, "")));

app.directive("job", () => ({templateUrl: "partials/job.html"}));
app.directive("company", () => ({templateUrl: "partials/company.html"}));
app.directive("sidebar", () => ({templateUrl: "partials/sidebar.html"}));
