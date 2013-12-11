_.mixin({
    pipeline: function (seed) {
        return _.rest(_.toArray(arguments)).reduce(function (l, r) {
            return r(l);
        }, seed);
    },

    differenceObjectsById: function (a, b) {
        return a.filter(function (obj) {
            return !_.findWhere(b, { id: obj.id });
        });
    }
});