angular.module('AppBar', ['RemoteServices', 'WinServices', 'EventService', 'AngularServices'])
    .controller('TorrentBarController', function ($scope, torrentService, remoteService, dialogService, event, safeApply) {
        //remoteService.init();

        $scope.selectedIds = [];

        event.on('torrent:selected', function (ids) {
            $scope.selectedIds = ids;
            safeApply($scope);
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

        var clearIds = function () {
            event.emit('torrent:selected:clear');
        };

        var passIds = function (fun) {
            return function () {
                fun.call(null, $scope.selectedIds);
            };
        };

        $scope.start = _.compose(clearIds, passIds(torrentService.start.bind(torrentService)));
        $scope.stop = _.compose(clearIds, passIds(torrentService.stop.bind(torrentService)));
        $scope.verify = _.compose(clearIds, passIds(torrentService.verify.bind(torrentService)));
        $scope.reannounce = _.compose(clearIds, passIds(torrentService.reannounce.bind(torrentService)));
        $scope.moveToTop = _.compose(clearIds, passIds(torrentService.moveToTop.bind(torrentService)));
        $scope.moveToBottom = _.compose(clearIds, passIds(torrentService.moveToBottom.bind(torrentService)));
        $scope.moveUp = _.compose(clearIds, passIds(torrentService.moveUp.bind(torrentService)));
        $scope.moveDown = _.compose(clearIds, passIds(torrentService.moveDown.bind(torrentService)));
    })
    .controller('ServerBarController', function ($scope, event, safeApply) {
        $scope.selectedIds = [];

        event.on('server:selected', function (ids) {
            $scope.selectedIds = ids;
            safeApply($scope);
        });
    })
    .controller('SessionBarController', function ($scope) {

    });