var lab = require('lab');

var deserializers = require('../../lib/deserializers');

var assert = lab.assert;
var experiment = lab.experiment;
var test = lab.test;


experiment('deserializers', function() {

  experiment('get()', function() {
    var get = deserializers.get;

    test('returns a function for a known type', function(done) {
      var deserialize = get('string');
      assert.isFunction(deserialize);
      done();
    });

    test('throws for an unknown type', function(done) {
      assert.throws(function() {
        get('foo');
      }, 'Unable to deserialize type: foo');
      done();
    });

    test('returns an appropriate deserializer for string', function(done) {
      var deserialize = get('string');
      assert.equal(deserialize('foo'), 'foo');
      done();
    });

    test('string deserializer throws for non-string', function(done) {
      var deserialize = get('string');
      assert.throws(function() {
        deserialize(10);
      }, 'Expected string to deserialize: 10');
      done();
    });

    test('string deserializer throws for empty string', function(done) {
      var deserialize = get('string');
      assert.throws(function() {
        deserialize('');
      }, 'Expected string to deserialize: ');
      done();
    });

    test('returns an appropriate deserializer for number', function(done) {
      var deserialize = get('number');
      assert.equal(deserialize('42'), 42);
      done();
    });

    test('number deserializer throws for non-string', function(done) {
      var deserialize = get('number');
      assert.throws(function() {
        deserialize([]);
      }, 'Expected string to deserialize: ');
      done();
    });

    test('number deserializer throws for empty string', function(done) {
      var deserialize = get('number');
      assert.throws(function() {
        deserialize('');
      }, 'Expected string to deserialize: ');
      done();
    });

    test('number deserializer throws for non-numeric string', function(done) {
      var deserialize = get('number');
      assert.throws(function() {
        deserialize('foo');
      }, 'Expected to deserialize a number: foo');
      done();
    });

    test('returns an appropriate deserializer for boolean', function(done) {
      var deserialize = get('boolean');
      assert.equal(deserialize('true'), true);
      assert.equal(deserialize('false'), false);
      done();
    });

    test('boolean deserializer throws for non-boolean', function(done) {
      var deserialize = get('boolean');
      assert.throws(function() {
        deserialize('foo');
      }, 'Expected boolean to deserialize: ');
      done();
    });

    test('boolean deserializer throws for empty string', function(done) {
      var deserialize = get('boolean');
      assert.throws(function() {
        deserialize('');
      }, 'Expected string to deserialize: ');
      done();
    });

    test('returns an appropriate deserializer for date', function(done) {
      var deserialize = get('date');
      var then = '2014-06-09T23:57:12.588Z';
      var date = deserialize(then);
      assert.instanceOf(date, Date);
      assert.equal(date.getTime(), new Date(then).getTime());
      done();
    });

    test('date deserializer throws for non string', function(done) {
      var deserialize = get('date');
      assert.throws(function() {
        deserialize(10);
      }, 'Expected string to deserialize: 10');
      done();
    });

    test('date deserializer throws for empty string', function(done) {
      var deserialize = get('date');
      assert.throws(function() {
        deserialize('');
      }, 'Expected string to deserialize: ');
      done();
    });

    test('date deserializer throws for invalid date string', function(done) {
      var deserialize = get('date');
      assert.throws(function() {
        deserialize('foo');
      }, 'Expected to deserialize a date: foo');
      done();
    });

    test('returns an appropriate serializer for array', function(done) {
      var deserialize = get('array');
      assert.deepEqual(deserialize('["bar", 100]'), ['bar', 100]);
      done();
    });

    test('array deserializer throws for non string', function(done) {
      var deserialize = get('array');
      assert.throws(function() {
        deserialize(10);
      }, 'Expected string to deserialize: 10');
      done();
    });

    test('array deserializer throws for empty string', function(done) {
      var deserialize = get('array');
      assert.throws(function() {
        deserialize('');
      }, 'Expected string to deserialize: ');
      done();
    });

    test('array deserializer throws for invalid array string', function(done) {
      var deserialize = get('array');
      assert.throws(function() {
        deserialize('foo');
      }, 'Expected to deserialize an array: foo');
      done();
    });

    test('returns an appropriate deserializer for object', function(done) {
      var deserialize = get('object');
      var json = '{"foo": "bar"}';
      var obj = deserialize(json);
      assert.deepEqual(obj, {foo: 'bar'});
      done();
    });

    test('object deserializer throws for non string', function(done) {
      var deserialize = get('object');
      assert.throws(function() {
        deserialize(10);
      }, 'Expected string to deserialize: 10');
      done();
    });

    test('object deserializer throws for empty string', function(done) {
      var deserialize = get('object');
      assert.throws(function() {
        deserialize('');
      }, 'Expected string to deserialize: ');
      done();
    });

    test('object deserializer throws for invalid object', function(done) {
      var deserialize = get('object');
      assert.throws(function() {
        deserialize('foo');
      }, 'Expected to deserialize an object: foo');
      done();
    });

  });

});
