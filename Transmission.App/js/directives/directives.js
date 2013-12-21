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
    .directive('myCurrentTime', function($interval, dateFilter) {
        function link(scope, element, attrs) {
            var format = 'M/d/yy h:mm:ss a',
                timeoutId;
 
            function updateTime() {
                element.text(dateFilter(new Date(), format));
            }
 
            element.on('$destroy', function() {
                $interval.cancel(timeoutId);
            });
 
            // start the UI update process; save the timeoutId for canceling
            timeoutId = $interval(function() {
                updateTime(); // update DOM
            }, 1000);
        }
 
        return {
            link: link
        };
    })
    .directive('winjsListView', function () {
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: '/views/torrent-listview.html',
            link: function (scope, element) {
                var el = element[0].children[0];
                var tmpl = element[0].children[1];
                WinJS.UI.processAll(el);
                WinJS.UI.processAll(tmpl);

                el.winControl.itemDataSource = scope.torrents.dataSource;
                el.winControl.itemTemplate = tmpl;
            }
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
        };
    });