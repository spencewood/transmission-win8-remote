angular.module('Torrent', ['RemoteServices', 'WinServices', 'StatusServices', 'PollingService', 'EventService'])
    .controller('StatsController', function ($scope) {

    })
    .controller('TorrentDetailsController', function ($scope, $injector, remoteService, torrentService, id, pollFactory) {
        //TODO: handle torrent.pieces byte array
        //TODO: handle the possibility of multiple trackers in torrent.trackerStats
        remoteService.init();

        var torrentCaller = _.idCaller(id);

        var extractTrackers = function (data) {
            var trackers = _.clone(data.trackerStats);
            delete data.trackerStatus;
            return trackers;
        };

        var updateTrackerData = function (trackers) {
            return _.addUpdateDelete(
                $scope.trackers,
                trackers,
                'host',
                _.asWinJsBinding,
                _.extend,
                _.removeElement
           );
        };

        var extractPeers = function (data) {
            var peers = _.clone(data.peers);
            delete data.peers;
            return peers;
        };

        var updatePeerData = function (peers) {
            return _.addUpdateDelete(
                $scope.peers,
                peers,
                'address',
                _.asWinJsBinding,
                _.extend,
                _.removeElement
            );
        };

        var extractFiles = function (data) {
            var files = _.mergeCollections(data.files, data.priorities, data.wanted);
            delete data.files;
            delete data.priorities;
            delete data.wanted;
            return files;
        };

        var updateFileData = function (files) {
            return _.addUpdateDelete(
                $scope.files,
                files,
                'name',
                _.asWinJsBinding,
                _.extend,
                _.removeElement
            )
        }

        var updateTorrentData = function (data) {
            return _.merge($scope.torrent, data);
        };

        var updateTorrentDetails = function () {
            return torrentCaller(torrentService.updateTorrent.bind(torrentService))
                .then(_.pipeBranch(extractTrackers, updateTrackerData))
                .then(_.pipeBranch(extractPeers, updatePeerData))
                .then(_.pipeBranch(extractFiles, updateFileData))
                .then(updateTorrentData);
        };

        $scope.torrent = {};
        $scope.trackers = new WinJS.Binding.List();
        $scope.peers = new WinJS.Binding.List();
        $scope.files = new WinJS.Binding.List();

        $scope.selectionChange = function (items) {

        };

        $scope.selectItem = function (args) {

        };

        //for local db, if exists
        torrentCaller(torrentService.getTorrent)
            .then(updateTorrentData);

        //updates
        var poller = new pollFactory.Factory([
            updateTorrentDetails
        ]).start();

        $scope.$on('$destroy', poller.stop.bind(poller));
    })
    .controller('TorrentController', function ($scope, torrentService, remoteService, statusService, navigationService, pollFactory, event) {
        remoteService.init();

        torrentService.getUniqueTrackers().then(function (trackers) {
            $scope.trackers = trackers;
        });

        //TODO: move to directive
        $scope.showTrackerMenu = function () {
            var control = $('#tracker-menu').get(0).winControl;
            control.anchor = $('#tracker-list-display').get(0);
            control.placement = 'bottom';
            control.alignment = 'left';
            control.show();
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

        var mergeData = function (torrents) {
            var active = torrents.filter(statusService.statuses.active);

            var statusFilter = _.partial(filterOnStatus, 'all');
            var searchFilter = _.partial(filterOnSearch, $scope.search);

            var filteredTorrents = _.pipeline(torrents, statusFilter, searchFilter);

            //genericize this more for torrent details
            return _.addUpdateDelete(
                $scope.torrents,
                filteredTorrents,
                'id',
                _.asWinJsBinding,
                _.extend,
                _.removeElement);
        };

        var updateTorrents = function () {
            return torrentService.updateTorrents()
                .then(mergeData);
        };

        var poller = new pollFactory.Factory([
            updateTorrents
        ]).start();

        torrentService.getTorrents().then(mergeData);

        $scope.search = { filter: '' };
        $scope.torrents = new WinJS.Binding.List();

        $scope.selectedTorrentIds = [];
        $scope.selectionChanged = function (items) {
            var ids = _.nestedPluck(items._value, 'data', 'id');
            event.emit('torrent:selected', ids);
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
    })
    .controller('RateController', function ($scope, torrentService, remoteService, event) {
        remoteService.init();

        $scope.speeds = {};

        event.on('speeds:updated', function (speeds) {
            $scope.speeds = speeds;
            $scope.$apply();
        });
    });