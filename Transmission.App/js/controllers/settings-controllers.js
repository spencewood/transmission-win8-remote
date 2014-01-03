angular.module('Settings', ['RemoteServices', 'WinServices'])
    .controller('ServerSettings', function ($scope, localSettingsService, navigationService) {
        $scope.settings = localSettingsService.getServerSettings();
        var back = $scope.back = navigationService.showSettingsFlyout;

        $scope.save = function () {
            localSettingsService.setServerSettings($scope.settings);
            back();
            navigationService.goHome();
        };
    })
    .controller('TransmissionSettings', function ($scope, localSettingsService, remoteService, navigationService, encryptionOptions) {
        //TODO: pull in units for use on display (e.g. MB)
        //TODO: test port
        //TODO: show loading spinner
        $scope.encryptionOptions = encryptionOptions;
        $scope.settings = localSettingsService.getTransmissionSettings();
        var back = $scope.back = navigationService.showSettingsFlyout;

        $scope.save = function () {
            remoteService.init().setSettings($scope.settings)
                .then(function () {
                    localSettingsService.setTransmissionSettings($scope.settings);
                    back();
                });
        };
    });