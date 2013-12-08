mainApp
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider.when('/all', {
            templateUrl: '/views/torrents.html',
            controller: 'TorrentController',
            resolve: {
                torrents: function (remoteService) {
                    return remoteService.getTorrentMetaData().then(function(val){
                        return JSON.parse(val).arguments.torrents
                    });
                }
            }
        });
    })
    .controller('TorrentController', function ($scope, torrents) {
        $scope.torrents = torrents;
    });