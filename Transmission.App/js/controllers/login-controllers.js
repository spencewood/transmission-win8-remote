angular.module('Login', ['RemoteServices', 'WinServices'])
    .constant('loginDefault', {
        rpcPath: '/transmission/rpc',
        rpcPathMatch: /^\/transmission\/rpc\/?$/
    })
    .controller('LoginController', function ($scope, localSettingsService, remoteService, navigationService, loginDefault) {
        $scope.settings = localSettingsService.getServerSettings();
        $scope.defaultRpc = loginDefault.rpcPathMatch.test($scope.settings.rpcPath);
        $scope.login = function () {
            $scope.errorMessage = '';
            if (!$scope.authRequired) {
                $scope.settings.username = '';
                $scope.settings.password = '';
            }
            if ($scope.defaultRpc) {
                $scope.settings.rpcPath = loginDefault.rpcPath;
            }
            localSettingsService.setServerSettings($scope.settings);
            remoteService.init().getSettings()
                .then(function (settings) {
                    localSettingsService.setTransmissionSettings(settings);
                    navigationService.goHome();
                }, function (e) {
                    $scope.errorMessage = 'Unable to connect to server';
                    $scope.$apply();
                });
        };

        $scope.errorMessage = '';
        $scope.authRequired = $scope.settings.username.length > 0;

        $scope.$on('$destroy', function () {
            console.log('destroying login controller');
        });
    });