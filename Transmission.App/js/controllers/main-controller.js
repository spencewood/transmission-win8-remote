mainApp.controller('MainController', function ($scope, $timeout, remoteService) {
    var poll = function () {
        remoteService.getTorrents().then(function (val) {
            $scope.$broadcast('torrents:updated', JSON.parse(val).arguments.torrents);
            $timeout(poll, 10 * 1000);
        });
    };
    
    remoteService.init().then(function (val) {
        $scope.$broadcast('service:initialized');
    });

    $scope.$on('service:initialized', function () {
        poll();
    });

    $scope.downloading = function () {
        return function (item) {
            return item.rateDownload > 0;
        };
    };

    $scope.active = function () {
        return function (item) {
            return item.rateDownload + item.rateUpload > 0;
        }
    };

    $scope.inactive = function () {
        return function (item) {
            return item.rateDownload + item.rateUpload === 0;
        }
    };

    $scope.stopped = function () {
        return function (item) {
            return item.status === 0;
        }
    };

    $scope.error = function () {
        return function (item) {
            return item.error;
        }
    };
});