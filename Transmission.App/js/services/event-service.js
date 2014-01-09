angular.module('EventService', [])
    .factory('event', function () {
        return EM.emitter;
    });