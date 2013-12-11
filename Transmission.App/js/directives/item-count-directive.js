mainApp.directive('itemCount', function () {
    return {
        restrict: 'E',
        scope: {
            filterBy: '='
        },
        template: '<span>({{(torrents|filter:filterBy).length}})</span>'
    };
})