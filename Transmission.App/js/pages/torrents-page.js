﻿(function () {
    "use strict";

    WinJS.UI.Pages.define("/views/torrents.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var appName = 'mainApp';

            angular.module(appName, ['Torrent', 'AppBar', 'Directives']);
            angular.bootstrap(element, [appName]);

            WinJS.Application.onsettings = function (e) {
                e.detail.applicationcommands = { "settings-server": { title: "Server Settings", href: "/views/settings-server.html" } };
                WinJS.UI.SettingsFlyout.populateSettings(e);
            };
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in layout.
        }
    });
})();