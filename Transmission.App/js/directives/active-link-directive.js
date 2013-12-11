mainApp.directive('activeLink', function ($location) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs, controller) {
            var cls = attrs.activeLink || 'active';
            var path = attrs.href;
            path = path.substring(1); // remove the #
            scope.location = $location;
            scope.$watch('location.path()', function (newPath) {
                if (path === newPath) {
                    element.addClass(cls);
                } else {
                    element.removeClass(cls);
                }
            });
        }
    };

});