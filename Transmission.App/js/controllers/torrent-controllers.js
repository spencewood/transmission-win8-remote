angular.module('Torrent', ['RemoteServices', 'WinServices', 'StatusServices'])
    .controller('MainController', function ($scope, remoteService, torrentService) {
        $scope.selectedTorrentIds = [];

        remoteService.init().then(function (val) {
            $scope.$broadcast('service:initialized');
        });

        $scope.$on('service:initialized', function () {
            torrentService.pollForTorrents();
        });
    })
    .controller('TreeController', function ($scope, $location, torrentService, statusService) {
        $scope.$on('torrents:updated', function () {
            torrentService.getTorrents().then(function (torrents) {
                $scope.torrents = torrents;
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
    })
    .controller('StatsController', function ($scope) {

    })
    .controller('TorrentController', function ($scope, $rootScope, $location, torrentService, statusService) {
        $scope.torrents = new WinJS.Binding.List();

        $scope.selection = [];
        $scope.$watch('selection', function (selection) {
            $rootScope.selectedTorrentIds = _.pluck(_.pluck(selection._value, 'data'), 'id');
        });

        $scope.search = { filter: '' };
        var filter = 'all';

        var processTorrentData = $scope.processTorrentData = function () {
            torrentService.getTorrents().then(function (newTorrents) {
                var filtered = newTorrents
                    .filter(function (torrent) {
                        if (filter in statusService) {
                            return statusService[filter](torrent);
                        }
                        else {
                            return true;
                        }
                    });

                if ($scope.search.filter !== '') {
                    filtered = filtered.filter(function (torrent) {
                        return torrent.name.toLowerCase().match($scope.search.filter.toLowerCase());
                    });
                }

                var addTorrent = function (torrent) {
                    return WinJS.Binding.as(torrent);
                };

                WinJS.Utilities.markSupportedForProcessing(addTorrent);

                _.updateAddDelete($scope.torrents, filtered, 'id', _.extend, addTorrent, _.removeElement);
            });
        };

        var eventDealer = function (fun) {
            return function () {
                //drop the first argument for event 
                fun.apply(this, _.rest(arguments));
            };
        };

        $scope.$on('torrents:updated', processTorrentData);
        $scope.$on('torrents:add', eventDealer(torrentService.addTorrents.bind(torrentService)));

        $rootScope.$on('$locationChangeSuccess', function (event) {
            filter = $location.url().match(/\/(\w+)$/)[1];
            _.clearArray($scope.torrents);
            processTorrentData();
        });
    });