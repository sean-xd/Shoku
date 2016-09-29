// Partials
app.directive("companylist", () => ({templateUrl: "partials/companylist.html"}));
app.directive("heading", () => ({templateUrl: "partials/heading.html"}));
app.directive("joblist", () => ({templateUrl: "partials/joblist.html"}));
app.directive("sidebar", () => ({templateUrl: "partials/sidebar.html"}));

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
