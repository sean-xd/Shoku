var ls = localStorage,
  app = angular.module("app", ["ui.router"]);

app.config($stateProvider => {
  // $stateProvider.state(stateName, stateConfig);
});

app.controller("BodyController", ($scope, $http, TagsService, SignService) => {
  TagsService($scope);
  SignService($scope);
  $scope.open = {};
});
