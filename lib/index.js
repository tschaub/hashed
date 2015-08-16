var Store = require('./store').Store;
var hash = require('./hash');

var store = new Store(function(values) {
  hash.updateHash(values, location);
});

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
  store.unregister(callback);
};

function updateStore() {
  hash.updateStore(location, store);
}

/**
 * Kick things off by updating the store with values from the hash.
 */
setTimeout(updateStore);

/**
 * Update the store any time the hash changes.
 */
addEventListener('hashchange', updateStore);
