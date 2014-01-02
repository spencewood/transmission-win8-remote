angular.module('WinServices', [])
    .factory('dialogService', function () {
        return {
            prompt: function (message) {
                var cmds = _.rest(arguments);
                var md = new Windows.UI.Popups.MessageDialog(message);

                cmds.forEach(function (cmd) {
                    md.commands.append(new Windows.UI.Popups.UICommand(cmd));
                });
                return md.showAsync();
            }
        };
    })
    .factory('localSettingsService', function () {
        var applicationData = Windows.Storage.ApplicationData.current;
        var localSettings = applicationData.localSettings;

        var get = function (key) {
            if (key in localSettings.values) {
                return localSettings.values[key];
            }
            return '';
        };

        var getAllByPrefix = function (prefix, dropPrefix) {
            var prefixRegEx = new RegExp('^' + prefix + '.');
            var retObj = {};
            for (var item in localSettings.values) {
                if (item.match(prefixRegEx)) {
                    var retKey = item;
                    if (dropPrefix) {
                        retKey = retKey.replace(prefixRegEx, '');
                    }
                    retObj[retKey] = localSettings.values[item];
                }
            }
            return retObj;
        };

        var set = function (key, value) {
            if (_.isObject(key)) {
                //set multiple values
                _.extend(localSettings.values, key);
            }
            else {
                //set one value
                localSettings.values[key] = value;
            }
            return localSettings;
        };

        var setAllByPrefix = function (prefix, obj) {
            var newObj = {};
            for (var item in obj) {
                newObj[prefix + '.' + item] = obj[item];
            }
            return set(newObj);
        };

        return {
            get: get,
            set: set,
            getServerSettings: function () {
                return getAllByPrefix('server', true);
            },
            setServerSettings: function (settings) {
                setAllByPrefix('server', {
                    host: settings.host,
                    port: settings.port,
                    useSsl: settings.useSsl,
                    rpcPath: settings.rpcPath,
                    username: settings.username,
                    password: settings.password
                });
            },
            getTransmissionSettings: function (settings) {
                return getAllByPrefix('transmission', true);
            },
            setTransmissionSettings: function (settings) {
                setAllByPrefix('transmission', {
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

                    //info
                    //'units': settings.units,
                    'version': settings.version
                });
            }
        };
    })
    .factory('navigationService', function () {
        return {
            navigate: WinJS.Navigation.navigate
        };
    });


//'version': '2.82 (14160)'
    //'units': {
    //    'memory-bytes': 1024,
    //    'memory-units': [
    //        'KiB',
    //        'MiB',
    //        'GiB',
    //        'TiB'
    //    ],
    //    'size-bytes': 1000,
    //    'size-units': [
    //        'kB',
    //        'MB',
    //        'GB',
    //        'TB'
    //    ],
    //    'speed-bytes': 1000,
    //    'speed-units': [
    //        'kB/s',
    //        'MB/s',
    //        'GB/s',
    //        'TB/s'
    //    ]
    //},