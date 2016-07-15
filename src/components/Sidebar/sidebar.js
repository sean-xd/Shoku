app.directive("sidebar", () => ({
  templateUrl: "partials/sidebar.html",
  controller: $scope => {
    $scope.getColor = name => {
      var findSource = $scope.sources.find(e => e.name === name),
        findTag = $scope.tags.find(e => e.name === name);
      if(findSource || findTag) return (findSource || findTag).color;
    };
    $scope.tagOff = tag => {
      var type = ($scope.tags.find(e => e.name === tag.name)) ? "tags" : "sources";
      tag.off = !tag.off;
      ls[type] = JSON.stringify($scope[type]);
    };
    $scope.clearTags = () => {
      $scope.tags.forEach(e => e.off = false);
      $scope.sources.forEach(e => e.off = false);
      ls.sources = JSON.stringify($scope.sources);
      ls.tags = JSON.stringify($scope.tags);
    };
  }
}));
