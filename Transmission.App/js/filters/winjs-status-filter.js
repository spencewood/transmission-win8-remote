(function () {
    var statuses = {
        stopped: 0,
        checkWait: 1,
        check: 2,
        downloadWait: 3,
        download: 4,
        seedWait: 5,
        seed: 6
    };

    var inverted = _.invert(statuses);

    var getStatus = function (id) {
        return inverted[id];
    };

    WinJS.Namespace.define('Status', {
        statuses: statuses,
        get: getStatus,
        winjsGet: WinJS.Binding.converter(getStatus)
    });
})();