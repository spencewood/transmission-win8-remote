angular.module('ProgressService', ['EventService'])
    .provider('progress', function () {
        this.$get = function ($rootScope, event) {
            var Provider = function () {
                this.q = 0;
            };

            Provider.prototype.qUp = function (ret) {
                this.q++;
                this.check();
                return ret;
            };

            Provider.prototype.qDown = function (ret) {
                //TODO: clean up return value here without breaking the promise return chain
                this.q--;
                this.check();
                return ret;
            };

            Provider.prototype.check = function () {
                if (this.q > 0) {
                    event.emit('spinner:start');
                }
                else {
                    this.q = 0;
                    event.emit('spinner:stop');
                }
            };

            Provider.prototype.update = function (fun) {
                this.qUp();
                return fun().then(this.qDown.bind(this), this.qDown.bind(this));
            };

            return new Provider();
        };
    });