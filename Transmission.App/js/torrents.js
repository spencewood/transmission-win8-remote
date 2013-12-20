(function () {
    "use strict";

    WinJS.UI.Pages.define("/views/torrents.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            // TODO: Initialize the page here.
            angular.module('mainApp', ['Torrent', 'AppBar', 'Directives']);

            angular.bootstrap(element, ['mainApp']);
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