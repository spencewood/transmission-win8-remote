mainApp.controller('MainController', function ($scope, $timeout, remoteService, torrentService) {
    
    $scope.selectedTorrentIds = [];
    
    remoteService.init().then(function (val) {
        $scope.$broadcast('service:initialized');
    });

    $scope.$on('service:initialized', function () {
        torrentService.pollForTorrents();
    });
});