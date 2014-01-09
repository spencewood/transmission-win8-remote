//TODO: FIX THIS! Inject the value into the app
var id = null;

(function () {
    "use strict";

    var controllerSelector = '[ng-controller=TorrentDetailsController]';

    WinJS.UI.Pages.define("/views/torrent-details.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            id = options.id;
            AppInjector.inject($(element).find(controllerSelector).get(0));
        },

        unload: function () {
            //destroy controller
            angular.element(controllerSelector).scope().$destroy();
            $(document).remove();
        },

        updateLayout: function (element) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in layout.
        }
    });
})();