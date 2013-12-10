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
        }
    }
});