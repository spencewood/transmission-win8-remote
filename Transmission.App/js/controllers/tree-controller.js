mainApp.controller('TreeController', function ($scope, $location, torrentService, statusService) {
    $scope.$on('torrents:updated', function () {
        torrentService.getTorrents().then(function (torrents) {
            $scope.torrents = torrents;
            $scope.$apply();
        });
    });

    $scope.$on('spinner:stop', function () {
        $scope.showSpinner = false;
        $scope.$apply();
    });
    $scope.$on('spinner:start', function () {
        $scope.showSpinner = true;
        $scope.$apply();
    });

    $location.path('/status/all');

    $scope.downloading = statusService.downloading;
    $scope.active = statusService.active;
    $scope.inactive = statusService.inactive;
    $scope.stopped = statusService.stopped;
    $scope.error = statusService.error;
});