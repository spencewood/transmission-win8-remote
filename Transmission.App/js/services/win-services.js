angular.module('WinServices', ['EventService'])
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
                return JSON.parse(localSettings.values[key]);
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
                localSettings.values[key] = JSON.stringify(value);
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

        var storeUnits = function (units) {
            setAllByPrefix('units', JSON.stringify(units));
        };

        var getUnits = function () {
            return JSON.parse(getAllByPrefix('units'));
        }

        return {
            get: get,
            set: set,
            getServerSettings: function (id) {
                /*return _.merge(
                    {//defaults
                        port: 9091,
                        rpcPath: '/transmission/rpc'
                    },
                    getAllByPrefix('server', true)
                );*/
                var servers = get('servers');



                if (typeof id !== 'undefined') {
                    return _.findWhere(servers, { id: id });
                }
                return servers;
            },
            setServerSettings: function (settings) {
                //var servers = this.getServerSettings();
                //servers.list.find({ id: settings.id });[idx] = settings;
                //setAllByPrefix('servers', servers);
            },
            addServerSettings: function (settings) {
                var servers = this.getServerSettings();

                if (settings.id == null) {
                    settings.id = _.uid();
                }
                if (!_.isArray(servers)) {
                    servers = [];
                }
                
                servers.push(settings);
                set('servers', servers);
            },
            removeServerSettings: function (id) {
                var servers = this.getServerSettings();
                _.remove(servers, function (server) { return server.id === id; });
                set('servers', servers);
            },
            getTransmissionSettings: function (settings) {
                return getAllByPrefix('transmission', true);
            },
            setTransmissionSettings: function (settings) {
                if ('units' in settings) {
                    storeUnits(settings.units);
                    delete settings.units;
                }
                setAllByPrefix('transmission', settings);
            },
            getUnits: getUnits,
            getInterfaceSettings: function () {
                return _.extend(
                    {//defaults
                        refreshActive: 10,
                        refreshInactive: 30
                    },
                    getAllByPrefix('interface', true)
                );
            },
            setInterfaceSettings: function (settings) {
                setAllByPrefix('interface', settings);
            }
        };
    })
    .factory('navigationService', function (event) {
        return {
            navigate: function () {
                event.emit('navigated', _.first(arguments).match(/\/([^\/]+)\.\w+/).pop());
                WinJS.Navigation.navigate.apply(WinJS, _.toArray(arguments));
            },
            showTorrentDetails: function (id) {
                this.navigate('/views/torrent-details.html', { id: id });
            },
            showServerDetails: function (id) {
                this.navigate('/views/torrents.html', { id: id });
            },
            showSettingsFlyout: function () {
                var args = _.toArray(arguments);
                if (args.length === 0) {
                    WinJS.UI.SettingsFlyout.show;
                }
                else {
                    WinJS.UI.SettingsFlyout.showSettings.apply(WinJS, args);
                }
            },
            goHome: function () {
                this.navigate('/views/torrents.html');
            }
        };
    });