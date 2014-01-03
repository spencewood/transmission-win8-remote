angular.module('RemoteServices', ['WinServices', 'xc.indexedDB'])
    .constant('dbName', 'transmissionDB3')
    .constant('torrentStore', 'torrents')
    .constant('historyStore', 'history')
    .constant('encryptionOptions', [
        { name: 'Disabled', value: 'tolerated' },
        { name: 'Enabled', value: 'preferred' },
        { name: 'Required', value: 'required' }
    ])
    .config(function ($indexedDBProvider, dbName, torrentStore) {
        $indexedDBProvider
            .connection(dbName)
            .upgradeDatabase(1, function (event, db, tx) {
                if (event.oldVersion === 0) {
                    db.createObjectStore(torrentStore, { keyPath: 'id' })
                    //    .createIndex('name', 'name', { unique: true });
                    //db.createObjectStore(historyStore, { keyPath: 'id' });
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

        var handleResult = function (res) {
            var r = JSON.parse(res);
            if (r.result !== 'success') {
                throw new Error(r.result, res);
            }
            return r.arguments;
        };

        var spinnerStop = function () {
            $rootScope.$broadcast('spinner:stop');
        };

        var spinnerStart = function () {
            $rootScope.$broadcast('spinner:start');
        };

        return {
            init: function () {
                var settings = localSettingsService.getServerSettings();
                remote = new Transmission.Runtime.Remote(
                    settings.host,
                    settings.port,
                    settings.rpcPath,
                    settings.useSsl,
                    settings.username,
                    settings.password
                );

                return this;
            },

            sessionStats: function () {
                return remote.sessionStats();
            },

            getSettings: function () {
                return remote.getSession().then(handleResult);
            },

            setSettings: function (settings) {
                var updated = {
                    'alt-speed-down': settings['alt-speed-down'],
                    'alt-speed-enabled': settings['alt-speed-enabled'],
                    'alt-speed-time-begin': settings['alt-speed-time-begin'],
                    'alt-speed-time-day': settings['alt-speed-time-day'],
                    'alt-speed-time-enabled': settings['alt-speed-time-enabled'],
                    'alt-speed-time-end': settings['alt-speed-time-end'],
                    'alt-speed-up': settings['alt-speed-up'],
                    'blocklist-enabled': settings['blocklist-enabled'],
                    'blocklist-size': settings['blocklist-size'],
                    'blocklist-url': settings['blocklist-url'],
                    'cache-size-mb': settings['cache-size-mb'],
                    'config-dir': settings['config-dir'],
                    'dht-enabled': settings['dht-enabled'],
                    'download-dir': settings['download-dir'],
                    'download-dir-free-space': settings['download-dir-free-space'],
                    'download-queue-enabled': settings['download-queue-enabled'],
                    'download-queue-size': settings['download-queue-size'],
                    'encryption': settings.encryption,
                    'idle-seeding-limit': settings['idle-seeding-limit'],
                    'idle-seeding-limit-enabled': settings['idle-seeding-limit-enabled'],
                    'incomplete-dir': settings['incomplete-dir'],
                    'incomplete-dir-enabled': settings['incomplete-dir-enabled'],
                    'lpd-enabled': settings['lpd-enabled'],
                    'peer-limit-global': settings['peer-limit-global'],
                    'peer-limit-per-torrent': settings['peer-limit-per-torrent'],
                    'peer-port': settings['peer-port'],
                    'peer-port-random-on-start': settings['peer-port-random-on-start'],
                    'pex-enabled': settings['pex-enabled'],
                    'port-forwarding-enabled': settings['port-forwarding-enabled'],
                    'queue-stalled-enabled': settings['queue-stalled-enabled'],
                    'queue-stalled-minutes': settings['queue-stalled-minutes'],
                    'rename-partial-files': settings['rename-partial-files'],
                    'rpc-version': settings['rpc-version'],
                    'rpc-version-minimum': settings['rpc-version-minimum'],
                    'script-torrent-done-enabled': settings['script-torrent-done-enabled'],
                    'script-torrent-done-filename': settings['script-torrent-done-filename'],
                    'seed-queue-enabled': settings['seed-queue-enabled'],
                    'seed-queue-size': settings['seed-queue-size'],
                    'seedRatioLimit': settings.seedRatioLimit,
                    'seedRatioLimited': settings.seedRatioLimited,
                    'speed-limit-down': settings['speed-limit-down'],
                    'speed-limit-down-enabled': settings['speed-limit-down-enabled'],
                    'speed-limit-up': settings['speed-limit-up'],
                    'speed-limit-up-enabled': settings['speed-limit-up-enabled'],
                    'start-added-torrents': settings['start-added-torrents'],
                    'trash-original-torrent-files': settings['trash-original-torrent-files'],
                    'utp-enabled': settings['utp-enabled'],
                };

                return remote.setSession(JSON.stringify(settings)).then(handleResult);
            },

            getFreeSpace: function () {
                return remote.getFreeSpace().then(handleResult);
            },

            getTorrents: function () {
                spinnerStart();
                var sess = remote.getTorrents();
                sess.then(spinnerStop);
                return sess;
            },

            getTorrentStats: function () {
                return remote.getTorrentStats().then(handleResult);
            },

            startTorrents: function (ids) {
                return remote.startTorrents(ids).then(handleResult);
            },

            stopTorrents: function (ids) {
                return remote.stopTorrents(ids).then(handleResult);
            },

            verifyTorrents: function (ids) {
                return remote.verifyTorrents(ids).then(handleResult);
            },

            reannounceTorrents: function (ids) {
                return remote.reannounceTorrents(ids).then(handleResult);
            },

            removeTorrents: function (ids, removeData) {
                return remote.removeTorrents(ids, removeData).then(handleResult);
            },

            moveTorrentsToTop: function (ids) {
                return remote.moveTorrentsToTop(ids).then(handleResult);
            },

            moveTorrentsToBottom: function (ids) {
                return remote.moveTorrentsToBottom(ids).then(handleResult);
            },

            moveTorrentsUp: function (ids) {
                return remote.moveTorrentsUp(ids).then(handleResult);
            },

            moveTorrentsDown: function (ids) {
                return remote.moveTorrentsDown(ids).then(handleResult);
            },

            addTorrent: function (byteArray) {
                return remote.addTorrent(byteArray).then(handleResult);
            },

            testPort: function () {
                return remote.testPort()
                    .then(handleResult)
                    .then(function (ret) {
                        return ret['port-is-open'];
                    });
            }
        };
    })
    .provider('torrentService', function () {
        this.$get = function ($rootScope, $indexedDB, $q, torrentStore, remoteService, statusService, localSettingsService) {
            var dbTorrents = $indexedDB.objectStore(torrentStore);
            //var dbHistory = $indexedDB.objectStore(historyStore);

            return {
                timeoutToken: null,

                getTorrents: function () {
                    return dbTorrents.getAll();
                },

                //getHistory: function () {
                //    return dbHistory.getAll();
                //},

                //clearHistory: function () {
                //    return dbHistory.clear();
                //},

                getUpdatedTorrents: function () {
                    return this.getTorrents();
                    //return $q.all([this.getTorrents(), this.getHistory()])
                    //    .then(function (data) {
                    //        var torrents = data[0];
                    //        var history = data[1];
                    //        torrents.forEach(function (torrent) {
                    //            var hist = _.findWhere(history, { id: torrent.id });
                    //            if (typeof hist !== 'undefined') {
                    //                torrent.rateUpload = hist.rateUpload;
                    //                torrent.rateDownload = hist.rateDownload;
                    //            }
                    //        });
                    //        return torrents;
                    //    });
                },

                pollForTorrents: function () {
                    //TODO: make polling different when not focused

                    if (this.timeoutToken != null) {
                        clearTimeout(this.timeoutToken);
                        this.timeoutToken = null;
                    }
                    return this.updateTorrents()
                        .then(localSettingsService.getInterfaceSettings)
                        .then(function () {
                            this.timeoutToken = setTimeout(
                                this.pollForTorrents.bind(this),
                                localSettingsService.getInterfaceSettings().refreshActive * 1000
                            );
                        }.bind(this));
                },

                insertTorrents: function (torrents) {
                    return dbTorrents.insert(torrents).then(function(){
                        $rootScope.$broadcast('torrents:inserted');
                        return torrents;
                    });
                },

                //insertHistory: function (items) {
                //    //TODO: refactor
                //    var active = function (history) {
                //        return history.rateUpload + history.rateDownload > 0;
                //    };
                //    var activeItems = items.filter(active);

                //    //update
                //    var deferreds = [];
                //    activeItems.forEach(function (item) {
                //        deferreds.push(dbHistory.find(item.id).then(function (history) {
                //            var h = { id: item.id };
                //            history = history || {};
                            
                //            h.up = history.up || [];
                //            h.down = history.down || [];
                //            h.rateUpload = history.rateUpload || 0;
                //            h.rateDownload = history.rateDownload || 0;

                //            //TODO: make this dynamic
                //            var arrayLimit = 5;

                //            if (item.rateUpload > 0 || h.up.length > 0) {
                //                h.up.push(item.rateUpload);
                //                h.rateUpload = _.average(h.up);
                //                //_.shiftArrayToSize(h.up, arrayLimit);
                //            }
                //            if (item.rateDownload > 0 || h.down.length > 0) {
                //                h.down.push(item.rateDownload);
                //                h.rateDownload = _.average(h.down);
                //                //_.shiftArrayToSize(h.up, arrayLimit);
                //            }
                //            return dbHistory.upsert(h);
                //        }));
                //    });

                //    return $q.all(deferreds).then(function(){
                //        //delete
                //        return dbHistory.getAll().then(function (histories) {
                //            var defs = [];
                //            histories.filter(function (history) {
                //                return history.rateDownload + history.rateUpload === 0;
                //            }).forEach(function (history) {
                //                defs.push(dbHistory.delete(history.id));
                //            });

                //            return $q.all(defs);
                //        });
                //    });
                //},

                //updateTorrentSpeeds: function (torrents) {
                //    this.insertHistory(torrents).then(function(){
                //        $rootScope.$broadcast('torrents:updated');
                //    });
                //},

                updateTorrents: function () {
                    return remoteService.getTorrents()
                        .then(function (val) {
                            dbTorrents.clear();
                            return val;
                        })
                        .then(function (val) {
                            return JSON.parse(val).arguments.torrents;
                        })
                        .then(this.insertTorrents);
                        //.then(this.updateTorrentSpeeds.bind(this));
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