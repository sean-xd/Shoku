app.config($httpProvider => $httpProvider.interceptors.push('jwtInterceptor'));

app.service('jwtInterceptor', function(){return {request: config => {
  if(ls.token) config.headers.Authorization = "Bearer " + ls.token;
  return config;
}}});

app.factory("CompanyService", $http => $scope => {
  $scope.page = 0;
  $scope.lists = {
    active: "companies",
    tracked: ls.tracked ? JSON.parse(ls.tracked) : [],
    companies: ls.companies ? JSON.parse(ls.companies) : []
  }
  $scope.companyLimit = 10;
  $scope.jobFilter = job => checker($scope, job, ["source", "content", "title"]);
  $scope.companyFilter = company => company.jobs.reduce((check, job) => check || $scope.jobFilter(job), false);
  $scope.activateJob = job => job.active = !job.active;

  $scope.isJobTracked = job => {
    if(!$scope.lists.tracked) return false;
    return !!$scope.lists.tracked.find(e => e.company + e.title === job.company + job.title);
  };

  $scope.trackJob = job => {
    var companyTitle = x => e => (e.company + e.title === job.company + job.title) - x,
      isTracked = $scope.lists.tracked.find(companyTitle(0));
    if(isTracked) $scope.lists.tracked = $scope.lists.tracked.filter(companyTitle(1));
    else $scope.lists.tracked.push(job);
    ls.tracked = JSON.stringify($scope.lists.tracked);
    $http.post("/track", JSON.stringify({token: ls.token, tracked: ls.tracked}));
  };

  $scope.trackerToggle = () => {
    console.log($scope.trackerOpen);
    $scope.lists.active = $scope.lists.active === "tracked" ? "companies" : "tracked";
    $scope.trackerOpen = !$scope.trackerOpen;
  };

  $scope.loadMore = () => {
    $http.get($scope.page ? "/jobs/" + $scope.page : "/jobs").then(data => {
      $scope.page += 1;
      $scope.lists.companies = data.data;
      ls.companies = JSON.stringify($scope.lists.companies);
      ls.ttl = Date.now() + (1000 * 60 * 5);
    });
  };
  if(!$scope.lists.companies.length || ls.ttl < Date.now()) $scope.loadMore();

  $scope.atBottom = false;
  document.addEventListener("scroll", e => {
    var almostBottom = document.body.scrollTop > document.body.scrollHeight - document.body.clientHeight - 200,
      topToggle = document.body.scrollTop === 0 || (document.body.scrollTop > 0 && !$scope.isScrolled),
      atBottom = document.body.scrollTop === document.body.scrollHeight - document.body.clientHeight,
      notAtBottom = !atBottom && $scope.atBottom,
      newAtBottom = atBottom && !$scope.atBottom;
    if(almostBottom && $scope.companyLimit < $scope.lists[$scope.lists.active].length) $scope.companyLimit += 10;
    if(topToggle) $scope.isScrolled = !$scope.isScrolled;
    if(notAtBottom) $scope.atBottom = false;
    if(newAtBottom) $scope.atBottom = true;
    if(almostBottom || topToggle || notAtBottom || newAtBottom) $scope.$apply();
  });
});

app.factory("SignService", $http => $scope => {
  $scope.sign = {};
  $scope.activeSign = "";
  $scope.loadUser = data => {
    if(!data.data.user) return;
    ls.token = data.data.token;
    $scope.user = {name: data.data.user.name};
    $scope.lists.tracked = JSON.parse(data.data.user.tracked);
  };
  $scope.activateSign = type => $scope.activeSign = $scope.activeSign === type ? "" : type;
  $scope.submitSign = () => {
    $http.post("/sign" + $scope.activeSign, JSON.stringify($scope.sign)).then($scope.loadUser);
    $scope.sign = {};
    $scope.activeSign = "";
  };
  $scope.signOut = () => {
    $scope.user = false;
    ls.token = false;
  };
  $http.get("/signToken").then($scope.loadUser);
});

app.factory("TagsService", filters => $scope => {
  $scope.searchFor = tag => $scope.search = tag; // change this to append
  $scope.filters = filters;
  $scope.getColor = name => $scope.filters.find(e => e.name === name).color;
  $scope.tagChange = (tag, change) => {
    var other = change === "on" ? "off" : "on";
    tag[change] = !tag[change];
    tag[other] = false;
    ls.filters = JSON.stringify($scope.filters);
  };
  $scope.clearTags = type => {
    $scope.filters.forEach(tag => {tag.off = false; tag.on = false;});
    ls.filters = JSON.stringify($scope.filters);
  };
});

function checker($scope, job, props){
  var tags = $scope.filters.reduce((obj, e) => (e.off ? obj.off.push(e.name) : e.on ? obj.on.push(e.name) : 0, obj), {on: [], off: []}),
    check = !tags.on.length,
    tagger = result => name => {
      for(var i = 0; i < props.length; i++){
        var jobProp = name === "java" ? job[props[i]].replace(/[jJ]+avascript/g, "") : job[props[i]];
        if(jobProp.toLowerCase().indexOf(name) > -1){
          check = result;
          i = props.length;
        }
      }
    };
  if(tags.on.length) tags.on.forEach(tagger(true));
  tags.off.forEach(tagger(false));
  return check;
}