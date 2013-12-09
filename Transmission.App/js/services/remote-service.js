mainApp.factory('remoteService', function (localSettingsService) {
    var remote = new Transmission.Runtime.Remote(
        localSettingsService.get('servername'),
        localSettingsService.get('username'),
        localSettingsService.get('password')
    );

    var sessionId = '';

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
            return remote.getTorrents();
        },

        getTorrentStats: function () {
            return remote.getTorrentStats();
        }
    };
});