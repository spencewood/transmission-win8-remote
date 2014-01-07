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
                    db.createObjectStore(torrentStore, { keyPath: 'id' });
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

        var getSingle = function (key) {
            return function (data)  {
                return _.first(data[key]);
            }
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

            setAlternateSpeed: function (enabled) {
                return remote.setSession(JSON.stringify({
                    'alt-speed-enabled': !!enabled
                })).then(handleResult);
            },

            getFreeSpace: function () {
                return remote.getFreeSpace().then(handleResult);
            },

            getTorrents: function () {
                return remote.getTorrents()
                    .then(handleResult)
                    .then(function (ret) {
                        return ret.torrents;
                    });
            },

            getTorrent: function (id) {
                return remote.getTorrent(id)
                    .then(handleResult)
                    .then(getSingle('torrents'));
            },

            getPeers: function (id) {
                return remote.getPeers(id)
                    .then(handleResult)
                    .then(getSingle('torrents'));
            },

            getFiles: function (id) {
                return remote.getFiles(id)
                    .then(handleResult)
                    .then(getSingle('torrents'));
            },

            getTrackers: function (id) {
                return remote.getTrackers(id)
                    .then(handleResult)
                    .then(getSingle('torrents'));
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
        this.$get = function ($rootScope, $indexedDB, torrentStore, remoteService, statusService, localSettingsService) {
            var dbTorrents = $indexedDB.objectStore(torrentStore);

            return {
                getTorrents: function () {
                    return dbTorrents.getAll();
                },

                getTorrent: function (id) {
                    return dbTorrents.find(id);
                },

                insertTorrents: function (torrents) {
                    return dbTorrents.upsert(torrents);
                },

                updateTorrents: function () {
                    return remoteService.getTorrents()
                        .then(function (val) {
                            dbTorrents.clear();
                            return val;
                        })
                        .then(function (val) {
                            this.insertTorrents(val);
                            return val;
                        }.bind(this));
                },

                updateTorrent: function (id) {
                    return remoteService.getTorrent(id)
                        .then(function (val) {
                            this.insertTorrents(val);
                            return val;
                        }.bind(this));
                },

                getFiles: function (id) {
                    return remoteService.getFiles(id);
                },

                getTrackers: function (id) {
                    return remoteService.getTrackers(id);
                },

                getPeers: function (id) {
                    return remoteService.getPeers(id);
                },

                start: function (ids) {
                    return remoteService.startTorrents(ids);
                },

                stop: function (ids) {
                    return remoteService.stopTorrents(ids);
                },

                verify: function (ids) {
                    return remoteService.verifyTorrents(ids);
                },

                reannounce: function (ids) {
                    return remoteService.reannounceTorrents(ids);
                },

                remove: function (ids, removeData) {
                    return remoteService.removeTorrents(ids, removeData);
                },

                moveToTop: function (ids) {
                    return remoteService.moveTorrentsToTop(ids);
                },

                moveToBottom: function (ids) {
                    return remoteService.moveTorrentsToBottom(ids);
                },

                moveUp: function (ids) {
                    return remoteService.moveTorrentsUp(ids);
                },

                moveDown: function (ids) {
                    return remoteService.moveTorrentsDown(ids);
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