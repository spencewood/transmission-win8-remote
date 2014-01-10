angular.module('AppBar', ['RemoteServices', 'WinServices', 'EventService'])
    .controller('TorrentBarController', function ($scope, torrentService, dialogService, event) {
        $scope.selectedIds = [];
        $scope.torrentBarEnabled = false;

        event.on('torrent:selected', function (ids) {
            $scope.selectedIds = ids;
            $scope.$apply();
        });

        event.on('navigated', function (view) {
            $scope.selectedIds = [];
            $scope.$apply();
        });

        $scope.remove = function (removeData) {
            torrentService.getNamesByIds($scope.selectedIds).then(function (names) {
                var prompt = [
                    'Remove the following torrents',
                    removeData ? ' and associated data' : '',
                    '?\n\n',
                    names.join('\n')
                ].join('');

                dialogService.prompt(prompt, 'Yes', 'No')
                    .then(function (command) {
                        if (command.label === 'Ok') {
                            torrentService.remove($scope.selectedIds, removeData);
                        }
                    });    
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
    })
    .controller('SessionBarController', function ($scope) {

    });