var Store = require('./store').Store;
var hash = require('./hash');

var store = new Store(hash.get(location), function(values) {
  hash.set(values, location);
});

/**
 * Register a new state provider.
 * @param {Object} config Schema config.
 * @param {function(Object)} callback Called immediately with initial state.
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

/**
 * Serialize values as they would be represented in the hash.
 * @param {Object} values An object with values to be serialized.
 * @return {string} The values as they would be represented in the hash.
 */
exports.serialize = function(values) {
  hash.serialize(store.serialize(values));
};
