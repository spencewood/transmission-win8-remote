mainApp.factory('torrentService', function ($rootScope, remoteService) {
    return {
        torrents: [],

        getTorrents: function () {
            return this.torrents;
        },

        updateTorrents: function () {
            var ret = remoteService.getTorrents()
            ret.then(function (val) {
                var torrents = this.torrents = JSON.parse(val).arguments.torrents;
                $rootScope.$broadcast('torrents:updated', torrents);
            }.bind(this));
            return ret;
        },

        start: function (ids) {
            remoteService.startTorrents(ids);
        },

        stop: function (ids) {
            remoteService.stopTorrents(ids);
        },

        verify: function (ids) {
            remoteService.verifyTorrents(ids);
        },

        reannounce: function (ids) {
            remoteService.reannounceTorrents(ids);
        },

        remove: function (ids, removeData) {
            remoteService.removeTorrents(ids, removeData);
        },

        moveToTop: function (ids) {
            remoteService.moveTorrentsToTop(ids);
        },

        moveToBottom: function (ids) {
            remoteService.moveTorrentsToBottom(ids);
        },

        moveUp: function (ids) {
            remoteService.moveTorrentsUp(ids);
        },

        moveDown: function (ids) {
            remoteService.moveTorrentsDown(ids);
        }
    }
});