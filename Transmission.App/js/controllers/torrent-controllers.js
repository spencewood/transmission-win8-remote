angular.module('Torrent', ['RemoteServices', 'WinServices', 'StatusServices'])
    .controller('MainController', function ($scope, remoteService, torrentService) {
        $scope.selectedTorrentIds = [];
        remoteService.init();
        torrentService.pollForTorrents();
    })
    .controller('TreeController', function ($scope, $location, torrentService, statusService) {
        $scope.$on('torrents:inserted', function () {
            torrentService.getUpdatedTorrents.call(torrentService).then(function (torrents) {
                $scope.torrents = torrents;
            });
        });

        $scope.$on('spinner:stop', function () {
            $scope.showSpinner = false;
        });
        $scope.$on('spinner:start', function () {
            $scope.showSpinner = true;
        });

        $location.path('/status/all');

        $scope.downloading = statusService.statuses.downloading;
        $scope.active = statusService.statuses.active;
        $scope.inactive = statusService.statuses.inactive;
        $scope.stopped = statusService.statuses.stopped;
        $scope.error = statusService.statuses.error;
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

        var filterOnStatus = function (status, arr) {
            return arr.filter(function (item) {
                if (status in statusService.statuses) {
                    return statusService.statuses[status](item);
                }
                return true;
            });
        };

        var filterOnSearch = function (search, arr) {
            if (search !== '') {
                var caseFilterByKey = _.matchesCaseInsensitiveByKey(search.filter, 'name');
                return arr.filter(caseFilterByKey);
            }
            return arr;
        };

        var clearTorrents = function () {
            _.clearArray($scope.torrents);
        };

        var addTorrents = function (torrents) {
            torrentService.addTorrents(torrents);
        };

        var processTorrentData = $scope.processTorrentData = function () {
            torrentService.getUpdatedTorrents.call(torrentService).then(function (torrents) {
                var active = torrents.filter(statusService.statuses.active);

                var statusFilter = _.partial(filterOnStatus, statusService.getLocationStatus());
                var searchFilter = _.partial(filterOnSearch, $scope.search);

                var filteredTorrents = _.pipeline(torrents, statusFilter, searchFilter);

                _.updateAddDelete(
                    $scope.torrents,
                    filteredTorrents,
                    'id',
                    _.extend,
                    _.asWinJsBinding,
                    _.removeElement);
            });
        };

        $scope.$on('torrents:inserted', processTorrentData);
        $scope.$on('torrents:add', _.dropFirstArgument(addTorrents));

        $rootScope.$on('$locationChangeSuccess', clearTorrents);
        $rootScope.$on('$locationChangeSuccess', processTorrentData);
    });