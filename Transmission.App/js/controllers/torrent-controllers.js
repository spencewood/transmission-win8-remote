angular.module('Torrent', ['RemoteServices', 'WinServices', 'StatusServices', 'PollingService'])
    .controller('StatsController', function ($scope) {

    })
    .controller('TorrentDetailsController', function ($scope, remoteService, torrentService, id) {
        //TODO: handle torrent.pieces byte array
        //TODO: handle the possibility of multiple trackers in torrent.trackerStats
        var updateTorrentData = function (torrent) {
            $scope.torrent = torrent;
        };

        remoteService.init();
        torrentService.getTorrent(id).then(updateTorrentData)
        torrentService.updateTorrent(id).then(updateTorrentData);
    })
    .controller('TorrentController', function ($scope, torrentService, remoteService, localSettingsService, statusService, navigationService, poll) {
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

        var updateTorrentData = $scope.processTorrentData = function (torrents) {
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
        };

        remoteService.init();
        torrentService.getTorrents().then(updateTorrentData);
        torrentService.updateTorrents().then(updateTorrentData);

        var poller = new poll.Poller(
            torrentService.updateTorrents.bind(torrentService),
            localSettingsService.getInterfaceSettings().refreshActive * 1000
        ).start();

        $scope.torrents = new WinJS.Binding.List();

        $scope.selection = [];
        $scope.selectedTorrentIds = [];
        $scope.$watch('selection', function (selection) {
            $scope.selectedTorrentIds = _.pluck(_.pluck(selection._value, 'data'), 'id');
        });

        $scope.search = { filter: '' };

        $scope.selectItem = function (args) {
            var item = $scope.torrents.getAt(args.detail.itemIndex);
            navigationService.showTorrentDetails(item.id);
        };

        //$scope.$on('torrents:inserted', processTorrentData);
        $scope.$on('torrents:add', _.dropFirstArgument(torrentService.addTorrents));
        $scope.$on('$destroy', function () {
            console.log('destroying torrent controller');
        });
        $scope.$on('$destroy', poller.stop.bind(poller));
    });