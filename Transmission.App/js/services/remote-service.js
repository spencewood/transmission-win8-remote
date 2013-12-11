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
            sess.then(spinnerStop)
            return sess;
        },

        getTorrentStats: function () {
            return remote.getTorrentStats();
        }
    };
});