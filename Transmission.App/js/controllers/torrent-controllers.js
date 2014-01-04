angular.module('Torrent', ['RemoteServices', 'WinServices', 'StatusServices'])
    .controller('StatsController', function ($scope) {

    })
    .controller('TorrentDetailsController', function ($scope, remoteService, torrentService, id) {
        remoteService.init();

        var updateTorrent = function (torrent) {
            $scope.torrent = torrent;
        };

        torrentService.getTorrent(id).then(updateTorrent);

        $scope.$on('torrents:inserted', updateTorrent);
    })
    .controller('TorrentController', function ($scope, $rootScope, torrentService, remoteService, statusService, navigationService) {
        $scope.selectedTorrentIds = [];
        remoteService.init();
        torrentService.pollForTorrents();

        $scope.torrents = new WinJS.Binding.List();

        $scope.selection = [];
        $scope.$watch('selection', function (selection) {
            $rootScope.selectedTorrentIds = _.pluck(_.pluck(selection._value, 'data'), 'id');
        });

        $scope.search = { filter: '' };

        $scope.selectItem = function (args) {
            var item = $scope.torrents.getAt(args.detail.itemIndex);
            navigationService.showTorrentDetails(item.id);
        };

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
        $scope.$on('torrents:add', _.dropFirstArgument(torrentService.addTorrents));
    });