(function () {
    "use strict";

    var controllerSelector = '[ng-controller=LoginController]';

    WinJS.UI.Pages.define("/views/login.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            AppInjector.inject($(element).find(controllerSelector).get(0));
        },

        unload: function (e) {
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