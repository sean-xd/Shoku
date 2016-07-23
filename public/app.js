var ls = localStorage,
  app = angular.module("app", ["ngAnimate"]);

app.controller("BodyController", ["$scope", ($scope) => {
  $scope.searchFor = tag => $scope.search = tag;
  $scope.open = {};
  $scope.filters = {
    sources: ls.sources ? JSON.parse(ls.sources) : [
      {name: "wfhio", color: "darkgrey", off: false, on: false},
      {name: "weworkremotely", color: "white", off: false, on: false},
      {name: "remoteok", color: "blue", off: false, on: false},
      {name: "stackoverflow", color: "white", off: false, on: false},
      {name: "github", color: "darkgrey", off: false, on: false},
      {name: "indeed", color: "blue", off: false, on: false},
      {name: "themuse", color: "white", off: false, on: false},
      {name: "coroflot", color: "darkgrey", off: false, on: false},
      {name: "smashingjobs", color: "orange", off: false, on: false},
      {name: "dribbble", color: "green", off: false, on: false},
      {name: "jobspresso", color: "orange", off: false, on: false},
      {name: "authenticjobs", color: "darkgrey", off: false, on: false}
    ],
    tags: ls.tags ? JSON.parse(ls.tags) : [
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
    ]
  };
}]);

app.directive("companylist", () => ({
  templateUrl: "partials/companylist.html",
  controller: ($scope, $http) => {
    $scope.rawJobs = ls.jobs ? JSON.parse(ls.jobs) : [];
    $scope.page = 0;
    $scope.horizon = ls.jobs ? reduceHorizon() : 1;
    $scope.companies = ls.jobs ? reduceCompanies() : [];
    $scope.companyLimit = 10;
    $scope.companyFilter = company => {
      return company.jobs.reduce((check, job) => {
        if(!check || !job) return false;
        var checkSource = checker($scope, job, "sources", "source"),
          checkContent = checker($scope, job, "tags", "content");
        return checkSource && checkContent;
      }, true);
    };

    $scope.atBottom = false;

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

    function reduceCompanies(){
      return $scope.rawJobs.reduce((arr, job) => {
        var company = arr.find(e => e.name === job.company) || {name: job.company, jobs: [], latest: 0},
          isntDupe = !company.jobs.find(e => e.title.indexOf(job.title) > -1 || job.title.indexOf(e.title) > -1);
        if(!company.latest) arr.push(company);
        if(job.date > company.latest) company.latest = job.date;
        if(isntDupe) company.jobs.push(job);
        return arr;
      }, []);
    }

    function reduceHorizon(){
      var horizon = $scope.rawJobs.reduce((num, job) => (job.date < num) ? job.date : num, Date.now()),
        since = Date.now() - horizon;
      return Math.ceil(since / (1000 * 60 * 60 * 24));
    }

    $scope.loadMore = () => {
      $http.get($scope.page ? "/jobs/" + $scope.page : "/jobs").then(data => {
        $scope.page += 1;
        $scope.rawJobs = _.uniqWith($scope.rawJobs.concat(data.data), _.isEqual);
        $scope.horizon = reduceHorizon();
        $scope.companies = reduceCompanies();
        ls.companies = JSON.stringify($scope.companies);
        ls.ttl = Date.now() + (1000 * 60 * 5);
      });
    };

    if(!$scope.companies.length || ls.ttl < Date.now()) $scope.loadMore();
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

app.directive("sidebar", () => ({
  templateUrl: "partials/sidebar.html",
  controller: $scope => {
    $scope.getColor = name => {
      var findSource = $scope.filters.sources.find(e => e.name === name),
        findTag = $scope.filters.tags.find(e => e.name === name);
      if(findSource || findTag) return (findSource || findTag).color;
    };
    $scope.tagOn = (tag, type) => {
      tag.on = !tag.on;
      tag.off = false;
      ls[type] = JSON.stringify($scope.filters[type]);
    };
    $scope.tagOff = (tag, type) => {
      tag.off = !tag.off;
      tag.on = false;
      ls[type] = JSON.stringify($scope.filters[type]);
    };
    $scope.clearTags = type => {
      $scope.filters[type].forEach(tag => {
        tag.off = false;
        tag.on = false;
      });
      ls[type] = JSON.stringify($scope.filters[type]);
    };
  }
}));

app.filter("upperFirst", () => input => input[0].toUpperCase() + input.substr(1));

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
