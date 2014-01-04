angular.module('StatusServices', [])
    .constant('status', {
        stopped: 0,
        checkWait: 1,
        check: 2,
        downloadWait: 3,
        download: 4,
        seedWait: 5,
        seed: 6
    })
    .factory('statusService', function ($location, status) {
        var statusRegex = /\/(\w+)$/;

        return {
            getLocationStatus: function (){
                return 'all';//$location.url().match(statusRegex)[1];
            },

            statuses: {
                downloading: function (item) {
                    return item.status === status.downloadWait ||
                        item.status === status.download;
                },

                seeding: function (item) {
                    return item.status === status.seedWait ||
                        item.status === status.seed;
                },

                active: function (item) {
                    return (item.rateDownload
                        + item.rateUpload > 0) ||
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
        }
    });

/*
// Torrent.fields.status
Torrent._StatusStopped         = 0;
Torrent._StatusCheckWait       = 1;
Torrent._StatusCheck           = 2;
Torrent._StatusDownloadWait    = 3;
Torrent._StatusDownload        = 4;
Torrent._StatusSeedWait        = 5;
Torrent._StatusSeed            = 6;

// Torrent.fields.seedRatioMode
Torrent._RatioUseGlobal        = 0;
Torrent._RatioUseLocal         = 1;
Torrent._RatioUnlimited        = 2;

// Torrent.fields.error
Torrent._ErrNone               = 0;
Torrent._ErrTrackerWarning     = 1;
Torrent._ErrTrackerError       = 2;
Torrent._ErrLocalError         = 3;

// TrackerStats' announceState
Torrent._TrackerInactive       = 0;
Torrent._TrackerWaiting        = 1;
Torrent._TrackerQueued         = 2;
Torrent._TrackerActive         = 3;
*/