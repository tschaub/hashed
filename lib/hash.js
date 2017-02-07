var util = require('./util');

/**
 * Get values from a hash string.
 * @param {string} hash The hash string (e.g. '#/foo/bar').
 * @return {Object} The string values (e.g. {foo: 'bar'}).
 */
function deserialize(hash) {
  var zipped;
  if (hash.length > 2) {
    var path = hash.substring(2);
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
  var path = '#';
  var parts = util.zip(values);
  if (parts.length > 0) {
    path = '#/' + parts.join('/');
  }
  return path;
}

exports.deserialize = deserialize;
exports.serialize = serialize;
