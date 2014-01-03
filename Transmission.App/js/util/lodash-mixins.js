(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['lodash'], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory(require('lodash'));
    } else {
        // Browser globals (root is window)
        root.returnExports = factory(root._);
    }
}(this, function (_) {
    _.mixin({
        pipeline: function (seed) {
            return _.rest(_.toArray(arguments)).reduce(function (l, r) {
                return r(l);
            }, seed);
        },

        matchesCaseInsensitiveByKey: function (term, key) {
            return function (compare) {
                return compare[key].toLowerCase().match(term.toLowerCase());
            };
        },

        average: function (arr) {
            return _.reduce(arr, function (memo, num) {
                return memo + num;
            }, 0) / arr.length;
        },

        /*
        * Takes two collections and updates the first with the second
        * based on the passed in key. Performs mutation.
        */
        updateAddDelete: function(coll1, coll2, key, updateFun, addFun, deleteFun){
            //add/update
            coll2.forEach(function (item2) {
                var same = coll1.filter(function (item1) {
                    return item1[key] === item2[key];
                });
                if (same.length > 0) {
                    updateFun(same[0], item2);
                }
                else {
                    coll1.push(addFun(item2));
                }
            });

            //delete
            var toDelete = coll1.filter(function (obj) {
                var o = {};
                o[key] = obj[key];
                return !_.findWhere(coll2, o);
            });

            toDelete.forEach(function (rm) {
                coll1.forEach(function (item, idx) {
                    if (item.id === rm.id) {
                        deleteFun(coll1, idx);
                    }
                });
            });
        },

        dropFirstArgument: function (fun) {
            return function () {
                //drop the first argument for event 
                fun.apply(this, _.rest(arguments));
            };
        },

        removeElement: function (arr, idx) {
            arr.splice(idx, 1);
        },

        clearArray: function (arr) {
            arr.splice(0, arr.length);
        },

        shiftArrayToSize: function (arr, size) {
            while (arr.length < size) {
                arr.shift();
            }
        },

        asWinJsBinding: function (item) {
            return WinJS.Binding.as(item);
        },

        dateToMinutesAfterMidnight: function (date) {
            var e = new Date(date);
            var msSinceMidnight = date - e.setHours(0,0,0,0);
            return (msSinceMidnight / 1000) / 60;
        },

        minutesAfterMidnightToDate: function (mam) {
            var d = new Date();
            d.setHours(0, mam, 0, 0);
            return d;
        },

        numberToBinaryArray: function (num) {
            return Number(num).toString(2).split('').map(function(str){
                return parseInt(str, 10);
            });
        },

        binaryArrayToNumber: function (arr) {
            return parseInt(arr.join(''), 2);
        }
    });
}));