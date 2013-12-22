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
            torrentService.getTorrents().then(function (torrents) {
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

        $scope.$on('torrents:updated', processTorrentData);
        $scope.$on('torrents:add', _.dropFirstArgument(addTorrents));

        $rootScope.$on('$locationChangeSuccess', clearTorrents);
        $rootScope.$on('$locationChangeSuccess', processTorrentData);
    });