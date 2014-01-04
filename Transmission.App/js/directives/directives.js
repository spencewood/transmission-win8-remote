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
            templateUrl: '/views/partials/torrent-listview.html',
            link: function (scope, element) {
                var list = element.find('#list-view')[0];
                WinJS.UI.processAll(list);

                var listControl = list.winControl;
                listControl.itemDataSource = scope.torrents.dataSource;

                list.addEventListener('selectionchanged', function (e) {
                    scope.selection = listControl.selection.getItems();
                    scope.$apply();
                }, false);
            }
        };
    })
    .directive('winjsTimeChange', function () {
        return {
            restrict: 'A',
            scope: {
                timeChange: '@winjsTimeChange',
                settings: '=settings'
            },
            link: function (scope, element) {
                var control = element[0].winControl;
                control.clock = '24HourClock';
                control.minuteIncrement = '15';
                var time = _.minutesAfterMidnightToDate(scope.$parent.settings[scope.timeChange]);
                control.current = time.getHours() + ':' + time.getMinutes();
                control.onchange = function (e) {
                    scope.$parent.settings[scope.timeChange] = _.dateToMinutesAfterMidnight(e.timeStamp);
                };
            }
        };
    })
    .directive('daysOfWeekPicker', function () {
        return {
            restrict: 'A',
            scope: {
                daysOfWeekPicker: '@',
                settings: '='
            },
            link: function (scope, element) {
                var $inputs = element.find(':checkbox');

                var selected = _.numberToBinaryArray(scope.$parent.settings[scope.daysOfWeekPicker]);
                $inputs.each(function (idx, $el) {
                    $el.checked = selected[idx];
                });

                $inputs.on('change', function (e) {
                    var bitMap = $inputs.map(function (idx, $el) {
                        return $el.checked ? 1 : 0;
                    });

                    scope.$parent.settings[scope.daysOfWeekPicker] = _.binaryArrayToNumber(bitMap.toArray());
                });
            }
        }
    });