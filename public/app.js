var ls = localStorage,
  app = angular.module("app", ["ngAnimate"]);

app.controller("BodyController", ["$scope", ($scope) => {
  $scope.sources =  ls.sources ? JSON.parse(ls.sources) : [
    {name: "wfhio", color: "darkgrey", off: false},
    {name: "weworkremotely", color: "lightgrey", off: false},
    {name: "remoteok", color: "blue", off: false},
    {name: "coroflot", color: "orange", off: false},
    {name: "stackoverflow", color: "white", off: false},
    {name: "github", color: "darkgrey", off: false},
    {name: "smashingjobs", color: "orange", off: false}
  ];;
  $scope.tags = ls.tags ? JSON.parse(ls.tags) : [
    {name: "node", color: "green", off: false},
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
}]);

app.directive("companylist", () => ({
  templateUrl: "partials/companylist.html",
  controller: ($scope, $http) => {
    $scope.companies = [];
    $scope.companyLimit = 10;
    $scope.companyFilter = company => {
      return company.jobs.reduce((check, job) => {
        if(!check || !job) return false;
        var checker = buildChecker($scope, job);
        return checker("sources", "source") && checker("tags", "content") && checker("tags", "title");
      }, true);
    };

    document.addEventListener("scroll", e => {
      var almostBottom = document.body.scrollTop > document.body.scrollHeight - document.body.clientHeight - 200,
        topToggle = document.body.scrollTop === 0 || (document.body.scrollTop > 0 && !$scope.isScrolled);
      if(almostBottom) $scope.companyLimit += 10;
      if(topToggle) $scope.isScrolled = !$scope.isScrolled;
      if(almostBottom || topToggle) $scope.$apply();
    });

    $scope.companies = ls.companies ? JSON.parse(ls.companies) : [];

    if(!$scope.companies.length || ls.ttl < Date.now()){
      $http.get('/jobs').then(data => {
        $scope.companies = data.data.reduce((arr, job) => {
          var company = arr.find(e => e.name === job.company) || {name: job.company, jobs: [], latest: 0};
          if(!company.latest) arr.push(company);
          if(job.date > company.latest) company.latest = job.date;
          company.jobs.push(job);
          return arr;
        }, []);
        ls.companies = JSON.stringify($scope.companies);
        ls.ttl = Date.now() + (1000 * 60 * 5);
      });
    }
  }
}));

app.directive("heading", () => ({
  templateUrl: "partials/heading.html"
}));

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

app.directive("sidebar", () => ({
  templateUrl: "partials/sidebar.html",
  controller: $scope => {
    $scope.getColor = name => {
      var findSource = $scope.sources.find(e => e.name === name),
        findTag = $scope.tags.find(e => e.name === name);
      if(findSource || findTag) return (findSource || findTag).color;
    };
    $scope.tagOff = tag => {
      var type = ($scope.tags.find(e => e.name === tag.name)) ? "tags" : "sources";
      tag.off = !tag.off;
      ls[type] = JSON.stringify($scope[type]);
    };
    $scope.clearTags = () => {
      $scope.tags.forEach(e => e.off = false);
      $scope.sources.forEach(e => e.off = false);
      ls.sources = JSON.stringify($scope.sources);
      ls.tags = JSON.stringify($scope.tags);
    };
  }
}));
