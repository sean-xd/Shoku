app.directive("sidebar", () => ({
  templateUrl: "partials/sidebar.html",
  controller: $scope => {
    $scope.getColor = name => {
      var findSource = $scope.sources.find(e => e.name === name),
        findTag = $scope.tags.find(e => e.name === name);
      if(findSource || findTag) return (findSource || findTag).color;
    };
    $scope.tagOn = tag => {
      var type = ($scope.tags.find(e => e.name === tag.name)) ? "tags" : "sources";
      tag.on = !tag.on;
      tag.off = false;
      ls[type] = JSON.stringify($scope[type]);
    };
    $scope.tagOff = tag => {
      var type = ($scope.tags.find(e => e.name === tag.name)) ? "tags" : "sources";
      tag.off = !tag.off;
      tag.on = false;
      ls[type] = JSON.stringify($scope[type]);
    };
    $scope.clearTags = () => {
      $scope.tags.forEach(e => {e.off = false; e.on = false;});
      $scope.sources.forEach(e => {e.off = false; e.on = false;});
      ls.sources = JSON.stringify($scope.sources);
      ls.tags = JSON.stringify($scope.tags);
    };
  }
}));

app.directive('ngRightClick', $parse => {
  return (scope, element, attrs) => {
    var fn = $parse(attrs.ngRightClick);
    element.bind('contextmenu', event => {
      scope.$apply(() => {
        event.preventDefault();
        fn(scope, {$event:event});
      });
    });
  };
});
