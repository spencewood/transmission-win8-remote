angular.module('PollingService', [])
    .factory('pollFactory', function (poll) {
        var Factory = function (polls) {
            this.polls = polls.map(function (p) {
                return new poll.Poller(p);
            });
        };

        Factory.prototype.start = function () {
            this.polls.forEach(function (poll) {
                poll.start();
            });
            return this;
        };

        Factory.prototype.stop = function () {
            this.polls.forEach(function (poll) {
                poll.stop();
            });
            return this;
        };

        return {
            Factory: Factory
        }
    })
    .factory('poll', function ($timeout, localSettingsService) {
        var refresh = function () {
            return localSettingsService.getInterfaceSettings().refreshActive * 1000;
        };

        var Poller = function (fun, timeout) {
            this.fun = fun;
            this.timeout = timeout || refresh();
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