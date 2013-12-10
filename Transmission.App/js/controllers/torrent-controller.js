mainApp.controller('TorrentController', function ($scope, $rootScope, $location, torrentService) {
    WinJS.Namespace.define('TorrentList', { torrents: new WinJS.Binding.List() });
    var filter = 'all';

    var differenceObjects = function (a, b) {
        return a.filter(function (obj) {
            return !_.findWhere(b, { id: obj.id });
        });
    };

    var processTorrentData = function () {
        var newTorrents = torrentService.getTorrents();
        
        var filtered = newTorrents
            .filter(function (torrent) {
                switch (filter) {
                    case 'active':
                        return torrent.rateUpload + torrent.rateDownload > 0;
                    default:
                        return true;
                }
            });
        
        filtered.forEach(function (newTorrent) {
                var same = TorrentList.torrents.filter(function (oldTorrent) {
                    return oldTorrent.id === newTorrent.id;
                });
                if (same.length > 0) {
                    for (var prop in newTorrent) {
                        if (newTorrent.hasOwnProperty(prop)) {
                            same[0][prop] = newTorrent[prop];
                        }
                    }
                }
                else {
                    TorrentList.torrents.push(WinJS.Binding.as(newTorrent));
                }
            });

        var toRemove = differenceObjects(TorrentList.torrents, filtered);

        toRemove.forEach(function (rm) {
            TorrentList.torrents.forEach(function (torrent, idx) {
                if (torrent.id === rm.id) {
                    TorrentList.torrents.splice(idx, 1);
                }
            });
        });
    };

    $scope.$on('torrents:updated', processTorrentData);

    $rootScope.$on('$locationChangeSuccess', function(event) {
        filter = $location.url().match(/\/(\w+)$/)[1];
        TorrentList.torrents.splice(0, TorrentList.torrents.length);
        processTorrentData();
    });
});