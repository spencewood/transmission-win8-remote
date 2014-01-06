angular.module('Torrent', ['RemoteServices', 'WinServices', 'StatusServices', 'PollingService'])
    .controller('StatsController', function ($scope) {

    })
    .controller('TorrentDetailsController', function ($scope, remoteService, torrentService, id) {
        //TODO: handle torrent.pieces byte array
        //TODO: handle the possibility of multiple trackers in torrent.trackerStats
        remoteService.init();

        var updateTorrentData = function (torrent) {
            $scope.torrent = torrent;
        };

        var updateFileData = function (data) {
            data.files.forEach(function (file) {
                $scope.files.push(_.asWinJsBinding(file));
            });
        };

        $scope.files = new WinJS.Binding.List();

        $scope.selectionChange = function (items) {

        };

        $scope.selectItem = function (args) {

        };

        torrentService.getTorrent(id).then(updateTorrentData)
        torrentService.updateTorrent(id).then(updateTorrentData);
        torrentService.getFiles(id).then(updateFileData);
    })
    .controller('TorrentController', function ($scope, torrentService, remoteService, localSettingsService, statusService, navigationService, poll) {
        remoteService.init();

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

        var updateTorrentData = function (torrents) {
            var active = torrents.filter(statusService.statuses.active);

            var statusFilter = _.partial(filterOnStatus, statusService.getLocationStatus());
            var searchFilter = _.partial(filterOnSearch, $scope.search);

            var filteredTorrents = _.pipeline(torrents, statusFilter, searchFilter);

            //genericize this more for torrent details
            _.updateAddDelete(
                $scope.torrents,
                filteredTorrents,
                'id',
                _.extend,
                _.asWinJsBinding,
                _.removeElement);
        };

        var poller = new poll.Poller(
            torrentService.updateTorrents.bind(torrentService),
            localSettingsService.getInterfaceSettings().refreshActive * 1000
        ).start();

        torrentService.getTorrents().then(updateTorrentData);
        torrentService.updateTorrents().then(updateTorrentData);

        $scope.search = { filter: '' };
        $scope.torrents = new WinJS.Binding.List();

        $scope.selectedTorrentIds = [];
        $scope.selectionChanged = function (items) {
            $scope.selectedTorrentIds = _.pluck(_.pluck(selection._value, 'data'), 'id');
            $scope.$apply();
        };

        $scope.selectItem = function (args) {
            var item = $scope.torrents.getAt(args.detail.itemIndex);
            navigationService.showTorrentDetails(item.id);
        };

        $scope.$on('torrents:add', _.dropFirstArgument(torrentService.addTorrents));
        $scope.$on('$destroy', function () {
            console.log('destroying torrent controller');
        });
        $scope.$on('$destroy', poller.stop.bind(poller));
    });