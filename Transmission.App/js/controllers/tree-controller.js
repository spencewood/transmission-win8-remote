mainApp.controller('TreeController', function ($scope,  $location) {
    $scope.$on('torrents:updated', function (e, torrents) {
        $scope.torrents = torrents;
        $scope.$apply();
    });

    $location.path('/status/all');
});