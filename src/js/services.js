app.config($httpProvider => $httpProvider.interceptors.push('jwtInterceptor'));

app.service('jwtInterceptor', function(){return {request: config => { // angular needs to bind this scope
  if(ls.token) config.headers.Authorization = "Bearer " + ls.token;
  return config;
}}});

app.factory("CompanyService", $http => $scope => {
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
  $scope.loadMore = () => {
    $http.get($scope.page ? "/jobs/" + $scope.page : "/jobs").then(data => {
      $scope.page += 1;
      $scope.companies = data.data;
      ls.companies = JSON.stringify($scope.companies);
      ls.ttl = Date.now() + (1000 * 60 * 5);
    });
  };
  if(!$scope.companies.length || ls.ttl < Date.now()) $scope.loadMore();
});

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

app.factory("TagsService", () => $scope => {
  $scope.searchFor = tag => $scope.search = tag;
  $scope.filters = {
    sources: ls.sources ? JSON.parse(ls.sources) : [
      {name: "wfhio", color: "darkgrey", off: false, on: false},
      {name: "weworkremotely", color: "white", off: false, on: false},
      {name: "remoteok", color: "blue", off: false, on: false},
      {name: "stackoverflow", color: "white", off: false, on: false},
      {name: "github", color: "darkgrey", off: false, on: false},
      {name: "indeed", color: "blue", off: false, on: false},
      {name: "themuse", color: "white", off: false, on: false},
      {name: "coroflot", color: "darkgrey", off: false, on: false},
      {name: "smashingjobs", color: "orange", off: false, on: false},
      {name: "dribbble", color: "green", off: false, on: false},
      {name: "jobspresso", color: "orange", off: false, on: false},
      {name: "authenticjobs", color: "darkgrey", off: false, on: false}
    ],
    tags: ls.tags ? JSON.parse(ls.tags) : [
      {name: "node", color: "green", off: false, on: false},
      {name: "rails", color: "red", off: false, on: false},
      {name: "python", color: "blue", off: false, on: false},
      {name: "javascript", color: "yellow", off: false, on: false},
      {name: ".net", color: "grey", off: false, on: false},
      {name: "java", color: "orange", off: false, on: false},
      {name: "angular", color: "red", off: false, on: false},
      {name: "react", color: "blue", off: false, on: false},
      {name: "android", color: "green", off: false, on: false},
      {name: "ios", color: "white", off: false, on: false},
      {name: "aws", color: "darkgrey", off: false, on: false},
      {name: "full stack", color: "grey", off: false, on: false},
      {name: "frontend", color: "white", off: false, on: false},
      {name: "backend", color: "darkgrey", off: false, on: false},
      {name: "developer", color: "yellow", off: false, on: false},
      {name: "designer", color: "purple", off: false, on: false},
      {name: "engineer", color: "blue", off: false, on: false},
      {name: "manager", color: "red", off: false, on: false}
    ]
  };
  $scope.getColor = name => {
    var findSource = $scope.filters.sources.find(e => e.name === name),
      findTag = $scope.filters.tags.find(e => e.name === name);
    if(findSource || findTag) return (findSource || findTag).color;
  };
  $scope.tagOn = (tag, type) => {
    tag.on = !tag.on;
    tag.off = false;
    ls[type] = JSON.stringify($scope.filters[type]);
  };
  $scope.tagOff = (tag, type) => {
    tag.off = !tag.off;
    tag.on = false;
    ls[type] = JSON.stringify($scope.filters[type]);
  };
  $scope.clearTags = type => {
    $scope.filters[type].forEach(tag => {
      tag.off = false;
      tag.on = false;
    });
    ls[type] = JSON.stringify($scope.filters[type]);
  };
});
