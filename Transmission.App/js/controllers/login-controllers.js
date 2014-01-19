angular.module('Login', ['RemoteServices', 'WinServices'])
    .constant('loginDefault', {
        rpcPath: '/transmission/rpc',
        rpcPathMatch: /^\/transmission\/rpc\/?$/
    })
    .controller('LoginController', function ($scope, localSettingsService, remoteService, navigationService, loginDefault) {
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

        var save = function () {
            return remoteService.init().getSettings()
                .then(function (settings) {
                    localSettingsService.setTransmissionSettings(settings);
                    navigationService.goHome();
                }, function (e) {
                    $scope.errorMessage = 'Unable to connect to server';
                    $scope.$apply();
                });
        };

        var setSettings = localSettingsService.setServerSettings.bind(localSettingsService);

        $scope.settings = localSettingsService.getServerSettings();
        $scope.defaultRpc = loginDefault.rpcPathMatch.test($scope.settings.rpcPath);
        $scope.errorMessage = '';
        $scope.authRequired = $scope.settings.username.length > 0;

        $scope.login = _.compose(
            save,
            setSettings,
            getSettings
        );
        
        $scope.$on('$destroy', function () {
            console.log('destroying login controller');
        });
    });