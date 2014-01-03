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

        var storeUnits = function (units) {
            setAllByPrefix('units', JSON.stringify(units));
        };

        var getUnits = function () {
            return JSON.parse(getAllByPrefix('units'));
        }

        return {
            get: get,
            set: set,
            getServerSettings: function () {
                return _.merge(
                    {//defaults
                        port: 9091,
                        rpcPath: '/transmission/rpc'
                    },
                    getAllByPrefix('server', true)
                );
                
            },
            setServerSettings: function (settings) {
                setAllByPrefix('server', settings);
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
                return _.merge(
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
    .factory('navigationService', function () {
        return {
            navigate: WinJS.Navigation.navigate,
            showSettingsFlyout: WinJS.UI.SettingsFlyout.show,
            goHome: function () {
                WinJS.Navigation.navigate('/views/torrents.html');
            }
        };
    });