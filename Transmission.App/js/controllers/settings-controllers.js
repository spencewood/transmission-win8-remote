angular.module('Settings', ['RemoteServices', 'WinServices'])
    .controller('ServerSettings', function ($scope, localSettingsService) {
        $scope.settings = localSettingsService.getServerSettings();
    })
    .controller('TransmissionSettings', function ($scope, remoteService) {
        $scope.settings = {};
    });