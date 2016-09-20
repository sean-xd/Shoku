app.directive("sidebar", () => ({templateUrl: "partials/sidebar.html"}));

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
