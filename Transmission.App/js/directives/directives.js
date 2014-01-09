angular.module('Directives', [])
    .directive('winjsAppBar', function () {
        return {
            restrict: 'A',
            link: function (scope, element) {
                var $bar = element.find('.app-bar');
                var bar = $bar.get(0);
                WinJS.UI.processAll(bar);

                var winControl = bar.winControl;

                scope.$watch('selectedIds', function (ids) {
                    var hasIds = !_.isEmpty(ids);
                    winControl.sticky = hasIds;
                    winControl.disabled = !hasIds;
                    hasIds ? winControl.show() : winControl.hide();
                });

                scope.$on('$destroy', function () {
                    winControl.dispose();
                    delete winControl;
                    $bar.remove();
                });
            }
        }
    })
    .directive('winjsListView', function () {
        return {
            restrict: 'A',
            scope: {
                winjsListView: '@',
                selectItem: '=',
                selectionChanged: '='
            },
            link: function (scope, element) {
                var $list = element.find('.list-view');
                var list = $list[0];
                WinJS.UI.processAll(list);

                var listControl = list.winControl;
                listControl.itemDataSource = scope.$parent[scope.winjsListView].dataSource;
                listControl.oniteminvoked = scope.$parent.selectItem;
                listControl.onselectionchanged = function () {
                    scope.$parent.selectionChanged(listControl.selection.getItems());
                };

                scope.$on('$destroy', function () {
                    listControl.dispose();
                    delete listControl;
                    $list.remove();
                });
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

                scope.$on('$destroy', function () {
                    $inputs.off('change');
                });
            }
        }
    });