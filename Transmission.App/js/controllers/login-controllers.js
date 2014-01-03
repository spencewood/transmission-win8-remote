angular.module('Login', ['RemoteServices', 'WinServices'])
    .controller('LoginController', function ($scope, localSettingsService, remoteService, navigationService) {
        $scope.errorMessage = '';

        var login = $scope.login = function () {
            $scope.errorMessage = '';
            localSettingsService.setServerSettings($scope.settings);
            remoteService.init().getSettings().then(function (settings) {
                localSettingsService.setTransmissionSettings(settings);
                navigationService.goHome();
            }, function (e) {
                $scope.errorMessage = 'Unable to connect to server';
                $scope.$apply();
            });
        };

        $scope.settings = localSettingsService.getServerSettings();
    });