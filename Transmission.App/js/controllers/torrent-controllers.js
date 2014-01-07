angular.module('Torrent', ['RemoteServices', 'WinServices', 'StatusServices', 'PollingService'])
    .controller('StatsController', function ($scope) {

    })
    .controller('TorrentDetailsController', function ($scope, remoteService, torrentService, id, pollFactory) {
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
                var list = mergeCollections.apply(null, keys.map(function (key) {
                    return data[key];
                })).map(function (item) {
                    return _.asWinJsBinding(item);
                });

                _.clearArray(arr);
                list.forEach(function (item) {
                    arr.push(item);
                });
            };
        };

        var torrentCaller = _.idCaller(id);

        $scope.torrent = {};
        $scope.trackers = [];
        $scope.peers = [];
        $scope.files = new WinJS.Binding.List();

        $scope.selectionChange = function (items) {

        };

        $scope.selectItem = function (args) {

        };

        //for local db, if exists
        torrentCaller(torrentService.getTorrent).then(mergeData($scope.torrent));

        //updates
        var poller = new pollFactory.Factory([
            function () {
                return torrentCaller(torrentService.updateTorrent.bind(torrentService))
                    .then(mergeData($scope.torrent));
            },
            function () {
                return torrentCaller(torrentService.getTrackers.bind(torrentService))
                    .then(updateListData($scope.trackers, 'trackers', 'trackerStats'));
            },
            function () {
                return torrentCaller(torrentService.getPeers.bind(torrentService))
                    .then(updateListData($scope.peers, 'peers'));
            },
            function () {
                return torrentCaller(torrentService.getFiles.bind(torrentService))
                    .then(updateListData($scope.files, 'files', 'priorities', 'wanted'));
            }
        ]).start();

        $scope.$on('$destroy', poller.stop.bind(poller));
    })
    .controller('TorrentController', function ($scope, torrentService, remoteService, statusService, navigationService, pollFactory) {
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
                _.asWinJsBinding,
                _.extend,
                _.removeElement);
        };

        var poller = new pollFactory.Factory([
            torrentService.updateTorrents.bind(torrentService)
        ]).start();

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