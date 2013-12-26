angular.module('RemoteServices', ['WinServices', 'xc.indexedDB'])
    .constant('dbName', 'transmissionDB3')
    .constant('torrentStore', 'torrents')
    .constant('historyStore', 'history')
    .config(function ($indexedDBProvider, dbName, torrentStore, historyStore) {
        $indexedDBProvider
            .connection(dbName)
            .upgradeDatabase(1, function (event, db, tx) {
                if (event.oldVersion === 0) {
                    db.createObjectStore(torrentStore, { keyPath: 'id' })
                    //    .createIndex('name', 'name', { unique: true });
                    db.createObjectStore(historyStore, { keyPath: 'id' });
                }
            });

        $indexedDBProvider.onTransactionComplete = function (e) {
            //trasaction completed
        };

        $indexedDBProvider.onTransactionAbort = function (e) {
            console.warn('transaction aborted', JSON.stringify(e));
        };

        $indexedDBProvider.onTransactionError = function (e) {
            console.error('transaction error', JSON.stringify(e));
        };

        $indexedDBProvider.onDatabaseError = function (e) {
            console.error('database error', JSON.stringify(e));
        };

        $indexedDBProvider.onDatabaseBlocked = function (e) {
            console.error('database blocked', JSON.stringify(e));
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
                    localSettingsService.get('host'),
                    localSettingsService.get('port'),
                    localSettingsService.get('rpcPath'),
                    localSettingsService.get('useSsl'),
                    localSettingsService.get('username'),
                    localSettingsService.get('password')                    
                );

                return this;
            },

            sessionStats: function () {
                return remote.sessionStats();
            },

            getSettings: function () {
                return remote.getSession().then(function (val) {
                    //TODO: handle bad status
                    return JSON.parse(val).arguments;
                });
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

            addTorrent: function (byteArray) {
                return remote.addTorrent(byteArray);
            }
        };
    })
    .provider('torrentService', function () {
        this.$get = function ($rootScope, $indexedDB, torrentStore, historyStore, remoteService, statusService) {
            var dbTorrents = $indexedDB.objectStore(torrentStore);
            var dbHistory = $indexedDB.objectStore(historyStore);

            return {
                timeoutToken: null,

                getTorrents: function () {
                    return dbTorrents.getAll();
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

                insertTorrents: function (torrents) {
                    return dbTorrents.insert(torrents).then(function(){
                        $rootScope.$broadcast('torrents:inserted');
                        return torrents;
                    });
                },

                insertHistory: function (items) {
                    return dbHistory.getAll().then(function (histories) {
                        //histories.forEach(function (history) {
                        //    if (history.upSpeed + history.downSpeed === 0) {
                        //        //this will happen async... handle this
                        //        history.delete();
                        //    }
                        //});

                        //items.forEach(function (item) {
                        //    var hist = _.findWhere(histories, { id: item.id });
                        //    if (hist != null) {
                        //        hist.upSpeed.push(algo(item.upSpeed, hist.upSpeed));
                        //    }
                        //});
                    });
                },

                updateTorrentSpeeds: function (torrents) {
                    this.insertHistory(
                        torrents
                        .filter(statusService.statuses.active)
                        .map(function (torrent) {
                            var ret = { id: torrent.id };
                            if (torrent.downSpeed > 0) {
                                ret.downSpeed = torrent.downSpeed;
                            }
                            else {
                                ret.upSpeed = ret.upSpeed;
                            }
                        })
                    ).then(function(){
                        $rootScope.$broadcast('torrents:updated');
                    });
                },

                updateTorrents: function () {
                    return remoteService.getTorrents().then(function (val) {
                        dbTorrents
                            .clear()
                            .then(function () {
                                return JSON.parse(val).arguments.torrents;
                            })
                            .then(this.insertTorrents)
                            .then(this.updateTorrentSpeeds.bind(this));
                    }.bind(this));
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
                    });
                },

                addTorrents: function (torrents) {
                    torrents.forEach(this.addTorrent.bind(this));
                }
            };
        };
    });