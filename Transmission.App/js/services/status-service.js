mainApp.factory('statusService', function (status) {
    return {
        downloading: function (item) {
            return item.status === status.downloadWait ||
                item.status === status.download;
        },

        seeding: function (item) {
            return item.status === status.seedWait ||
                item.status === status.seed;
        },

        active: function (item) {
            return (item.peersSendingToUs
                + item.peersGettingFromUs
                + item.webseedsSendingToUs > 0) ||
                item.status === status.check;
        },

        inactive: function (item) {
            return item.rateDownload + item.rateUpload === 0;
        },

        stopped: function (item) {
            return item.status === status.stopped;
        },

        paused: function (item) {
            return this.stopped(item);
        },

        finished: function (item) {
            return this.isFinished;
        },

        verifying: function (item) {
            return item.status === status.checkWait ||
                item.status === status.check;
        },

        error: function (item) {
            return item.error != 0;
        }
    }
});