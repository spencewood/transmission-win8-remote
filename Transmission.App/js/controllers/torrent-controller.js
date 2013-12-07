mainApp.controller('TorrentController', function ($scope, remoteService) {
    remoteService.getTorrentMetaData().then(function (val) {
        $scope.torrents = JSON.parse(val).arguments.torrents;
        $scope.$apply();
    });
});