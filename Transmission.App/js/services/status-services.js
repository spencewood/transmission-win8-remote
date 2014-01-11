angular.module('StatusServices', [])
    .factory('statusService', function ($location) {
        return {
            statuses: {
                downloading: function (item) {
                    return item.status === Status.statuses.downloadWait ||
                        item.status === Status.statuses.download;
                },

                seeding: function (item) {
                    return item.status === Status.statuses.seedWait ||
                        item.status === Status.statuses.seed;
                },

                active: function (item) {
                    return (item.rateDownload
                        + item.rateUpload > 0) ||
                        item.status === Status.statuses.check;
                },

                inactive: function (item) {
                    return item.rateDownload + item.rateUpload === 0;
                },

                stopped: function (item) {
                    return item.status === Status.statuses.stopped;
                },

                paused: function (item) {
                    return this.stopped(item);
                },

                finished: function (item) {
                    return this.isFinished;
                },

                verifying: function (item) {
                    return item.status === Status.statuses.checkWait ||
                        item.status === Status.statuses.check;
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