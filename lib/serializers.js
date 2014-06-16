var util = require('util');


var serializers = {
  string: function(str) {
    if (typeof str !== 'string') {
      throw new Error('Expected string to serialize: ' + str);
    }
    return str;
  },
  number: function(num) {
    if (typeof num !== 'number') {
      throw new Error('Expected number to serialize: ' + num);
    }
    return String(num);
  },
  date: function(date) {
    if (!util.isDate(date)) {
      throw new Error('Expected date to serialize: ' + date);
    }
    return date.toISOString();
  },
  array: function(array) {
    if (!util.isArray(array)) {
      throw new Error('Expected array to serialize: ' + array);
    }
    return JSON.stringify(array);
  },
  object: function(obj) {
    return JSON.stringify(obj);
  }
};


/**
 * Get a serializer for a value of the given type.
 * @param {string} type Value type.
 * @return {function(*): string} Function that serializes a value to a string.
 */
exports.get = function(type) {
  if (!(type in serializers)) {
    throw new Error('Unable to serialize type: ' + type);
  }
  return serializers[type];
};
