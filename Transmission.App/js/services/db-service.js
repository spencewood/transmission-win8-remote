mainApp.provider('dbService', function () {

    const DB_NAME = 'transmission1';
    const DB_VERSION = 2;
    const DB_STORE_NAME = 'torrents';

    var openDb = function () {
        return new WinJS.Promise(function (complete, error) {
            var req = indexedDB.open(DB_NAME, DB_VERSION);
            req.onsuccess = function (res) {
                return complete(res.target.result);
            };
            req.onerror = error;

            req.onupgradeneeded = function (evt) {
                console.log("openDb.onupgradeneeded");
                var store = evt.currentTarget.result.createObjectStore(
                  DB_STORE_NAME, { keyPath: 'id' });

                store.createIndex('name', 'name', { unique: true });
            };
        });
    }

    this.$get = function () {
        return {
            clear: function () {
                return new WinJS.Promise(function (complete, error) {
                    return openDb().then(function (db) {
                        var transaction = db.transaction(['torrents'], 'readwrite');
                        var store = transaction.objectStore('torrents');
                        var request = store.clear();

                        request.onsuccess = complete;
                        request.onerror = error;
                    });
                });
            },
            add: function (items) {
                return new WinJS.Promise(function (complete, error) {
                    return openDb().then(function (db) {
                        var transaction = db.transaction(['torrents'], 'readwrite');
                        var store = transaction.objectStore('torrents');

                        putNext();

                        function putNext(i) {
                            i = i || 0;
                            if (i < items.length) {
                                store.put(items[i]).onsuccess = putNext(++i);
                            }
                            else {
                                complete();
                            }
                        }

                        transaction.onerror = error;
                    });
                });
            },
            merge: function (items){

            },
            get: function (key) {
                return new WinJS.Promise(function (complete, error) {
                    return openDb().then(function (db) {
                        var transaction = db.transaction(['torrents'], 'readonly');
                        var store = transaction.objectStore('torrents');
                        var request = store.get(key);

                        request.onsuccess = function (res) {
                            return complete(res.target.result);
                        };
                        request.onerror = error;
                    });
                });
            },
            getAll: function (fields) {
                return new WinJS.Promise(function (complete, error) {
                    return openDb().then(function (db) {
                        var transaction = db.transaction(['torrents'], 'readonly');
                        var store = transaction.objectStore('torrents');

                        var torrents = [];

                        store.openCursor().onsuccess = function (event) {
                            var cursor = event.target.result;
                            if (cursor) {
                                torrents.push(cursor.value);
                                cursor.continue();
                            }
                            else {
                                complete(torrents);
                            }
                        };

                        transaction.onerror = error;
                    });
                });
            }
        }
    };
});