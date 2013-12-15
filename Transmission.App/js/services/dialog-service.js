mainApp.factory('dialogService', function () {
    return {
        prompt: function (message) {
            var cmds = _.rest(arguments);
            var md = new Windows.UI.Popups.MessageDialog(message);

            cmds.forEach(function (cmd) {
                md.commands.append(new Windows.UI.Popups.UICommand(cmd));
            });
            return md.showAsync();
        }
    };
});