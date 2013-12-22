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
    .directive('winjsListView', function () {
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: '/views/torrent-listview.html',
            link: function (scope, element) {
                var list = element[0].children[0];
                var tmpl = element[0].children[1];
                WinJS.UI.processAll(list);
                WinJS.UI.processAll(tmpl);

                var listControl = list.winControl;
                listControl.itemDataSource = scope.torrents.dataSource;
                listControl.itemTemplate = tmpl;

                list.addEventListener("selectionchanged", function (e) {
                    scope.selection = listControl.selection.getItems();
                    scope.$apply();
                }, false);
            }
        };
    });