"use strict";

var ls = localStorage,
    app = angular.module("app", []),
    _u,
    _c;

app.controller("BodyController", function ($scope, $http, TagsService, SignService, CompanyService, ScrollService) {
  TagsService($scope);
  SignService($scope);
  CompanyService($scope);
  ScrollService($scope);

  _u = function _u() {
    return $scope.user;
  };
  _c = function _c() {
    return $scope.lists;
  };
});

// Partials
app.directive("auth", function () {
  return { templateUrl: "partials/auth.html" };
});
app.directive("recent", function () {
  return { templateUrl: "partials/recent.html" };
});
app.directive("sidebar", function () {
  return { templateUrl: "partials/sidebar.html" };
});
app.directive("tracker", function () {
  return { templateUrl: "partials/tracker.html" };
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

// HTTP Interceptor for JSON Web Token Authentication
app.config(function ($httpProvider) {
  return $httpProvider.interceptors.push('jwtInterceptor');
});
app.service('jwtInterceptor', function () {
  // No arrow because Angular needs to bind the "this".
  return {
    request: function request(config) {
      if (ls.token) config.headers.Authorization = "Bearer " + ls.token;
      return config;
    }
  };
});

// Url Manipulation
function route(url, leaveHistory) {
  if (leaveHistory) window.history.pushState({}, "", url);else window.history.replaceState({}, "", url);
}

// app.factory("CompanyService", $http => {
//   var companies = {
//     page: 0,
//     lists: {
//       active:
//     }
//   };
//
//   return companies;
// });

app.factory("CompanyService", function ($http) {
  return function ($scope) {
    $scope.search = ["", ""];
    $scope.page = 0;
    $scope.lists = {
      active: window.location.pathname === "/tracker/" ? "tracked" : "recent",
      tracked: ls.tracked ? JSON.parse(ls.tracked) : [],
      recent: ls.recent ? JSON.parse(ls.recent) : []
    };
    $scope.trackerOpen = $scope.lists.active === "tracked";
    $scope.companyLimit = 10;
    $scope.jobFilter = function (job) {
      return checker($scope, job, ["source", "content", "title"]);
    };
    $scope.companyFilter = function (company) {
      return company.jobs.reduce(function (check, job) {
        return check || $scope.jobFilter(job);
      }, false);
    };
    $scope.activateJob = function (job) {
      return job.active = !job.active;
    };

    $scope.isJobTracked = function (job) {
      if (!$scope.lists.tracked) return false;
      return !!$scope.lists.tracked.find(function (e) {
        return e.company + e.title === job.company + job.title;
      });
    };

    $scope.trackJob = function (job) {
      var companyTitle = function companyTitle(x) {
        return function (e) {
          return (e.company + e.title === job.company + job.title) - x;
        };
      },
          isTracked = $scope.lists.tracked.find(companyTitle(0));
      if (isTracked) $scope.lists.tracked = $scope.lists.tracked.filter(companyTitle(1));else $scope.lists.tracked.push(job);
      ls.tracked = JSON.stringify($scope.lists.tracked);
      $http.post("/track", JSON.stringify({ token: ls.token, tracked: ls.tracked }));
    };

    $scope.trackerToggle = function (action) {
      var actionActive = action === "show" ? "tracked" : "recent",
          listActive = $scope.lists.active === "tracked" ? "recent" : "tracked",
          active = action ? actionActive : listActive;
      $scope.lists.active = active;
      $scope.trackerOpen = active === "tracked";
      window.history.replaceState({}, "", $scope.trackerOpen ? "/tracker/" : "/");
    };

    $scope.loadMore = function () {
      $http.get($scope.page ? "/jobs/" + $scope.page : "/jobs").then(function (data) {
        $scope.page += 1;
        $scope.lists.recent = data.data;
        ls.recent = JSON.stringify($scope.lists.recent);
        ls.ttl = Date.now() + 1000 * 60 * 1;
      });
    };
    if (!$scope.lists.recent.length || ls.ttl < Date.now()) $scope.loadMore();
  };
});

app.factory("ScrollService", function () {
  return function ($scope) {
    document.addEventListener("scroll", function (e) {
      // Heading Animation
      if (document.body.scrollTop === 0 || document.body.scrollTop > 0 && !$scope.isScrolled) {
        console.log("heading ani");
        $scope.isScrolled = !$scope.isScrolled;
        return $scope.$apply();
      }
      // Load More Companies
      if ($scope.lists.active !== "recent") return;
      if ($scope.companyLimit > 490) return;
      if (document.body.scrollTop > document.body.scrollHeight - document.body.clientHeight - 200) {
        console.log("company limit ++");
        $scope.companyLimit += 10;
        $scope.$apply();
      }
    });
  };
});

app.factory("SignService", function ($http) {
  return function ($scope) {
    $scope.sign = {};
    $scope.activeSign = "";
    $scope.loadUser = function (data) {
      if (!data.data.user) return;
      ls.token = data.data.token;
      $scope.user = { name: data.data.user.name };
      $scope.lists.tracked = JSON.parse(data.data.user.tracked);
    };
    $scope.activateSign = function (type) {
      return $scope.activeSign = $scope.activeSign === type ? "" : type;
    };
    $scope.submitSign = function () {
      $http.post("/sign" + $scope.activeSign, JSON.stringify($scope.sign)).then($scope.loadUser);
      $scope.sign = {};
      $scope.activeSign = "";
    };
    $scope.signOut = function () {
      $scope.user = false;
      ls.token = false;
    };
    $http.get("/signToken").then($scope.loadUser);
  };
});

app.factory("TagsService", function (filters) {
  return function ($scope) {
    $scope.searchFor = function (tag) {
      return $scope.search = tag;
    }; // change this to append
    $scope.filters = filters;
    $scope.getColor = function (name) {
      return $scope.filters.find(function (e) {
        return e.name === name;
      }).color;
    };
    $scope.tagChange = function (tag, change) {
      var other = change === "on" ? "off" : "on";
      tag[change] = !tag[change];
      tag[other] = false;
      ls.filters = JSON.stringify($scope.filters);
    };
    $scope.clearTags = function (type) {
      $scope.filters.forEach(function (tag) {
        tag.off = false;tag.on = false;
      });
      ls.filters = JSON.stringify($scope.filters);
    };
  };
});

function checker($scope, job, props) {
  var tags = $scope.filters.reduce(function (obj, e) {
    return e.off ? obj.off.push(e.name) : e.on ? obj.on.push(e.name) : 0, obj;
  }, { on: [], off: [] }),
      check = !tags.on.length,
      tagger = function tagger(result) {
    return function (name) {
      for (var i = 0; i < props.length; i++) {
        var jobProp = name === "java" ? job[props[i]].replace(/[jJ]+avascript/g, "") : job[props[i]];
        if (jobProp.toLowerCase().indexOf(name) > -1) {
          check = result;
          i = props.length;
        }
      }
    };
  };
  if (tags.on.length) tags.on.forEach(tagger(true));
  tags.off.forEach(tagger(false));
  return check;
}

app.value("filters", ls.filters ? JSON.parse(ls.filters) : [{ name: "wfhio", color: "darkgrey", off: false, on: false }, { name: "weworkremotely", color: "white", off: false, on: false }, { name: "remoteok", color: "blue", off: false, on: false }, { name: "stackoverflow", color: "white", off: false, on: false }, { name: "github", color: "darkgrey", off: false, on: false }, { name: "indeed", color: "blue", off: false, on: false }, { name: "themuse", color: "white", off: false, on: false }, { name: "coroflot", color: "darkgrey", off: false, on: false }, { name: "smashingjobs", color: "orange", off: false, on: false }, { name: "dribbble", color: "green", off: false, on: false }, { name: "jobspresso", color: "orange", off: false, on: false }, { name: "authenticjobs", color: "darkgrey", off: false, on: false }, { name: "node", color: "green", off: false, on: false }, { name: "rails", color: "red", off: false, on: false }, { name: "python", color: "blue", off: false, on: false }, { name: "javascript", color: "yellow", off: false, on: false }, { name: ".net", color: "grey", off: false, on: false }, { name: "java", color: "orange", off: false, on: false }, { name: "angular", color: "red", off: false, on: false }, { name: "react", color: "blue", off: false, on: false }, { name: "android", color: "green", off: false, on: false }, { name: "ios", color: "white", off: false, on: false }, { name: "aws", color: "darkgrey", off: false, on: false }, { name: "full stack", color: "grey", off: false, on: false }, { name: "frontend", color: "white", off: false, on: false }, { name: "backend", color: "darkgrey", off: false, on: false }, { name: "developer", color: "yellow", off: false, on: false }, { name: "designer", color: "purple", off: false, on: false }, { name: "engineer", color: "blue", off: false, on: false }, { name: "manager", color: "red", off: false, on: false }]);