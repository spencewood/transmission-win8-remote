(function () {
    "use strict";

    WinJS.UI.Pages.define("/views/settings-server.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var appName = 'settingsApp';

            angular.module(appName, ['Settings']);
            angular.bootstrap(element, [appName]);
        },

        unload: function () {

        },

        updateLayout: function (element) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in layout.
        }
    });
})();