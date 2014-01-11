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

        //TODO: make this a flyout
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
            torrentService.start.call(torrentService, $scope.selectedTorrentIds);
        };

        $scope.stop = function () {
            torrentService.stop.call(torrentService, $scope.selectedTorrentIds);
        };

        $scope.verify = function () {
            torrentService.verify.call(torrentService, $scope.selectedTorrentIds);
        };

        $scope.reannounce = function () {
            torrentService.reannounce.call(torrentService, $scope.selectedTorrentIds);
        };

        $scope.moveToTop = function () {
            torrentService.moveToTop.call(torrentService, $scope.selectedTorrentIds);
        };

        $scope.moveToBottom = function () {
            torrentService.moveToBottom.call(torrentService, $scope.selectedTorrentIds);
        };

        $scope.moveUp = function () {
            torrentService.moveUp.call(torrentService, $scope.selectedTorrentIds);
        };

        $scope.moveDown = function () {
            torrentService.moveDown.call(torrentService, $scope.selectedTorrentIds);
        };
    })
    .controller('SessionBarController', function ($scope) {

    });