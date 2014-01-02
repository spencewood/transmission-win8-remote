angular.module('Login', ['RemoteServices'])
    .controller('LoginController', function ($scope, localSettingsService, remoteService, navigationService) {
        $scope.errorMessage = '';

        var login = $scope.login = function () {
            $scope.errorMessage = '';

            remoteService.init().getSettings().then(function (settings) {
                localSettingsService.setServerSettings($scope.settings);
                localSettingsService.setTransmissionSettings(settings);

                WinJS.Navigation.navigate('/views/torrents.html');
            }, function (e) {
                $scope.errorMessage = 'Unable to connect to server';
                $scope.$apply();
            });
        };

        $scope.settings = localSettingsService.getServerSettings();
    });