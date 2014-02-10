(function () {
    "use strict";

    WinJS.UI.Pages.define("/views/choose-server.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var appName = 'serverApp';

            angular.module(appName, ['Server', 'Settings', 'Directives']);
            angular.bootstrap(element, [appName]);

            //settings flyout
            WinJS.Application.onsettings = function (e) {
                e.detail.applicationcommands = {
                    'settings-server': { title: 'Server Settings', href: '/views/settings-server.html' }
                };
                WinJS.UI.SettingsFlyout.populateSettings(e);
            };
        },

        unload: function (e) {
            //destroy controller
            angular.element('[ng-controller=ServerController]').scope().$destroy();
            $(document).remove();
        },

        updateLayout: function (element) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in layout.
        }
    });
})();