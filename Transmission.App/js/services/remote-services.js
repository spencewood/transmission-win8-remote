angular.module('RemoteServices', ['WinServices', 'xc.indexedDB'])
    .constant('objectStore', 'torrents')
    .config(function ($indexedDBProvider) {
        $indexedDBProvider
            .connection('transmissionDB1')
            .upgradeDatabase(1, function (event, db, tx) {
                var objStore = db.createObjectStore('torrents', { keyPath: 'id' });
                objStore.createIndex('name', 'name', { unique: true });
            });
    })
    .factory('remoteService', function ($rootScope, localSettingsService) {
        var remote = null;

        var spinnerStop = function () {
            $rootScope.$broadcast('spinner:stop');
        };

        var spinnerStart = function () {
            $rootScope.$broadcast('spinner:start');
        };

        return {
            init: function () {
                remote = new Transmission.Runtime.Remote(
                    localSettingsService.get('servername'),
                    localSettingsService.get('username'),
                    localSettingsService.get('password')
                );

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

            removeTorrents: function (ids, removeData) {
                return remote.removeTorrents(ids, removeData);
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
            },

            addTorrent: function (metainfo) {
                return remote.addTorrent(metainfo);
            }
        };
    })
    .provider('torrentService', function () {
        this.$get = function ($rootScope, $indexedDB, objectStore, remoteService) {
            var store = $indexedDB.objectStore(objectStore);

            return {
                timeoutToken: null,

                getTorrents: function () {
                    return store.getAll();
                },

                pollForTorrents: function () {
                    if (this.timeoutToken != null) {
                        clearTimeout(this.timeoutToken);
                        this.timeoutToken = null;
                    }
                    return this.updateTorrents().then(function (val) {
                        this.timeoutToken = setTimeout(this.pollForTorrents.bind(this), 10 * 1000);
                    }.bind(this));
                },

                updateTorrents: function () {
                    return remoteService.getTorrents().then(function (val) {
                        store
                            .clear()
                            .then(function () {
                                return store.insert(JSON.parse(val).arguments.torrents);
                            })
                            .then(function () {
                                $rootScope.$broadcast('torrents:updated');
                            });
                    });
                },

                findById: function (id) {
                    return _.findWhere(this.torrents, { id: id });
                },

                getNameById: function (id) {
                    var torrent = this.findById(id);
                    if (torrent !== null) {
                        return torrent.name;
                    }
                },

                start: function (ids) {
                    return remoteService.startTorrents(ids).then(this.pollForTorrents.bind(this));
                },

                stop: function (ids) {
                    return remoteService.stopTorrents(ids).then(this.pollForTorrents.bind(this));
                },

                verify: function (ids) {
                    return remoteService.verifyTorrents(ids).then(this.pollForTorrents.bind(this));
                },

                reannounce: function (ids) {
                    return remoteService.reannounceTorrents(ids).then(this.pollForTorrents.bind(this));
                },

                remove: function (ids, removeData) {
                    return remoteService.removeTorrents(ids, removeData).then(this.pollForTorrents.bind(this));
                },

                moveToTop: function (ids) {
                    return remoteService.moveTorrentsToTop(ids).then(this.pollForTorrents.bind(this));
                },

                moveToBottom: function (ids) {
                    return remoteService.moveTorrentsToBottom(ids).then(this.pollForTorrents.bind(this));
                },

                moveUp: function (ids) {
                    return remoteService.moveTorrentsUp(ids).then(this.pollForTorrents.bind(this));
                },

                moveDown: function (ids) {
                    return remoteService.moveTorrentsDown(ids).then(this.pollForTorrents.bind(this));
                },

                addTorrent: function (torrent) {
                    return Windows.Storage.FileIO.readBufferAsync(torrent).done(function (buffer) {
                        var bytes = new Uint8Array(buffer.length);
                        var dataReader = Windows.Storage.Streams.DataReader.fromBuffer(buffer);
                        dataReader.readBytes(bytes);
                        dataReader.close();

                        return remoteService.addTorrent(bytes);
                    }.bind(this));
                },

                addTorrents: function (torrents) {
                    torrents.forEach(this.addTorrent.bind(this));
                }
            };
        };
    });