angular.module('PollingService', [])
    .factory('poll', function () {
        var Poller = function (fun, timeout) {
            this.fun = fun;
            this.timeout = timeout;
            this.timeoutToken = null;
        };

        Poller.prototype.clear = function () {
            if (this.timeoutToken != null) {
                clearTimeout(this.timeoutToken);
                this.timeoutToken = null;
            }
        };

        Poller.prototype.start = function () {
            this.clear();
            this.fun()
                .then(function () {
                    this.timeoutToken = setTimeout(this.start.bind(this), this.timeout);
                }.bind(this));
            return this;
        };

        Poller.prototype.stop = function () {
            this.clear();
        };

        return {
            Poller: Poller
        };
    });