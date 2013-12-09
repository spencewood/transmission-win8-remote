mainApp
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider.when('/status/:status', {
            templateUrl: '/views/torrents.html',
            controller: 'TorrentController',
            resolve: {
                torrents: function ($route, remoteService) {
                    var status = $route.current.params.status;
                    return remoteService.getTorrents(status).then(function(val){
                        return JSON.parse(val).arguments.torrents;
                    });
                }
            }
        });
    })
    .controller('TorrentController', function ($scope, $route, $timeout, torrents) {
        $scope.torrents = torrents;
    });