angular.module('Status', ['EventService'])
    .controller('StatusController', function ($scope, event) {
        $scope.showSpinner = false;

        event.on('spinner:stop', function () {
            $scope.showSpinner = false;
            $scope.$apply();
        });

        event.on('spinner:start', function () {
            $scope.showSpinner = true;
            $scope.$apply();
        });
    })
    .controller('RateController', function ($scope, event) {
        $scope.speeds = {};

        event.on('speeds:updated', function (speeds) {
            $scope.speeds = speeds;
            $scope.$apply();
        });
    });