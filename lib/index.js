var Store = require('./store').Store;
var util = require('./util');

/**
 * A lookup of updates to the hash as a result of store updates.  If a
 * hashchange event corresponds to one of these members, the store will not
 * be updated, and the member will be deleted.
 * @type {Object}
 */
var updates = {};

/**
 * Called when the store is updated.
 * @param {Object} values Store values by key.
 */
function updateHash(values) {
  var parts = util.zip(values);
  if (parts.length > 0) {
    var path = parts.join('/');
    updates[path] = true;
    location.hash = '#/' + path;
  }
}

var store = new Store(updateHash);

function updateStore() {
  var zipped;
  if (location.hash.length > 2) {
    var path = location.hash.substring(2);
    if (updates[path]) {
      delete updates[path];
      return;
    }
    zipped = path.split('/');
  } else {
    zipped = [];
  }
  store.update(util.unzip(zipped));
}

/**
 * Register a new state provider.
 * @param {Object} config Schema config.
 * @param {function(Object)} callback Called when the URL hash changes.
 * @return {function(Object)} Call this function with any updates to the state.
 */
exports.register = function(config, callback) {
  return store.register(config, callback);
};

/**
 * Unregister an existing state provider.
 * @param {function(Object)} callback Callback registered by the provider.
 */
exports.unregister = function(callback) {
  return store.unregister(callback);
};

setTimeout(function() {
  updateStore();
});

addEventListener('hashchange', updateStore);
