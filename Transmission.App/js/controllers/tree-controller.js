mainApp.controller('TreeController', function ($scope,  $location, statusService) {
    $scope.$on('torrents:updated', function (e, torrents) {
        $scope.torrents = torrents;
        $scope.$apply();
    });

    $location.path('/status/all');

    $scope.downloading = statusService.downloading;
    $scope.active = statusService.active;
    $scope.inactive = statusService.inactive;
    $scope.stopped = statusService.stopped;
    $scope.error = statusService.error;
});