mainApp.factory('torrentService', function ($rootScope, remoteService) {
    return {
        torrents: [],
        timeoutToken: null,

        getTorrents: function () {
            return this.torrents;
        },

        pollForTorrents: function () {
            if (this.timeoutToken != null) {
                clearTimeout(this.timeoutToken);
                this.timeoutToken = null;
            }
            return this.updateTorrents().then(function (val) {
                this.timeoutToken = setTimeout(this.pollForTorrents.bind(this), 10 * 1000);
            }.bind(this));
        },

        updateTorrents: function () {
            return remoteService.getTorrents().then(function (val) {
                var torrents = this.torrents = JSON.parse(val).arguments.torrents;
                $rootScope.$broadcast('torrents:updated', torrents);
            }.bind(this));
        },

        findById: function (id) {
            return _.findWhere(this.torrents, { id: id });
        },

        getNameById: function (id) {
            var torrent = this.findById(id);
            if (torrent !== null) {
                return torrent.name;
            }
        },

        start: function (ids) {
            return remoteService.startTorrents(ids).then(this.pollForTorrents.bind(this));
        },

        stop: function (ids) {
            return remoteService.stopTorrents(ids).then(this.pollForTorrents.bind(this));
        },

        verify: function (ids) {
            return remoteService.verifyTorrents(ids).then(this.pollForTorrents.bind(this));
        },

        reannounce: function (ids) {
            return remoteService.reannounceTorrents(ids).then(this.pollForTorrents.bind(this));
        },

        remove: function (ids, removeData) {
            return remoteService.removeTorrents(ids, removeData).then(this.pollForTorrents.bind(this));
        },

        moveToTop: function (ids) {
            return remoteService.moveTorrentsToTop(ids).then(this.pollForTorrents.bind(this));
        },

        moveToBottom: function (ids) {
            return remoteService.moveTorrentsToBottom(ids).then(this.pollForTorrents.bind(this));
        },

        moveUp: function (ids) {
            return remoteService.moveTorrentsUp(ids).then(this.pollForTorrents.bind(this));
        },

        moveDown: function (ids) {
            return remoteService.moveTorrentsDown(ids).then(this.pollForTorrents.bind(this));
        },

        add: function (metainfo) {
            return remoteService.addTorrent(metainfo).then(this.pollForTorrents.bind(this));
        }
    }
});