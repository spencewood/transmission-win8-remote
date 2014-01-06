﻿angular.module('Filters', [])
    .filter('bytes', function () {
        //TODO: reuse this for the winjs bytes filter
        return function (bytes, precision) {
            if (bytes === 0 || isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
            if (typeof precision === 'undefined') precision = 1;
            var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
                number = Math.floor(Math.log(bytes) / Math.log(1024));
            return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];
        };
    })
    .filter('bytePercent', function () {
        //return function (b64str) {
        //    return btoa(b64str);
        //};
    });