mainApp.controller('LoginController', function ($scope, localSettingsService) {
    $scope.login = function () {
        localSettingsService.set('servername', $scope.servername);
        localSettingsService.set('username', $scope.username);
        localSettingsService.set('password', $scope.password);
    };

    $scope.servername = localSettingsService.get('servername');
    $scope.username = localSettingsService.get('username');
    $scope.password = localSettingsService.get('password');
});