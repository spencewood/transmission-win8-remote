mainApp.controller('TreeController', function ($scope,  $location) {
    $location.path('/status/all');

    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };
});