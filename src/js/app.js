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
