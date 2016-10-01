var ls = localStorage,
  app = angular.module("app", []),
  _u, _c;

app.controller("BodyController", ($scope, $http, TagsService, SignService, CompanyService) => {
  $scope.search = ["", ""];
  TagsService($scope);
  SignService($scope);
  CompanyService($scope);

  if(window.location.pathname === "/tracker/") $scope.trackerOpen = true;

  _u = () => $scope.user;
  _c = () => $scope.lists;
});
