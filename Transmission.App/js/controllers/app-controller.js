angular.module('App', [])
    .controller('AppController', function ($scope, $rootScope) {
        $scope.$on('spinner:stop', function () {
            $scope.showSpinner = false;
            //$scope.$apply();
        });
        $scope.$on('spinner:start', function () {
            $scope.showSpinner = true;
            //$scope.$apply();
        });
    });