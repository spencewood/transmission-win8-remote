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

    var rateUpDown = function (model) {
        return rate(model.rateUpload) + '/' + 
            rate(model.rateDownload);
    };

    WinJS.Namespace.define("Bytes", {
        convert: convert,
        rate: rate,
        winjsConvert: WinJS.Binding.converter(convert),
        winjsRate: WinJS.Binding.converter(rate),
        winjsRateCombined: WinJS.Binding.converter(rateUpDown)
    });
})();
