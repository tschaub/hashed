const isa = require('isa.js');

/**
 * Get the type of a value.
 * @param {*} value The value.
 * @return {string} The type.
 */
exports.typeOf = function typeOf(value) {
  let type = typeof value;
  if (type === 'object') {
    if (value === null) {
      type = 'null';
    } else if (isa.isArray(value)) {
      type = 'array';
    } else if (isa.isDate(value)) {
      type = 'date';
    } else if (isa.isRegExp(value)) {
      type = 'regexp';
    } else if (isa.isError(value)) {
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
  for (const key in source) {
    dest[key] = source[key];
  }
  return dest;
};

/**
 * Generate an array of alternating name, value from an object's properties.
 * @param {Object} object The object to zip.
 * @return {Array} The array of name, value [, name, value]*.
 */
exports.zip = function(object) {
  const zipped = [];
  let count = 0;
  for (const key in object) {
    zipped[2 * count] = key;
    zipped[2 * count + 1] = object[key];
    ++count;
  }
  return zipped;
};

/**
 * Generate an object from an array of alternating name, value items.
 * @param {Array} array The array of name, value [, name, value]*.
 * @return {Object} The zipped up object.
 */
exports.unzip = function(array) {
  const object = {};
  for (let i = 0, ii = array.length; i < ii; i += 2) {
    object[array[i]] = array[i + 1];
  }
  return object;
};
