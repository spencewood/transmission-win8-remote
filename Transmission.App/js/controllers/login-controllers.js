angular.module('Login', ['RemoteServices', 'WinServices'])
    .controller('LoginController', function ($scope, localSettingsService, remoteService, navigationService) {
        var settings = $scope.settings = localSettingsService.getServerSettings();
        $scope.errorMessage = '';
        $scope.authRequired = settings.username.length > 0;

        var login = $scope.login = function () {
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
    });