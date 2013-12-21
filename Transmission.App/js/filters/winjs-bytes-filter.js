(function () {
    var convert = function (bytes, precision) {
        if (bytes === 0 || isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
        if (typeof precision === 'undefined') precision = 1;
        var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
            number = Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];
    };

    var rate = function (bytes) {
        var r = convert(bytes);
        return r === '-' ? '-' : r + '/sec';
    };

    WinJS.Namespace.define("Bytes", {
        convert: WinJS.Binding.converter(convert),
        rate: WinJS.Binding.converter(rate)
    });
})();
