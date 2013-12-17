mainApp.controller('MainController', function ($scope, $timeout, remoteService, torrentService) {
    //TODO: move polling to service and have canceling

    var poll = function () {
        torrentService.updateTorrents().then(function (val) {
            $timeout(poll, 10 * 1000);
        });
    };

    $scope.selectedTorrentIds = [];
    
    remoteService.init().then(function (val) {
        $scope.$broadcast('service:initialized');
    });

    $scope.$on('service:initialized', function () {
        poll();
    });
});