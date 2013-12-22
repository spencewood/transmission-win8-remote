angular.module('Settings', ['RemoteServices', 'WinServices'])
    .controller('ServerSettings', function ($scope, localSettingsService) {
        $scope.settings = {
            servername: localSettingsService.get('servername'),
            username: localSettingsService.get('username'),
            password: localSettingsService.get('password')
        };
    });