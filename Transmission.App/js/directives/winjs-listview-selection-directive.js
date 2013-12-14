mainApp.directive('selectionChanged', function () {
    return {
        restrict: 'A',
        scope: {
            selection: '='
        },
        link: function (scope, el, attr) {
            el.bind("selectionchanged", function(e){
                scope.$parent.selection = el.get(0).winControl.selection.getItems();
                scope.$apply();
            });
        },
        transclude: true
    }
});