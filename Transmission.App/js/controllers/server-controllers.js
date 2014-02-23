angular.module('Server', ['RemoteServices', 'WinServices', 'EventService'])
    .controller('ServerController', function ($scope, localSettingsService, remoteService, navigationService, event) {
        $scope.servers = new WinJS.Binding.List();
        var resetSettings = function () {
            _.clearArray($scope.servers);
            localSettingsService.getServerSettings().forEach(function(server){
                $scope.servers.push(server);
            });
        };

        event.on('settings:server:save', resetSettings);

        resetSettings();

        $scope.selectionChanged = function (items) {
            var ids = _.nestedPluck(items._value, 'data', 'id');
            event.emit('server:selected', ids);
        };

        $scope.selectItem = function (args) {
            var item = $scope.servers.getAt(args.detail.itemIndex);
            navigationService.showServerDetails(item.id);
        };

        $scope.showSettings = function () {
            navigationService.showSettingsFlyout('settings-server', '/views/settings-server.html');
        };
    });