var util = require('util');

/**
 * Get the type of a value.
 * @param {*} value The value.
 * @return {string} The type.
 */
exports.typeOf = function typeOf(value) {
  var type = typeof value;
  if (type === 'object') {
    if (value === null) {
      type = 'null';
    } else if (util.isArray(value)) {
      type = 'array';
    } else if (util.isDate(value)) {
      type = 'date';
    } else if (util.isRegExp(value)) {
      type = 'regexp';
    } else if (util.isError(value)) {
      type = 'error';
    }
  }
  return type;
};


/**
 * Copy properties from one object to another.
 * @param {Object} dest The destination object.
 * @param {Object} source The source object.
 * @return {Object} The destination object.
 */
exports.extend = function(dest, source) {
  for (var key in source) {
    dest[key] = source[key];
  }
  return dest;
};
