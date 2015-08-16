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
 * @param {Object} loc The location object whose hash property will be set.
 */
function updateHash(values, loc) {
  var parts = util.zip(values);
  if (parts.length > 0) {
    var path = parts.join('/');
    updates[path] = true;
    loc.hash = '#/' + path;
  }
}

/**
 * Update the store with values from the hash.
 * @param {Object} loc The location with hash values for the store.
 * @param {Store} store The store.
 */
function updateStore(loc, store) {
  var zipped;
  if (loc.hash.length > 2) {
    var path = loc.hash.substring(2);
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
 * Reset the updates cache.
 */
function reset() {
  for (var key in updates) {
    delete updates[key];
  }
}

exports.reset = reset;
exports.updateHash = updateHash;
exports.updateStore = updateStore;
