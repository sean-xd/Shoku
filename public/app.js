"use strict";

var ls = localStorage,
    app = angular.module("app", []);

app.controller("BodyController", function ($scope, $http, TagsService, SignService, CompanyService) {
  $scope.open = {};
  TagsService($scope);
  SignService($scope);
  CompanyService($scope);

  $scope.jobFilter = function (job) {
    var checkSource = checker($scope, job, "sources", "source"),
        checkContent = checker($scope, job, "tags", "content");
    return checkSource && checkContent;
  };

  $scope.activateJob = function (job) {
    return job.active = !job.active;
  };

  document.addEventListener("scroll", function (e) {
    var almostBottom = document.body.scrollTop > document.body.scrollHeight - document.body.clientHeight - 200,
        topToggle = document.body.scrollTop === 0 || document.body.scrollTop > 0 && !$scope.isScrolled,
        atBottom = document.body.scrollTop === document.body.scrollHeight - document.body.clientHeight,
        notAtBottom = !atBottom && $scope.atBottom,
        newAtBottom = atBottom && !$scope.atBottom;
    if (almostBottom && $scope.companyLimit < $scope.companies.length) $scope.companyLimit += 10;
    if (topToggle) $scope.isScrolled = !$scope.isScrolled;
    if (notAtBottom) $scope.atBottom = false;
    if (newAtBottom) $scope.atBottom = true;
    if (almostBottom || topToggle || notAtBottom || newAtBottom) $scope.$apply();
  });
});

function checker($scope, job, prop, x) {
  var offs = $scope.filters[prop].filter(function (e) {
    return e.off;
  }).map(function (e) {
    return e.name;
  }),
      ons = $scope.filters[prop].filter(function (e) {
    return e.on;
  }).map(function (e) {
    return e.name;
  }),
      check = !ons.length,
      buildChecker = function buildChecker(result) {
    return function (name) {
      var jobProp = name === "java" ? job[x].replace(/javascript/g, "") : job[x];
      if (jobProp.toLowerCase().indexOf(name) > -1) check = result;
    };
  };
  if (!check) ons.forEach(function (name) {
    var jobProp = name === "java" ? job[x].replace(/javascript/g, "") : job[x];
    if (jobProp.toLowerCase().indexOf(name) > -1) check = true;
  });
  offs.forEach(function (name) {
    var jobProp = name === "java" ? job[x].replace(/javascript/g, "") : job[x];
    if (jobProp.toLowerCase().indexOf(name) > -1) check = false;
  });
  return check;
}

// Partials
app.directive("companylist", function () {
  return { templateUrl: "partials/companylist.html" };
});
app.directive("heading", function () {
  return { templateUrl: "partials/heading.html" };
});
app.directive("joblist", function () {
  return { templateUrl: "partials/joblist.html" };
});
app.directive("sidebar", function () {
  return { templateUrl: "partials/sidebar.html" };
});

// Functions
app.directive('ngRightClick', function ($parse) {
  return function (scope, element, attrs) {
    var fn = $parse(attrs.ngRightClick);
    element.bind('contextmenu', function (event) {
      scope.$apply(function () {
        event.preventDefault();
        fn(scope, { $event: event });
      });
    });
  };
});

app.filter("dateFilter", function () {
  return function (input) {
    var timeSince = Date.now() - input,
        one = {
      second: 1000,
      minute: 60 * 1000,
      hour: 60 * 60 * 1000,
      day: 24 * 60 * 60 * 1000
    },
        type = timeSince > one.day ? "day" : timeSince > one.hour ? "hour" : timeSince > one.minute ? "minute" : false;
    if (!type) return "just now";
    var num = Math.floor(timeSince / one[type]),
        type = num === 1 ? type : type + "s";
    return num + " " + type + " ago";
  };
});

app.filter('trust', function ($sce) {
  return function (val) {
    return $sce.trustAs("html", val.replace(/<br ?\/?>/g, ""));
  };
});

app.filter("upperFirst", function () {
  return function (input) {
    return input[0].toUpperCase() + input.substr(1);
  };
});

app.config(function ($httpProvider) {
  return $httpProvider.interceptors.push('jwtInterceptor');
});

app.service('jwtInterceptor', function () {
  return { request: function request(config) {
      // angular needs to bind this scope
      if (ls.token) config.headers.Authorization = "Bearer " + ls.token;
      return config;
    } };
});

