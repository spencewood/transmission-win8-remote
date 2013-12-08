mainApp
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider.when('/status/:status', {
            templateUrl: '/views/torrents.html',
            controller: 'TorrentController',
            resolve: {
                torrents: function ($route, remoteService) {
                    var status = $route.current.params.status;
                    return remoteService.getTorrents(status).then(function(val){
                        return JSON.parse(val);
                    });
                }
            }
        });
    })
    .controller('TorrentController', function ($scope, torrents) {
        $scope.torrents = torrents;
    });