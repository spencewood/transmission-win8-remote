angular.module('Login', ['RemoteServices'])
    .controller('LoginController', function ($scope, localSettingsService, remoteService, navigationService) {
        $scope.errorMessage = '';

        var login = $scope.login = function () {
            $scope.errorMessage = '';
            localSettingsService.setServerSettings($scope.settings);

            remoteService.init().getSettings().then(function (ret) {
                WinJS.Navigation.navigate('/views/torrents.html');
            }, function (e) {
                $scope.errorMessage = 'Unable to connect to server';
                $scope.$apply();
            });
        };

        $scope.settings = localSettingsService.getServerSettings();

        //$scope.host = localSettingsService.get('host');
        //$scope.port = localSettingsService.get('port');
        //$scope.useSsl = localSettingsService.get('useSsl');
        //$scope.rpcPath = localSettingsService.get('rpcPath');
        //$scope.username = localSettingsService.get('username');
        //$scope.password = localSettingsService.get('password');

        //if ($scope.serverName.length > 0 && $scope.username.length > 0) {
        //    login();
        //}
    });