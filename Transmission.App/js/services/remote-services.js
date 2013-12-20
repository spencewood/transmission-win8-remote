angular.module('RemoteServices', ['WinServices'])
    .provider('dbService', function () {

        const DB_NAME = 'transmission2';
        const DB_VERSION = 1;
        const DB_STORE_NAME = 'torrents';

        var openDb = function () {
            return new WinJS.Promise(function (complete, error) {
                var req = indexedDB.open(DB_NAME, DB_VERSION);
                req.onsuccess = function (res) {
                    return complete(res.target.result);
                };
                req.onerror = error;

                req.onupgradeneeded = function (evt) {
                    console.log("openDb.onupgradeneeded");
                    var store = evt.currentTarget.result.createObjectStore(
                      DB_STORE_NAME, { keyPath: 'id' });

                    store.createIndex('name', 'name', { unique: true });
                };
            });
        }

        this.$get = function () {
            return {
                clear: function () {
                    return new WinJS.Promise(function (complete, error) {
                        return openDb().then(function (db) {
                            var transaction = db.transaction(['torrents'], 'readwrite');
                            var store = transaction.objectStore('torrents');
                            var request = store.clear();

                            request.onsuccess = complete;
                            request.onerror = error;
                        });
                    });
                },
                add: function (items) {
                    return new WinJS.Promise(function (complete, error) {
                        return openDb().then(function (db) {
                            var transaction = db.transaction(['torrents'], 'readwrite');
                            var store = transaction.objectStore('torrents');

                            putNext();

                            function putNext(i) {
                                i = i || 0;
                                if (i < items.length) {
                                    store.put(items[i]).onsuccess = putNext(++i);
                                }
                                else {
                                    complete();
                                }
                            }

                            transaction.onerror = error;
                        });
                    });
                },
                merge: function (items) {

                },
                get: function (key) {
                    return new WinJS.Promise(function (complete, error) {
                        return openDb().then(function (db) {
                            var transaction = db.transaction(['torrents'], 'readonly');
                            var store = transaction.objectStore('torrents');
                            var request = store.get(key);

                            request.onsuccess = function (res) {
                                return complete(res.target.result);
                            };
                            request.onerror = error;
                        });
                    });
                },
                getAll: function (fields) {
                    return new WinJS.Promise(function (complete, error) {
                        return openDb().then(function (db) {
                            var transaction = db.transaction(['torrents'], 'readonly');
                            var store = transaction.objectStore('torrents');

                            var torrents = [];

                            store.openCursor().onsuccess = function (event) {
                                var cursor = event.target.result;
                                if (cursor) {
                                    torrents.push(cursor.value);
                                    cursor.continue();
                                }
                                else {
                                    complete(torrents);
                                }
                            };

                            transaction.onerror = error;
                        });
                    });
                }
            }
        };
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
    .factory('torrentService', function ($rootScope, remoteService, dbService) {
        return {
            timeoutToken: null,

            getTorrents: function () {
                return dbService.getAll();
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
                    dbService.clear().then(function () {
                        return dbService.add(JSON.parse(val).arguments.torrents);
                    }).then(function () {
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

            add: function (metainfo) {
                return remoteService.addTorrent(metainfo).then(this.pollForTorrents.bind(this));
            }
        }
    });