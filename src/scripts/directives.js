// Partials
app.directive("recent", () => ({templateUrl: "partials/recent.html"}));
app.directive("auth", () => ({templateUrl: "partials/auth.html"}));
app.directive("sidebar", () => ({templateUrl: "partials/sidebar.html"}));
app.directive("tracker", () => ({templateUrl: "partials/tracker.html"}));

// Functions
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
