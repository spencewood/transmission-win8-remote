angular.module('Settings', ['RemoteServices', 'WinServices', 'EventService'])
    .constant('loginDefault', {
        rpcPath: '/transmission/rpc',
        port: 9091,
        rpcPathMatch: /^\/transmission\/rpc\/?$/
    })
    .controller('ServerSettings', function ($scope, localSettingsService, navigationService, event, loginDefault) {
        var getSettings = function () {
            $scope.errorMessage = '';
            if (!$scope.authRequired) {
                $scope.settings.username = '';
                $scope.settings.password = '';
            }
            if ($scope.defaultRpc) {
                $scope.settings.rpcPath = loginDefault.rpcPath;
            }

            return $scope.settings;
        };

        var serverIdx = null;
        if (serverIdx !== null) {
            $scope.settings = localSettingsService.getServerSettings();
            $scope.authRequired = $scope.settings.username.length > 0;
        }
        else {
            $scope.settings = {
                rpcPath: loginDefault.rpcPath,
                port: loginDefault.port
            };
        }
        $scope.defaultRpc = loginDefault.rpcPathMatch.test($scope.settings.rpcPath);
        $scope.errorMessage = '';

        var back = $scope.back = navigationService.showSettingsFlyout;

        $scope.save = function () {
            if (serverIdx !== null) {
                localSettingsService.setServerSettings(serverIdx, $scope.settings);
            }
            else {
                localSettingsService.addServerSettings($scope.settings);
            }
            event.emit('settings:server:save');

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