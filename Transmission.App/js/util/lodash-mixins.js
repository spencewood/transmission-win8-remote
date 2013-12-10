_.mixin({
    pipeline: function (seed) {
        return _.rest(_.toArray(arguments)).reduce(function (l, r) {
            return r(l);
        }, seed);
    }
});