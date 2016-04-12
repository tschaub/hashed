var util = require('./util');

/**
 * Update the hash with the provided string values.
 * @param {Object} values String values by key.
 * @param {Object} loc The location object whose hash property will be set.
 */
function set(values, loc) {
  var parts = util.zip(values);
  if (parts.length > 0) {
    var path = parts.join('/');
    loc.hash = '#/' + path;
  }
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

exports.get = get;
exports.set = set;
