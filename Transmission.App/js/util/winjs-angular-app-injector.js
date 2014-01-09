(function () {
    WinJS.Namespace.define("AppInjector", {
        //inject a nested angularjs app from a page rendered by WinJS Navigator
        inject: function (element) {
            var appEl = $('[ng-controller=AppController]');
            var injector = appEl.injector();
            var $compile = injector.get('$compile');

            var linkFn = $compile(element);
            var $rootScope = injector.get('$rootScope');
            return linkFn($rootScope);
        }
    });
})();