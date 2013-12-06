// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var applicationData = Windows.Storage.ApplicationData.current;
    var localSettings = applicationData.localSettings;

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.

                var content = document.getElementById('content');
                var remote = new Transmission.Runtime.Remote(localSettings.values.servername, localSettings.values.username, localSettings.values.password);
                remote.getSession().then(function (val) {
                    var obj = JSON.parse(val);
                    content.innerText = obj.arguments['alt-speed-down'];
                });
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }
            args.setPromise(WinJS.UI.processAll());
        }
    };

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. You might use the
        // WinJS.Application.sessionState object, which is automatically
        // saved and restored across suspension. If you need to complete an
        // asynchronous operation before your application is suspended, call
        // args.setPromise().
    };

    app.onsettings = function (e) {
        e.detail.applicationcommands = {
            "options": { title: "Options", href: "/pages/settings/options.html" },
        };
        WinJS.UI.SettingsFlyout.populateSettings(e);
    };

    // AngularJS Stuff
    var myApp = angular.module('app', []);

    myApp.controller('MainCtrl', function ($scope) {
        $scope.greeting = 'Hello AngularJS!';
        $scope.messages = [];
        $scope.addMessage = function (m) {
            $scope.messages.unshift(m);
            $scope.message = '';
        }
    });

    app.start();
})();
