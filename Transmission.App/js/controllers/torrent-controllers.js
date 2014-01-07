angular.module('Torrent', ['RemoteServices', 'WinServices', 'StatusServices', 'PollingService'])
    .controller('StatsController', function ($scope) {

    })
    .controller('TorrentDetailsController', function ($scope, remoteService, torrentService, id) {
        //TODO: handle torrent.pieces byte array
        //TODO: handle the possibility of multiple trackers in torrent.trackerStats
        remoteService.init();

        var mergeData = function (target) {
            return function (data) {
                return _.merge(target, data);
            };
        };

        var mergeCollections = function () {
            var collections = _.toArray(arguments);
            var coll = collections.shift();
            while (collections.length > 0) {
                collections.shift().forEach(function (item, idx) {
                    _.merge(coll[idx], item);
                });
            }
            return coll;
        };

        var updateListData = function (arr) {
            var keys = _.rest(arguments);
            return function (data) {
                var a = keys.map(function (key) {
                    return data[key];
                });
                mergeCollections.apply(null, a).forEach(function (item) {
                    arr.push(_.asWinJsBinding(item));
                });
            };
        };

        $scope.torrent = {};
        $scope.trackers = [];
        $scope.peers = [];
        $scope.files = new WinJS.Binding.List();

        $scope.selectionChange = function (items) {

        };

        $scope.selectItem = function (args) {

        };

        torrentService.getTorrent(id).then(mergeData($scope.torrent))
        torrentService.updateTorrent(id).then(mergeData($scope.torrent));
        torrentService.getTrackers(id).then(updateListData($scope.trackers, 'trackers', 'trackerStats'));
        torrentService.getPeers(id).then(updateListData($scope.peers, 'peers'));
        torrentService.getFiles(id).then(updateListData($scope.files, 'files', 'priorities', 'wanted'));
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