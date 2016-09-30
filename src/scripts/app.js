var ls = localStorage,
  app = angular.module("app", []),
  _u, _c;

app.controller("BodyController", ($scope, $http, TagsService, SignService, CompanyService) => {
  $scope.open = {};
  TagsService($scope);
  SignService($scope);
  CompanyService($scope);

  _u = () => $scope.user;
  _c = () => $scope.lists;
});
