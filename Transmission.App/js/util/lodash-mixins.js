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

    asWinJsBinding: function (item) {
        return WinJS.Binding.as(item);
    }
});