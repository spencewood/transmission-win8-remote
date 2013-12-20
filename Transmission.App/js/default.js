// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var nav = WinJS.Navigation;

    app.onactivated = function (args) {
        //clear data
        //Windows.Storage.ApplicationData.current.clearAsync();


        //var rootScope = angular.element(document).scope();
        //if (args.detail.kind === Windows.ApplicationModel.Activation.ActivationKind.file) {
        //    rootScope.$broadcast('torrents:add', args.detail.files);
        //}

        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }

            // Save the previous execution state. 
            WinJS.Application.sessionState.previousExecutionState =
                args.detail.previousExecutionState;

            if (app.sessionState.history) {
                nav.history = app.sessionState.history;
            }
            args.setPromise(WinJS.UI.processAll().then(function () {
                if (nav.location) {
                    nav.history.current.initialPlaceholder = true;
                    return nav.navigate(nav.location, nav.state);
                } else {
                    return nav.navigate(Application.navigator.home);
                }
            }));
        }
    };

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. If you need to 
        // complete an asynchronous operation before your application is 
        // suspended, call args.setPromise().
        app.sessionState.history = nav.history;
    };

    app.onsettings = function (e) {
        e.detail.applicationcommands = {
            'server-settings': { title: "Server Settings", href: "/views/settings/server-settings.html" },
        };
        WinJS.UI.SettingsFlyout.populateSettings(e);
    };

    app.start();
})();
