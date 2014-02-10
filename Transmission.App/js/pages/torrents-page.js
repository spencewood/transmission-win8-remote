﻿(function () {
    "use strict";

    WinJS.UI.Pages.define("/views/torrents.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var appName = 'torrentsApp';

            angular.module(appName, ['Torrent', 'Directives', 'Filters']);
            angular.bootstrap(element, [appName]);

            //settings flyout
            WinJS.Application.onsettings = function (e) {
                e.detail.applicationcommands = {
                    'settings-transmission': { title: 'Transmission Settings', href: '/views/settings-transmission.html' },
                    'settings-interface': { title: 'Interface Settings', href: '/views/settings-interface.html' }
                };
                WinJS.UI.SettingsFlyout.populateSettings(e);
            };
        },

        unload: function () {
            //destroy controller
            angular.element('[ng-controller=TorrentController]').scope().$destroy();
            $(document).remove();
        },

        updateLayout: function (element) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in layout.
        }
    });
})();