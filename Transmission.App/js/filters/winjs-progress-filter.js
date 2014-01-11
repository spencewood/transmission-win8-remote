(function () {
    var getClass = function (status) {
        switch (status) {
            case 0:
            case 1:
            case 2:
                return 'win-paused';
            default:
                return '';
        }
    };

    WinJS.Namespace.define("Progress", {
        winjsClass: WinJS.Binding.converter(getClass)
    });
})();