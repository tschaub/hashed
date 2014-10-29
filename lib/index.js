var Store = require('./store').Store;

function updateHash(values) {
  location.hash = '#/' + values.join('/');
}

var store = new Store(updateHash);

function updateStore() {
  store.update(location.hash.substring(2).split('/'));
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
 * Start notifying providers of new state due to hash changes.
 */
exports.start = function() {
  store.start();
  updateStore();
  addEventListener('hashchange', updateStore);
};
