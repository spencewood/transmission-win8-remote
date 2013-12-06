(function () {
    'use strict';

    var applicationData = Windows.Storage.ApplicationData.current;
    var localSettings = applicationData.localSettings;

    WinJS.UI.Pages.define('/pages/settings/options.html', {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var servername = document.getElementById('servername'),
                username = document.getElementById('username'),
                password = document.getElementById('password');

            // Set settings to existing values
            if (localSettings.values.size > 0) {
                if (localSettings.values['servername']) {
                    servername.value = localSettings.values['servername'];
                }
                if (localSettings.values['username']) {
                    username.value = localSettings.values['username'];
                }
                if (localSettings.values['password']) {
                    password.value = localSettings.values['password'];
                }
            }

            // Wire up on change events for settings controls
            servername.onchange = function () {
                localSettings.values['servername'] = servername.value;
            };
            username.onchange = function () {
                localSettings.values['username'] = username.value;
            };
            password.onchange = function () {
                localSettings.values['password'] = password.value;
            };
        },

        unload: function () {
            // Respond to navigations away from this page.
        },

        updateLayout: function (element, viewState, lastViewState) {
            // Respond to changes in viewState.
        }
    });
})();