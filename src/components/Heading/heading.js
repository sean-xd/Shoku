app.directive("heading", () => ({
  templateUrl: "partials/heading.html"
}));

app.config($httpProvider => $httpProvider.interceptors.push('jwtInterceptor'));

app.service('jwtInterceptor', function(){return {request: config => { // angular needs to bind this scope
  if(ls.token) config.headers.Authorization = "Bearer " + ls.token;
  return config;
}}});

app.factory("SignService", $http => $scope => {
  $scope.sign = {};
  $scope.activeSign = "";
  $scope.activateSign = type => $scope.activeSign = $scope.activeSign === type ? "" : type;
  $scope.submitSign = () => {
    $http.post("/sign" + $scope.activeSign, JSON.stringify($scope.sign)).then(data => {
      ls.token = data.data.token;
      $scope.user = data.data.user;
    });
    $scope.sign = {};
    $scope.activeSign = "";
  };
  $scope.signOut = () => {
    $scope.user = false;
    ls.token = false;
  };

  $http.get("/signToken").then(data => {
    $scope.user = data.data.user;
  });
});
