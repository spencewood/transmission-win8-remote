mainApp.controller('AppBarController', function ($scope, $rootScope, torrentService, dialogService) {
    //TODO: disable commands when nothing selected

    $scope.remove = function (removeData) {
        var prompt = [
            'Remove the following torrents',
            removeData ? ' and associated data' : '',
            '?\n\n',
            $rootScope.selectedTorrentIds.map(torrentService.getNameById.bind(torrentService)).join('\n')
        ].join('');

        dialogService.prompt(prompt, 'Cancel', 'Ok')
            .then(function (command) {
                if (command.label === 'Ok') {
                    torrentService.remove($rootScope.selectedTorrentIds, removeData);
                }
            });
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