app.factory("CompanyService", function ($http) {
  return function ($scope) {
    $scope.page = 0;
    $scope.companies = ls.companies ? JSON.parse(ls.companies) : [];
    $scope.companyLimit = 10;
    $scope.companyFilter = function (company) {
      return company.jobs.reduce(function (check, job) {
        if (!check || !job) return false;
        var checkSource = checker($scope, job, "sources", "source"),
            checkContent = checker($scope, job, "tags", "content");
        return checkSource && checkContent;
      }, true);
    };
    $scope.atBottom = false;
    $scope.loadMore = function () {
      $http.get($scope.page ? "/jobs/" + $scope.page : "/jobs").then(function (data) {
        $scope.page += 1;
        $scope.companies = data.data;
        ls.companies = JSON.stringify($scope.companies);
        ls.ttl = Date.now() + 1000 * 60 * 5;
      });
    };
    if (!$scope.companies.length || ls.ttl < Date.now()) $scope.loadMore();
  };
});

app.factory("SignService", function ($http) {
  return function ($scope) {
    $scope.sign = {};
    $scope.activeSign = "";
    $scope.activateSign = function (type) {
      return $scope.activeSign = $scope.activeSign === type ? "" : type;
    };
    $scope.submitSign = function () {
      $http.post("/sign" + $scope.activeSign, JSON.stringify($scope.sign)).then(function (data) {
        ls.token = data.data.token;
        $scope.user = data.data.user;
      });
      $scope.sign = {};
      $scope.activeSign = "";
    };
    $scope.signOut = function () {
      $scope.user = false;
      ls.token = false;
    };

    $http.get("/signToken").then(function (data) {
      $scope.user = data.data.user;
    });
  };
});

app.factory("TagsService", function () {
  return function ($scope) {
    $scope.searchFor = function (tag) {
      return $scope.search = tag;
    };
    $scope.filters = {
      sources: ls.sources ? JSON.parse(ls.sources) : [{ name: "wfhio", color: "darkgrey", off: false, on: false }, { name: "weworkremotely", color: "white", off: false, on: false }, { name: "remoteok", color: "blue", off: false, on: false }, { name: "stackoverflow", color: "white", off: false, on: false }, { name: "github", color: "darkgrey", off: false, on: false }, { name: "indeed", color: "blue", off: false, on: false }, { name: "themuse", color: "white", off: false, on: false }, { name: "coroflot", color: "darkgrey", off: false, on: false }, { name: "smashingjobs", color: "orange", off: false, on: false }, { name: "dribbble", color: "green", off: false, on: false }, { name: "jobspresso", color: "orange", off: false, on: false }, { name: "authenticjobs", color: "darkgrey", off: false, on: false }],
      tags: ls.tags ? JSON.parse(ls.tags) : [{ name: "node", color: "green", off: false, on: false }, { name: "rails", color: "red", off: false, on: false }, { name: "python", color: "blue", off: false, on: false }, { name: "javascript", color: "yellow", off: false, on: false }, { name: ".net", color: "grey", off: false, on: false }, { name: "java", color: "orange", off: false, on: false }, { name: "angular", color: "red", off: false, on: false }, { name: "react", color: "blue", off: false, on: false }, { name: "android", color: "green", off: false, on: false }, { name: "ios", color: "white", off: false, on: false }, { name: "aws", color: "darkgrey", off: false, on: false }, { name: "full stack", color: "grey", off: false, on: false }, { name: "frontend", color: "white", off: false, on: false }, { name: "backend", color: "darkgrey", off: false, on: false }, { name: "developer", color: "yellow", off: false, on: false }, { name: "designer", color: "purple", off: false, on: false }, { name: "engineer", color: "blue", off: false, on: false }, { name: "manager", color: "red", off: false, on: false }]
    };
    $scope.getColor = function (name) {
      var findSource = $scope.filters.sources.find(function (e) {
        return e.name === name;
      }),
          findTag = $scope.filters.tags.find(function (e) {
        return e.name === name;
      });
      if (findSource || findTag) return (findSource || findTag).color;
    };
    $scope.tagOn = function (tag, type) {
      tag.on = !tag.on;
      tag.off = false;
      ls[type] = JSON.stringify($scope.filters[type]);
    };
    $scope.tagOff = function (tag, type) {
      tag.off = !tag.off;
      tag.on = false;
      ls[type] = JSON.stringify($scope.filters[type]);
    };
    $scope.clearTags = function (type) {
      $scope.filters[type].forEach(function (tag) {
        tag.off = false;
        tag.on = false;
      });
      ls[type] = JSON.stringify($scope.filters[type]);
    };
  };
});