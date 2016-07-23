app.directive("sidebar", () => ({
  templateUrl: "partials/sidebar.html",
  controller: $scope => {
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
  }
}));

app.filter("upperFirst", () => input => input[0].toUpperCase() + input.substr(1));

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
