var Schema = require('./schema').Schema;
var util = require('./util');



/**
 * An array backed store of string values.  Allows registering multiple state
 * providers.
 * @param {function(Array.<string>)} callback Called with an array of serialized
 *     values whenever a provider updates state.
 * @constructor
 */
var Store = exports.Store = function(callback) {
  this._offset = 0;
  this._providers = [];
  this._values = [];
  this._callback = callback;
  this._started = false;
};


/**
 * Start notifying providers on state changes.
 */
Store.prototype.start = function() {
  this._started = true;
};


/**
 * Register a new state provider.
 * @param {Object} config Schema config.
 * @param {function(Object)} callback Called by the store on state changes.
 * @return {function(Object)} Called by the provider on state changes.
 */
Store.prototype.register = function(config, callback) {
  var provider = {
    schema: new Schema(config),
    state: {},
    callback: callback,
    offset: this._offset
  };
  this._providers.push(provider);
  this._offset += provider.schema.getLength();
  this._notifyProvider(provider);

  var self = this;
  return function update(state) {
    if (arguments.length === 2) {
      var args = Array.prototype.slice.call(arguments, 0);
      state = {};
      state[args[0]] = args[1];
    }
    var validated = {};
    for (var key in state) {
      validated[key] = provider.schema.serialize(key, state[key]);
    }
    util.extend(provider.state, state);
    for (var key in validated) {
      self._values[provider.schema.getOffset(key) + provider.offset] =
          validated[key];
    }
    self._callback(self._values);
  };
};


/**
 * Notify provider of stored state values where they differ from provider
 * state values.
 * @param {Object} provider Provider to be notified.
 */
Store.prototype._notifyProvider = function(provider) {
  if (!this._started) {
    return;
  }
  var state = {};
  var changed = false;
  provider.schema.forEachKey(function(key, index) {
    var offset = index + provider.offset;
    var storedValue = this._values[offset];
    var deserializedValue;
    try {
      deserializedValue = provider.schema.deserialize(key, storedValue);
    } catch (err) {
      deserializedValue = provider.schema.getDefault(key);
    }
    if (key in provider.state) {
      // compare to current provider state
      var serializedValue = provider.schema.serialize(key, deserializedValue);
      var providerValue = provider.schema.serialize(key, provider.state[key]);
      if (serializedValue !== providerValue) {
        state[key] = deserializedValue;
        provider.state[key] = deserializedValue;
        changed = true;
      }
    } else {
      state[key] = deserializedValue;
      provider.state[key] = deserializedValue;
      changed = true;
    }
  }, this);
  if (changed) {
    setTimeout(function() {
      provider.callback(state);
    }, 0);
  }
};


/**
 * Call the callback for each registered provider.
 * @param {function(this:Store, Object)} callback Callback.
 */
Store.prototype._forEachProvider = function(callback) {
  for (var i = 0, ii = this._providers.length; i < ii; ++i) {
    callback.call(this, this._providers[i]);
  }
};


/**
 * Update the store's values, notifying providers as necessary.
 * @param {Array.<string>} values New values.
 */
Store.prototype.update = function(values) {
  this._values = values;
  this._forEachProvider(this._notifyProvider);
};