angular.module('Settings', ['RemoteServices', 'WinServices'])
    .controller('ServerSettings', function ($scope, localSettingsService) {
        $scope.settings = localSettingsService.getServerSettings();
    })
    .controller('TransmissionSettings', function ($scope, localSettingsService, remoteService, encryptionOptions) {
        //TODO: pull in units for use on display (e.g. MB)
        //TODO: test port
        $scope.encryptionOptions = encryptionOptions;
        $scope.settings = localSettingsService.getTransmissionSettings();

        $scope.save = function () {
            remoteService.init().setSettings($scope.settings)
                .then(remoteService.getSettings)
                .then(localSettingsService.setTransmissionSettings);
        };
    });