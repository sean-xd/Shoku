var ls = localStorage,
  app = angular.module("app", ["ngAnimate"]);

app.controller("BodyController", ["$scope", ($scope) => {
  $scope.searchFor = tag => $scope.search = tag;
  $scope.sources =  ls.sources ? JSON.parse(ls.sources) : [
    {name: "wfhio", color: "darkgrey", off: false, on: false},
    {name: "weworkremotely", color: "white", off: false, on: false},
    {name: "remoteok", color: "blue", off: false, on: false},
    {name: "coroflot", color: "orange", off: false, on: false},
    {name: "stackoverflow", color: "white", off: false, on: false},
    {name: "github", color: "darkgrey", off: false, on: false},
    {name: "smashingjobs", color: "orange", off: false, on: false},
    {name: "dribbble", color: "green", off: false, on: false}
  ];
  $scope.tags = ls.tags ? JSON.parse(ls.tags) : [
    {name: "node", color: "green", off: false, on: false},
    {name: "rails", color: "red", off: false, on: false},
    {name: "python", color: "blue", off: false, on: false},
    {name: "javascript", color: "yellow", off: false, on: false},
    {name: ".net", color: "grey", off: false, on: false},
    {name: "java", color: "orange", off: false, on: false},
    {name: "angular", color: "red", off: false, on: false},
    {name: "react", color: "blue", off: false, on: false},
    {name: "android", color: "green", off: false, on: false},
    {name: "ios", color: "white", off: false, on: false},
    {name: "aws", color: "darkgrey", off: false, on: false},
    {name: "full stack", color: "grey", off: false, on: false},
    {name: "frontend", color: "white", off: false, on: false},
    {name: "backend", color: "darkgrey", off: false, on: false},
    {name: "developer", color: "yellow", off: false, on: false},
    {name: "designer", color: "purple", off: false, on: false},
    {name: "engineer", color: "blue", off: false, on: false},
    {name: "manager", color: "red", off: false, on: false}
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
        var checkSource = checker($scope, job, "sources", "source"),
          checkContent = checker($scope, job, "tags", "content");
        return checkSource && checkContent;
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
  var offs = $scope[prop].filter(e => e.off).map(e => e.name),
    ons = $scope[prop].filter(e => e.on).map(e => e.name),
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

app.directive("sidebar", () => ({
  templateUrl: "partials/sidebar.html",
  controller: $scope => {
    $scope.getColor = name => {
      var findSource = $scope.sources.find(e => e.name === name),
        findTag = $scope.tags.find(e => e.name === name);
      if(findSource || findTag) return (findSource || findTag).color;
    };
    $scope.tagOn = tag => {
      var type = ($scope.tags.find(e => e.name === tag.name)) ? "tags" : "sources";
      tag.on = !tag.on;
      tag.off = false;
      ls[type] = JSON.stringify($scope[type]);
    };
    $scope.tagOff = tag => {
      var type = ($scope.tags.find(e => e.name === tag.name)) ? "tags" : "sources";
      tag.off = !tag.off;
      tag.on = false;
      ls[type] = JSON.stringify($scope[type]);
    };
    $scope.clearTags = () => {
      $scope.tags.forEach(e => {e.off = false; e.on = false;});
      $scope.sources.forEach(e => {e.off = false; e.on = false;});
      ls.sources = JSON.stringify($scope.sources);
      ls.tags = JSON.stringify($scope.tags);
    };
  }
}));

app.directive('ngRightClick', $parse => {
  return (scope, element, attrs) => {
    var fn = $parse(attrs.ngRightClick);
    element.bind('contextmenu', event => {
      scope.$apply(() => {
        event.preventDefault();
        fn(scope, {$event:event});
      });
    });
  };
});
