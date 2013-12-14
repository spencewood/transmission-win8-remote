mainApp.controller('AppBarController', function ($scope, $rootScope, torrentService) {
    /*$rootScope.$watch('selectedTorrentIds', function (ids) {
        var a = 'asdf';
    });*/

    $scope.remove = function (removeData) {
        var a = 'asdf';
        //torrentService.remove($rootScope.selectedTorrentIds);
    };

    $scope.start = function () {
        torrentService.start($rootScope.selectedTorrentIds);
    };

    $scope.stop = function () {
        torrentService.stop($rootScope.selectedTorrentIds);
    };

    $scope.verify = function () {
        torrentService.verify($rootScope.selectedTorrentIds);
    };

    $scope.reannounce = function () {
        torrentService.reannounce($rootScope.selectedTorrentIds);
    };

    $scope.moveToTop = function () {
        torrentService.moveToTop($rootScope.selectedTorrentIds);
    };

    $scope.moveToBottom = function () {
        torrentService.moveToBottom($rootScope.selectedTorrentIds);
    };

    $scope.moveUp = function () {
        torrentService.moveUp($rootScope.selectedTorrentIds);
    };

    $scope.moveDown = function () {
        torrentService.moveDown($rootScope.selectedTorrentIds);
    };
});