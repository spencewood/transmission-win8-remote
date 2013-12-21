angular.module('Directives', [])
    .directive('activeLink', function ($location) {
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
    })
    .directive('itemCount', function () {
        return {
            restrict: 'E',
            scope: {
                filterBy: '='
            },
            template: '<span>({{(torrents|filter:filterBy).length}})</span>'
        };
    })
    .directive('winjsSelectionChanged', function () {
        return {
            restrict: 'A',
            scope: {
                selection: '='
            },
            link: function (scope, el, attr) {
                el.bind("selectionchanged", function (e) {
                    scope.$parent.selection = el.get(0).winControl.selection.getItems();
                    scope.$apply();
                });
            },
            transclude: true
        }
    });