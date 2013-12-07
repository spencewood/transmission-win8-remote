mainApp.factory('localSettingsService', function () {
    var applicationData = Windows.Storage.ApplicationData.current;
    var localSettings = applicationData.localSettings;

    return {
        get: function (setting) {
            if (setting in localSettings.values) {
                return localSettings.values[setting];
            }
            throw new Error('Setting not found');
        }
    }
});