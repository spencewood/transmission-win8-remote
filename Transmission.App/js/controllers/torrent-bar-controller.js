mainApp.controller('TorrentBarController', function ($scope, $rootScope, torrentService, dialogService) {
    var torrentBar = document.getElementById('torrent-bar');

    $rootScope.$watch('selectedTorrentIds', function (ids) {
        var appBar = torrentBar.winControl;
        if (typeof appBar !== 'undefined') {
            var hasIds = !_.isEmpty(ids);
            appBar.sticky = hasIds;
            appBar.disabled = !hasIds;
            hasIds ? appBar.show() : appBar.hide();
        }
    });

    $scope.remove = function (removeData) {
        var prompt = [
            'Remove the following torrents',
            removeData ? ' and associated data' : '',
            '?\n\n',
            $rootScope.selectedTorrentIds.map(torrentService.getNameById.bind(torrentService)).join('\n')
        ].join('');

        dialogService.prompt(prompt, 'Yes', 'No')
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