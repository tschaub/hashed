var Schema = require('./schema').Schema;
var util = require('./util');


/**
 * An object backed store of string values.  Allows registering multiple state
 * providers.
 * @param {function(Object)} callback Called with an object of serialized
 *     values whenever a provider updates state.
 * @constructor
 */
var Store = exports.Store = function(callback) {
  this._values = {};
  this._providers = [];
  this._callback = callback;
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
    callback: callback
  };

  // ensure there are no conflicts with existing providers
  for (var i = 0, ii = this._providers.length; i < ii; ++i) {
    var conflicts = provider.schema.conflicts(this._providers[i].schema);
    if (conflicts) {
      throw new Error('Provider already registered using the same name: ' +
          conflicts);
    }
  }

  this._providers.push(provider);
  setTimeout(function() {
    this._notifyProvider(provider);
  }.bind(this), 0);

  return function update(state) {
    if (arguments.length === 2) {
      var args = Array.prototype.slice.call(arguments, 0);
      state = {};
      state[args[0]] = args[1];
    }
    var serialized = {};
    var schema = provider.schema;
    for (var key in state) {
      serialized[schema.getPrefixed(key)] =
          schema.serialize(key, state[key], state);
    }
    util.extend(provider.state, state);
    util.extend(this._values, serialized);
    this._callback(this._values);
  }.bind(this);
};


/**
 * Notify provider of stored state values where they differ from provider
 * state values.
 * @param {Object} provider Provider to be notified.
 */
Store.prototype._notifyProvider = function(provider) {
  var state = {};
  var changed = false;
  provider.schema.forEachKey(function(key, prefixed) {
    var deserializedValue;
    if (prefixed in this._values) {
      try {
        deserializedValue =
            provider.schema.deserialize(key, this._values[prefixed]);
      } catch (err) {
        deserializedValue = provider.schema.getDefault(key);
      }
    } else {
      deserializedValue = provider.schema.getDefault(key);
    }
    if (key in provider.state) {
      // compare to current provider state
      var serializedValue = provider.schema.serialize(key, deserializedValue,
          provider.state);
      var providerValue = provider.schema.serialize(key, provider.state[key],
          provider.state);
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
    provider.callback(state);
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
 * @param {Object} values New values.
 */
Store.prototype.update = function(values) {
  this._values = values;
  setTimeout(function() {
    this._forEachProvider(this._notifyProvider);
  }.bind(this), 0);
};
