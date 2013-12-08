mainApp.controller('TreeController', function ($scope,  $location) {
    $location.path('/all');

    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };
});