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

        var set = function (key, value) {
            localSettings.values[key] = value;
        };

        return {
            get: get,
            set: set,
            getServerSettings: function () {
                return {
                    host: get('host'),
                    port: get('port'),
                    useSsl: get('useSsl'),
                    rpcPath: get('rpcPath'),
                    username: get('username'),
                    password: get('password')
                };
            },
            setServerSettings: function (settings) {
                set('host', settings.host);
                set('port', settings.port);
                set('useSsl', settings.useSsl);
                set('rpcPath', settings.rpcPath);
                set('username', settings.username);
                set('password', settings.password);
            },
            setTransmissionSettings: function (settings) {
                for (var setting in settings) {
                    if (settings.hasOwnProperty(setting)) {
                        
                    }
                }
            }
        };
    })
    .factory('navigationService', function () {
        return {
            navigate: WinJS.Navigation.navigate
        };
    });