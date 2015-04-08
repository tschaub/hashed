var Field = require('./field').Field;
var util = require('./util');


/**
 * Create a new schema.  A schema is a collection of field definitions.
 * @param {Object} config Keys are field names, values are field configs.
 * @constructor
 */
var Schema = exports.Schema = function(config) {
  config = util.extend({}, config);
  var fields = {};
  var prefix;
  if ('_' in config) {
    prefix = config._;
    delete config._;
  }
  var length = 0;
  for (var key in config) {
    fields[key] = new Field(config[key]);
    ++length;
  }
  this._length = length;
  this._prefix = prefix;
  this._fields = fields;
};


/**
 * Get number of fields in the schema.
 * @return {number} The number of fields.
 */
Schema.prototype.getLength = function() {
  return this._length;
};


/**
 * Get the prefixed version of a key.
 * @return {string} The prefixed key.
 */
Schema.prototype.getPrefixed = function(key) {
  return this._prefix ? (this._prefix + '.' + key) : key;
};


/**
 * Call a callback for each field key.
 * @param {function(string, number)} callback Called with a local field key and
 *     a prefixed key.
 * @param {Object} thisArg This argument for the callback.
 */
Schema.prototype.forEachKey = function(callback, thisArg) {
  for (var key in this._fields) {
    callback.call(thisArg, key, this.getPrefixed(key));
  }
};


/**
 * Serialize a value.
 * @param {string} key The key or field name.
 * @param {*} value The value to serialize.
 * @param {Object} values Additional values for providers to use when
 *     serializing.
 * @return {string} The serialized value.
 */
Schema.prototype.serialize = function(key, value, values) {
  if (!(key in this._fields)) {
    throw new Error('Unknown key: ' + key);
  }
  return this._fields[key].serialize(value, values);
};


/**
 * Deserialize a value.
 * @param {string} key The key or field name.
 * @param {string} str The serialized value.
 * @return {*} The deserialized value.
 */
Schema.prototype.deserialize = function(key, str) {
  if (!(key in this._fields)) {
    throw new Error('Unknown key: ' + key);
  }
  return this._fields[key].deserialize(str);
};


/**
 * Get the default value for a particular field.
 * @param {string} key The key or field name.
 * @return {*} The default value.
 */
Schema.prototype.getDefault = function(key) {
  if (!(key in this._fields)) {
    throw new Error('Unknown key: ' + key);
  }
  return this._fields[key].init;
};
