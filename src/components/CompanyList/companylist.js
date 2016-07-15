app.directive("companylist", () => ({
  templateUrl: "partials/companylist.html",
  controller: ($scope, $http) => {
    $scope.companies = [];
    $scope.companyLimit = 10;
    $scope.companyFilter = company => {
      return company.jobs.reduce((check, job) => {
        if(!check || !job) return false;
        var checker = buildChecker($scope, job);
        return checker("sources", "source") && checker("tags", "content") && checker("tags", "title");
      }, true);
    };

    document.addEventListener("scroll", e => {
      var almostBottom = document.body.scrollTop > document.body.scrollHeight - document.body.clientHeight - 200,
        topToggle = document.body.scrollTop === 0 || (document.body.scrollTop > 0 && !$scope.isScrolled);
      if(almostBottom) $scope.companyLimit += 10;
      if(topToggle) $scope.isScrolled = !$scope.isScrolled;
      if(almostBottom || topToggle) $scope.$apply();
    });

    $http.get('/jobs').then(data => {
      $scope.companies = data.data.reduce((arr, job) => {
        var company = arr.find(e => e.name === job.company) || {name: job.company, jobs: [], latest: 0};
        if(!company.latest) arr.push(company);
        if(job.date > company.latest) company.latest = job.date;
        company.jobs.push(job);
        return arr;
      }, []);
    });
  }
}));
