angular.module('Filters', [])
    .filter('bytes', function () {
        //TODO: reuse this for the winjs bytes filter
        return Bytes.convert;
    })
    .filter('rate', function () {
        return Bytes.rate;
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
    .filter('status', function () {
        return function (status) {
            return Status.get(status);
        };
    })
    .filter('timeuntilstring', function () {
        return function (future) {
            function numberEnding(number) {
                return (number > 1) ? 's' : '';
            }

            var milliseconds = future - Date.now();
            if (milliseconds < 0) {
                return 'Unknown';
            }

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
    })
    .filter('timeagostring', function () {
        function timeSince(date) {
            var seconds = Math.floor((new Date() - date) / 1000);

            var interval = Math.floor(seconds / 31536000);

            if (interval > 1) {
                return interval + " years";
            }
            interval = Math.floor(seconds / 2592000);
            if (interval > 1) {
                return interval + " months";
            }
            interval = Math.floor(seconds / 86400);
            if (interval > 1) {
                return interval + " days";
            }
            interval = Math.floor(seconds / 3600);
            if (interval > 1) {
                return interval + " hours";
            }
            interval = Math.floor(seconds / 60);
            if (interval > 1) {
                return interval + " minutes";
            }
            return Math.floor(seconds) + " seconds";
        };

        return function (past) {
            return timeSince(past) + ' ago';
        };
    })
    .filter('replaceempty', function () {
        return function (str, filler) {
            return str || filler || 'Unknown';
        }
    });
;