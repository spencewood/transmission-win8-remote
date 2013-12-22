angular.module('Settings', ['RemoteServices', 'WinServices'])
    .controller('ServerSettings', function ($scope, localSettingsService) {
        $scope.settings = localSettingsService.getServerSettings();
    });