mainApp.factory('statusService', function (status) {
    return {
        downloading: function (item) {
            return item.status === status.downloadWait ||
                item.status === status.download;
        },

        active: function (item) {
            return item.rateDownload + item.rateUpload > 0;
        },

        inactive: function (item) {
            return item.rateDownload + item.rateUpload === 0;
        },

        stopped: function (item) {
            return item.status === status.stopped;
        },

        error: function (item) {
            return item.error;
        }
    }
});