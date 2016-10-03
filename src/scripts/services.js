app.config($httpProvider => $httpProvider.interceptors.push('jwtInterceptor'));

app.service('jwtInterceptor', function(){return {request: config => {
  if(ls.token) config.headers.Authorization = "Bearer " + ls.token;
  return config;
}}});

function route(url, leaveHistory){
  if(leaveHistory) window.history.pushState({}, "", url);
  else window.history.replaceState({}, "", url);
}

app.factory("CompanyService", $http => $scope => {
  $scope.page = 0;
  $scope.lists = {
    active: "recent",
    tracked: ls.tracked ? JSON.parse(ls.tracked) : [],
    recent: ls.recent ? JSON.parse(ls.recent) : []
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

  $scope.trackerToggle = action => {
    var actionActive = action === "show" ? "tracked" : "recent",
      listActive = $scope.lists.active === "tracked" ? "recent" : "tracked",
      active = action ? actionActive : listActive;
    $scope.lists.active = active;
    $scope.trackerOpen = active === "tracked";
    window.history.replaceState({}, "", $scope.trackerOpen ? "/tracker/" : "/");
  };

  $scope.loadMore = () => {
    $http.get($scope.page ? "/jobs/" + $scope.page : "/jobs").then(data => {
      $scope.page += 1;
      $scope.lists.recent = data.data;
      ls.recent = JSON.stringify($scope.lists.recent);
      ls.ttl = Date.now() + (1000 * 60 * 1);
    });
  };
  if(!$scope.lists.recent.length || ls.ttl < Date.now()) $scope.loadMore();
});

app.factory("ScrollService", () => $scope => {
  $scope.atBottom = false;
  document.addEventListener("scroll", e => {
    // Heading Animation
    if(document.body.scrollTop === 0 || (document.body.scrollTop > 0 && !$scope.isScrolled)){
      console.log("heading ani");
      $scope.isScrolled = !$scope.isScrolled;
      return $scope.$apply();
    }
    // Load More Companies
    if($scope.lists.active !== "recent") return;
    if($scope.companyLimit > 490) return;
    if(document.body.scrollTop > document.body.scrollHeight - document.body.clientHeight - 200){
      console.log("company limit ++");
      $scope.companyLimit += 10;
      $scope.$apply();
    }
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
