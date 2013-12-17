angular.module('settingsApp', ['mainApp']).controller('ServerSettingsController', function ($scope, localSettingsService) {
    $scope.settings = {
        servername: localSettingsService.get('servername'),
        username: localSettingsService.get('username'),
        password: localSettingsService.get('password')
    };
});