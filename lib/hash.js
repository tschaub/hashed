var util = require('./util');

/**
 * Update the hash with the provided string values.
 * @param {Object} values String values by key.
 * @param {Object} loc The location object whose hash property will be set.
 */
function set(values, loc) {
  loc.hash = serialize(values);
}

/**
 * Get the current string values.
 * @param {Object} loc The location with hash values.
 * @return {Object} The string values.
 */
function get(loc) {
  var zipped;
  if (loc.hash.length > 2) {
    var path = loc.hash.substring(2);
    zipped = path.split('/');
  } else {
    zipped = [];
  }
  return util.unzip(zipped);
}

/**
 * Serialize values for the hash.
 * @param {Object} values The values to serialize.
 * @return {string} The hash string.
 */
function serialize(values) {
  var path = '';
  var parts = util.zip(values);
  if (parts.length > 0) {
    path = '#/' + parts.join('/');
  }
  return path;
}

exports.get = get;
exports.set = set;
exports.serialize = serialize;
