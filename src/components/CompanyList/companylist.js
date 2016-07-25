app.directive("companylist", () => ({
  templateUrl: "partials/companylist.html",
  controller: ($scope, $http) => {
    $scope.page = 0;
    $scope.companies = ls.companies ? JSON.parse(ls.companies) : [];
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

    $scope.loadMore = () => {
      $http.get($scope.page ? "/jobs/" + $scope.page : "/jobs").then(data => {
        $scope.page += 1;
        $scope.companies = data.data;
        ls.companies = JSON.stringify($scope.companies);
        ls.ttl = Date.now() + (1000 * 60 * 5);
      });
    };

    if(!$scope.companies.length || ls.ttl < Date.now()) $scope.loadMore();
  }
}));
