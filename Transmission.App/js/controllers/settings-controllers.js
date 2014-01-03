angular.module('Settings', ['RemoteServices', 'WinServices'])
    .controller('ServerSettings', function ($scope, localSettingsService, navigationService) {
        $scope.settings = localSettingsService.getServerSettings();
        var back = $scope.back = navigationService.showSettingsFlyout;

        $scope.save = function () {
            localSettingsService.setServerSettings($scope.settings);
            back();
        };
    })
    .controller('TransmissionSettings', function ($scope, localSettingsService, remoteService, navigationService, encryptionOptions) {
        //TODO: pull in units for use on display (e.g. MB)
        //TODO: show loading spinner
        $scope.encryptionOptions = encryptionOptions;
        $scope.settings = localSettingsService.getTransmissionSettings();
        var back = $scope.back = navigationService.showSettingsFlyout;
        $scope.portStatus = 'checking'

        remoteService.init().testPort().then(function (portIsOpen) {
            //TODO: make this a check, x or spinner for open or closed
            $scope.portStatus = portIsOpen ? 'open' : 'closed';
            $scope.$apply();
        });

        $scope.save = function () {
            remoteService.setSettings($scope.settings)
                .then(function () {
                    localSettingsService.setTransmissionSettings($scope.settings);
                    back();
                });
        };
    })
    .controller('InterfaceSettings', function ($scope, localSettingsService, navigationService) {
        $scope.settings = localSettingsService.getInterfaceSettings();
        var back = $scope.back = navigationService.showSettingsFlyout;

        $scope.save = function () {
            localSettingsService.setInterfaceSettings($scope.settings);
            back();
        };
    });