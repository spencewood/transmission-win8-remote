(function () {
    //for use with communication between apps
    var em = new EventEmitter();
    WinJS.Namespace.define('EM', {
        emitter: em
    });
})();