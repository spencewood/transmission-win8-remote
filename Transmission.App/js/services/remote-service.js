mainApp.factory('remoteService', function (localSettingsService) {
    var remote = new Transmission.Runtime.Remote(
        localSettingsService.get('servername'),
        localSettingsService.get('username'),
        localSettingsService.get('password')
    );

    return {
        sessionStats: function () {
            return remote.sessionStats();
        },

        getSession: function () {
            return remote.getSession();
        },

        getFreeSpace: function () {
            return remote.getFreeSpace();
        },

        getTorrentMetaData: function () {
            return remote.getTorrentMetaData();
        },

        getTorrentStats: function () {
            return remote.getTorrentStats();
        }
    };
});