app.directive("companylist", () => ({
  templateUrl: "partials/companylist.html",
  controller: ($scope, $http) => {
    $scope.companies = [];
    $scope.companyLimit = 10;
    $scope.companyFilter = company => {
      return company.jobs.reduce((check, job) => {
        if(!check || !job) return false;
        var checkSource = checker($scope, job, "sources", "source"),
          checkContent = checker($scope, job, "tags", "content");
        return checkSource && checkContent;
      }, true);
    };

    document.addEventListener("scroll", e => {
      var almostBottom = document.body.scrollTop > document.body.scrollHeight - document.body.clientHeight - 200,
        topToggle = document.body.scrollTop === 0 || (document.body.scrollTop > 0 && !$scope.isScrolled);
      if(almostBottom) $scope.companyLimit += 10;
      if(topToggle) $scope.isScrolled = !$scope.isScrolled;
      if(almostBottom || topToggle) $scope.$apply();
    });

    $scope.companies = ls.companies ? JSON.parse(ls.companies) : [];

    if(!$scope.companies.length || ls.ttl < Date.now()){
      $http.get('/jobs').then(data => {
        $scope.companies = data.data.reduce((arr, job) => {
          var company = arr.find(e => e.name === job.company) || {name: job.company, jobs: [], latest: 0};
          if(!company.latest) arr.push(company);
          if(job.date > company.latest) company.latest = job.date;
          company.jobs.push(job);
          return arr;
        }, []);
        ls.companies = JSON.stringify($scope.companies);
        ls.ttl = Date.now() + (1000 * 60 * 5);
      });
    }
  }
}));
