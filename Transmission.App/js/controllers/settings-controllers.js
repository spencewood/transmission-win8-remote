angular.module('Settings', ['RemoteServices', 'WinServices'])
    .controller('ServerSettings', function ($scope, localSettingsService) {
        $scope.settings = localSettingsService.getServerSettings();
    })
    .controller('TransmissionSettings', function ($scope, localSettingsService, encryptionOptions) {
        //TODO: pull in units for use on display (e.g. MB)
        //TODO: test port
        $scope.encryptionOptions = encryptionOptions;
        $scope.settings = localSettingsService.getTransmissionSettings();
    });