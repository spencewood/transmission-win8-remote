angular.module('Login', ['RemoteServices'])
    .controller('LoginController', function ($scope, localSettingsService, remoteService, navigationService) {
        $scope.errorMessage = '';

        var login = $scope.login = function () {
            $scope.errorMessage = '';
            localSettingsService.set('servername', $scope.servername);
            localSettingsService.set('username', $scope.username);
            localSettingsService.set('password', $scope.password);

            remoteService.init().then(function (ret) {
                WinJS.Navigation.navigate('/views/torrents.html');
            }, function (e) {
                $scope.errorMessage = 'Unable to connect to server';
                $scope.$apply();
            });
        };

        $scope.servername = localSettingsService.get('servername');
        $scope.username = localSettingsService.get('username');
        $scope.password = localSettingsService.get('password');

        if ($scope.servername.length > 0 && $scope.username.length > 0) {
            login();
        }
    });