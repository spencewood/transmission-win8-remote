angular.module('PollingService', [])
    .factory('poll', function ($timeout) {
        var Poller = function (fun, timeout) {
            this.fun = fun;
            this.timeout = timeout;
            this.timeoutToken = null;
            this.blockTimeout = false;
        };

        Poller.prototype.clear = function () {
            $timeout.cancel(this.timeoutToken);
        };

        Poller.prototype.start = function () {
            this.clear();
            this.fun()
                .then(function () {
                    if (!this.blockTimeout) {
                        this.timeoutToken = $timeout(this.start.bind(this), this.timeout);
                    }
                }.bind(this));
            return this;
        };

        Poller.prototype.stop = function () {
            this.blockTimeout = true;
            this.clear();
        };

        Poller.prototype.reset = function () {
            this.blockTimeout = false;
        }

        return {
            Poller: Poller
        };
    });