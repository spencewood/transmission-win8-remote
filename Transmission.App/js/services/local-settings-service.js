mainApp.factory('localSettingsService', function () {
    return {
        get: localSettings.get,
        set: localSettings.set
    };
});