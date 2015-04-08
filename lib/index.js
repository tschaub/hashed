var Store = require('./store').Store;
var util = require('./util');

function updateHash(values) {
  location.hash = '#/' + util.zip(values).join('/');
}

var store = new Store(updateHash);

function updateStore() {
  var zipped = location.hash.length > 1 ?
      location.hash.substring(2).split('/') : [];
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

setTimeout(function() {
  updateStore();
});

addEventListener('hashchange', updateStore);
