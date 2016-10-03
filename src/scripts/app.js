var ls = localStorage,
  app = angular.module("app", []),
  _u, _c;

app.controller("BodyController", ($scope, $http, TagsService, SignService, CompanyService, ScrollService) => {
  $scope.search = ["", ""];
  TagsService($scope);
  SignService($scope);
  CompanyService($scope);
  ScrollService($scope);

  if(window.location.pathname === "/tracker/"){
    $scope.trackerOpen = true;
    $scope.lists.active = "tracker";
  }

  _u = () => $scope.user;
  _c = () => $scope.lists;
});
