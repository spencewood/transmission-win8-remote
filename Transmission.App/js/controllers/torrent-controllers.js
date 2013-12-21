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
        WinJS.Namespace.define('TorrentList', { torrents: new WinJS.Binding.List() });

        var torrentList = $('#torrent-listview').get(0);
        torrentList.winControl.itemDataSource = TorrentList.torrents.dataSource;
        torrentList.winControl.itemTemplate = $('#torrent-template').get(0);

        $scope.selection = [];
        $scope.$watch('selection', function (selection) {
            $rootScope.selectedTorrentIds = _.pluck(_.pluck(selection._value, 'data'), 'id');
        });

        $scope.search = { filter: '' };
        var filter = 'all';

        var clearList = function () {
            TorrentList.torrents.splice(0, TorrentList.torrents.length);
        };

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

                _.addUpdateDelete(TorrentList.torrents, filtered, 'id', _.extend, function (item) {
                    return WinJS.Binding.as(item);
                }, _.removeElement);
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
            clearList();
            processTorrentData();
        });
    });