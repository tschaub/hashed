var Field = require('./field').Field;



/**
 * Create a new schema.  A schema is a collection of field definitions.
 * @param {Object} config Keys are field names, values are field configs.
 * @constructor
 */
var Schema = exports.Schema = function(config) {
  var fields = {};
  var offsets = {};
  var offset = 0;
  for (var key in config) {
    fields[key] = new Field(config[key]);
    offsets[key] = offset;
    ++offset;
  }
  this._fields = fields;
  this._offsets = offsets;
};


/**
 * Get the offset for a field with the given key.
 * @param {string} key The field key.
 * @return {number} The field offset.
 */
Schema.prototype.getOffset = function(key) {
  if (!(key in this._offsets)) {
    throw new Error('Invalid key: ' + key);
  }
  return this._offsets[key];
};


/**
 * Get all keys.
 * @return {Array.<string>} List of keys.
 */
Schema.prototype.getKeys = function() {
  var keys = [];
  for (var key in this._fields) {
    keys.push(key);
  }
  return keys;
};


/**
 * Serialize a value.
 * @param {string} key The key or field name.
 * @param {*} value The value to serialize.
 * @return {string} The serialized value.
 */
Schema.prototype.serialize = function(key, value) {
  if (!(key in this._fields)) {
    throw new Error('Unknown key: ' + key);
  }
  return this._fields[key].serialize(value);
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
