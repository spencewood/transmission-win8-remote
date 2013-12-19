(function () {
    'use strict';

    var applicationData = Windows.Storage.ApplicationData.current;
    var localSettings = applicationData.localSettings;

    WinJS.Namespace.define('localSettings', {
        get: function (key) {
            if (key in localSettings.values) {
                return localSettings.values[key];
            }
            return '';
        },

        set: function (key, value) {
            localSettings.values[key] = value;
        }
    });
})();