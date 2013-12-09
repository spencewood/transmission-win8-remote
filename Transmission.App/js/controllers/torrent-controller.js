mainApp.controller('TorrentController', function ($scope, $rootScope, $location) {
    WinJS.Namespace.define("TorrentList", { torrents: new WinJS.Binding.List() });

    $scope.$on('torrents:updated', function (e, torrents) {
        //$scope.torrents = torrents;
        //$scope.$apply();
        torrents.forEach(function (torrent) {
            TorrentList.torrents.push(WinJS.Binding.as(torrent));
        });
    });

    $rootScope.$on('$locationChangeSuccess', function(event) {
        $scope.filter = $location.url().match(/\/(\w+)$/)[1];
    });
});