app.directive("companylist", () => ({
  templateUrl: "partials/companylist.html",
  controller: ($scope, $http) => {
    $scope.rawJobs = ls.jobs ? JSON.parse(ls.jobs) : [];
    $scope.page = 0;
    $scope.horizon = ls.jobs ? reduceHorizon() : 1;
    $scope.companies = ls.jobs ? reduceCompanies() : [];
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

    function reduceCompanies(){
      return $scope.rawJobs.reduce((arr, job) => {
        var company = arr.find(e => e.name === job.company) || {name: job.company, jobs: [], latest: 0},
          isntDupe = !company.jobs.find(e => e.title.indexOf(job.title) > -1 || job.title.indexOf(e.title) > -1);
        if(!company.latest) arr.push(company);
        if(job.date > company.latest) company.latest = job.date;
        if(isntDupe) company.jobs.push(job);
        return arr;
      }, []);
    }

    function reduceHorizon(){
      var horizon = $scope.rawJobs.reduce((num, job) => (job.date < num) ? job.date : num, Date.now()),
        since = Date.now() - horizon;
      return Math.ceil(since / (1000 * 60 * 60 * 24));
    }

    $scope.loadMore = () => {
      $http.get($scope.page ? "/jobs/" + $scope.page : "/jobs").then(data => {
        $scope.page += 1;
        $scope.rawJobs = _.uniqWith($scope.rawJobs.concat(data.data), _.isEqual);
        $scope.horizon = reduceHorizon();
        $scope.companies = reduceCompanies();
        ls.companies = JSON.stringify($scope.companies);
        ls.ttl = Date.now() + (1000 * 60 * 5);
      });
    };

    if(!$scope.companies.length || ls.ttl < Date.now()) $scope.loadMore();
  }
}));
