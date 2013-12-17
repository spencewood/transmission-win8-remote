var controllerProvider = null;
var mainApp = angular.module('mainApp', ['ngRoute']).constant('status', {
    stopped: 0,
    checkWait: 1,
    check: 2,
    downloadWait: 3,
    download: 4,
    seedWait: 5,
    seed: 6
});