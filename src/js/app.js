var ls = localStorage,
  app = angular.module("app", []);

app.controller("BodyController", ($scope, $http, TagsService, SignService) => {
  TagsService($scope);
  SignService($scope);
  $scope.open = {};
});
