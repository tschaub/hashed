var util = require('./util');

var serializers = require('./serializers');
var deserializers = require('./deserializers');

/**
 * Create a new field.  A field must have a default value (`init`) and is
 * capable of serializing and deserializing values.
 * @param {Object} config Field configuration.  Must have an init property
 *     with a default value.  The init property can also be a function that
 *     returns the default value.  May have optional `serialize` and
 *     `deserialize` functions.  As a shorthand for providing a config object
 *     with an `init` property, a default value may be provided directly.
 * @constructor
 */
exports.Field = function(config) {
  if (util.typeOf(config) !== 'object') {
    config = {init: config};
  }
  if (!('init' in config)) {
    throw new Error('Missing init');
  }
  var init = config.init;
  if (typeof init === 'function') {
    init = init();
  }
  this.init = init;

  var type = util.typeOf(init);
  this.serialize = config.serialize || serializers.get(type);
  this.deserialize = config.deserialize || deserializers.get(type);
};

