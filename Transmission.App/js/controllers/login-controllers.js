angular.module('Login', ['RemoteServices', 'WinServices'])
    .controller('LoginController', function ($scope, localSettingsService, remoteService, navigationService) {
        $scope.settings = localSettingsService.getServerSettings();
        $scope.login = function () {
            $scope.errorMessage = '';
            if (!$scope.authRequired) {
                $scope.settings.username = '';
                $scope.settings.password = '';
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