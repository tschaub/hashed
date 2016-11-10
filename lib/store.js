var Schema = require('./schema').Schema;
var util = require('./util');
var serializers = require('./serializers');


/**
 * An object backed store of string values.  Allows registering multiple state
 * providers.
 * @param {Object} values Initial serialized values.
 * @param {function(Object)} callback Called with an object of serialized
 *     values and defaults whenever a provider updates state.
 * @constructor
 */
var Store = exports.Store = function(values, callback) {
  this._values = values;
  this._defaults = {};
  this._providers = [];
  this._callback = callback;
  this._callbackTimer = null;
};

Store.prototype._scheduleCallback = function() {
  if (this._callbackTimer) {
    clearTimeout(this._callbackTimer);
  }
  this._callbackTimer = setTimeout(this._debouncedCallback.bind(this));
};

Store.prototype._debouncedCallback = function() {
  this._callbackTimer = null;
  this._callback(this._values, this._defaults);
};

Store.prototype.update = function(values) {
  if (this._updateTimer) {
    clearTimeout(this._updateTimer);
  }
  this._updateTimer = setTimeout(this._debouncedUpdate.bind(this, values));
};

Store.prototype._debouncedUpdate = function(newValues) {
  this._updateTimer = null;
  var values = this._values;
  var providers = this._providers.slice();  // callbacks may unregister providers
  for (var i = providers.length - 1; i >= 0; --i) {
    var provider = providers[i];
    var schema = provider.schema;
    var changed = false;
    var state = {};
    schema.forEachKey(function(key, prefixed) {
      var deserialized;
      if (!(prefixed in newValues)) {
        deserialized = schema.getDefault(key);
        var serializedDefault = schema.serialize(key, deserialized);
        if (values[prefixed] !== serializedDefault) {
          changed = true;
          values[prefixed] = serializedDefault;
          state[key] = deserialized;
        }
      } else if (values[prefixed] !== newValues[prefixed]) {
        try {
          deserialized = schema.deserialize(key, newValues[prefixed]);
          values[prefixed] = newValues[prefixed];
          state[key] = deserialized;
          changed = true;
        } catch (err) {
          // invalid value, pass
        }
      }
    });
    if (changed && this._providers.indexOf(provider) >= 0) {
      provider.callback(state);
    }
  }
};

/**
 * Unregister a provider.  Deletes the provider's values from the underlying
 * store and calls the store's callback.
 * @param {Function} callback The provider's callback.
 */
Store.prototype.unregister = function(callback) {
  var removedProvider;
  this._providers = this._providers.filter(function(provider) {
    var remove = provider.callback === callback;
    if (remove) {
      removedProvider = provider;
    }
    return !remove;
  });
  if (!removedProvider) {
    throw new Error('Unable to unregister hashed state provider');
  }
  var values = this._values;
  var defaults = this._defaults;
  removedProvider.schema.forEachKey(function(key, prefixed) {
    delete values[prefixed];
    delete defaults[prefixed];
  });
  this._scheduleCallback();
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
    callback: callback
  };

  // ensure there are no conflicts with existing providers
  for (var i = 0, ii = this._providers.length; i < ii; ++i) {
    var conflicts = provider.schema.conflicts(this._providers[i].schema);
    if (conflicts) {
      throw new Error('Provider already registered using the same name: ' +
          conflicts);
    }
    if (provider.callback === this._providers[i].callback) {
      throw new Error('Provider already registered with the same callback');
    }
  }

  this._providers.push(provider);
  this._initializeProvider(provider);

  return function update(state) {
    if (this._providers.indexOf(provider) === -1) {
      throw new Error('Unregistered provider attempting to update state');
    }
    var schema = provider.schema;
    var changed = false;
    var values = this._values;
    schema.forEachKey(function(key, prefixed) {
      if (key in state) {
        var serializedValue = schema.serialize(key, state[key], state);
        if (values[prefixed] !== serializedValue) {
          changed = true;
          values[prefixed] = serializedValue;
        }
      }
    });
    if (changed) {
      this._scheduleCallback();
    }
  }.bind(this);
};


/**
 * Call provider with initial values.
 * @param {Object} provider Provider to be initialized.
 */
Store.prototype._initializeProvider = function(provider) {
  var state = {};
  var defaults = {};
  var values = this._values;
  provider.schema.forEachKey(function(key, prefixed) {
    var deserializedValue;
    var deserializedDefault = provider.schema.getDefault(key);
    var serializedDefault = provider.schema.serialize(key, deserializedDefault);
    if (prefixed in values) {
      try {
        deserializedValue = provider.schema.deserialize(key, values[prefixed]);
      } catch (err) {
        deserializedValue = deserializedDefault;
      }
    } else {
      deserializedValue = deserializedDefault;
    }
    state[key] = deserializedValue;
    defaults[prefixed] = serializedDefault;
    values[prefixed] = provider.schema.serialize(key, deserializedValue);
  });
  for (var prefixed in defaults) {
    this._defaults[prefixed] = defaults[prefixed];
  }
  provider.callback(state);
};


/**
 * Serialize values with provider serializers where available.
 * @param {Object} values Values to be serialized.
 * @return {Object} The serialized values.
 */
Store.prototype.serialize = function(values) {
  var serialized = {};
  for (var i = 0, ii = this._providers.length; i < ii; ++i) {
    var provider = this._providers[i];
    provider.schema.forEachKey(function(key, prefixed) {
      if (prefixed in values) {
        serialized[prefixed] = provider.schema.serialize(key, values[prefixed], values);
      }
    });
  }
  for (var key in values) {
    if (!(key in serialized)) {
      var value = values[key];
      var type = util.typeOf(value);
      var serializer = serializers.get(type);
      serialized[key] = serializer(value);
    }
  }
  return serialized;
};
