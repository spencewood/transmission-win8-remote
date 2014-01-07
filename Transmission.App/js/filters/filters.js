angular.module('Filters', [])
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
    .filter('percentage', function () {
        return function (input) {
            var rounded = Math.round(input * 10000) / 100;
            if (rounded == NaN) {
                return '';
            }
            var percentage = '' + rounded + '%';
            return percentage;
        };
    })
    .filter('timeuntilstring', function () {
        return function (future) {
            function numberEnding (number) {
                return (number > 1) ? 's' : '';
            }

            var milliseconds = future - Date.now();

            var temp = milliseconds / 1000;
            var years = Math.floor(temp / 31536000);
            if (years) {
                return years + ' year' + numberEnding(years);
            }
            var days = Math.floor((temp %= 31536000) / 86400);
            if (days) {
                return days + ' day' + numberEnding(days);
            }
            var hours = Math.floor((temp %= 86400) / 3600);
            if (hours) {
                return hours + ' hour' + numberEnding(hours);
            }
            var minutes = Math.floor((temp %= 3600) / 60);
            if (minutes) {
                return minutes + ' minute' + numberEnding(minutes);
            }
            var seconds = temp % 60;
            if (seconds) {
                return seconds + ' second' + numberEnding(seconds);
            }
            return 'less then a second';
        };
    });