(function () {
    "use strict";

    WinJS.UI.Pages.define("/views/torrent-details.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var appName = 'torrentDetailsApp';

            angular.module(appName, ['Torrent', 'Filters'])
                .constant('id', options.id);
            angular.bootstrap(element, [appName]);
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