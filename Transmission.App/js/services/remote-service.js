mainApp.factory('remoteService', function ($rootScope, localSettingsService) {
    var remote = new Transmission.Runtime.Remote(
        localSettingsService.get('servername'),
        localSettingsService.get('username'),
        localSettingsService.get('password')
    );

    var spinnerStop = function () {
        $rootScope.$broadcast('spinner:stop');
    };

    var spinnerStart = function () {
        $rootScope.$broadcast('spinner:start');
    };

    return {
        init: function () {
            return remote.storeSessionId();
        },

        sessionStats: function () {
            return remote.sessionStats();
        },

        getSettings: function () {
            return remote.getSession();
        },

        getFreeSpace: function () {
            return remote.getFreeSpace();
        },

        getTorrents: function () {
            spinnerStart();
            var sess = remote.getTorrents();
            sess.then(spinnerStop);
            return sess;
        },

        getTorrentStats: function () {
            return remote.getTorrentStats();
        },

        startTorrents: function (ids) {
            return remote.startTorrents(ids);
        },

        stopTorrents: function (ids) {
            return remote.stopTorrents(ids);
        },

        verifyTorrents: function (ids) {
            return remote.verifyTorrents(ids);
        },

        reannounceTorrents: function (ids) {
            return remote.reannounceTorrents(ids);
        },

        removeTorrents: function (ids) {
            return remote.remove(ids);
        },

        moveTorrentsToTop: function (ids) {
            return remote.moveTorrentsToTop(ids);
        },

        moveTorrentsToBottom: function (ids) {
            return remote.moveTorrentsToBottom(ids);
        },

        moveTorrentsUp: function (ids) {
            return remote.moveTorrentsUp(ids);
        },

        moveTorrentsDown: function (ids) {
            return remote.moveTorrentsDown(ids);
        }
    };
});