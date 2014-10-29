var lab = require('lab');

var serializers = require('../../lib/serializers');

var assert = lab.assert;
var experiment = lab.experiment;
var test = lab.test;

var enc = encodeURIComponent;
var dec = decodeURIComponent;

experiment('serializers', function() {

  experiment('get()', function() {
    var get = serializers.get;

    test('returns a function for a known type', function(done) {
      var serialize = get('string');
      assert.isFunction(serialize);
      done();
    });

    test('throws for an unknown type', function(done) {
      assert.throws(function() {
        get('foo');
      }, 'Unable to serialize type: foo');
      done();
    });

    test('returns an appropriate serializer for string', function(done) {
      var serialize = get('string');
      assert.equal(serialize('foo'), 'foo');
      done();
    });

    test('string serializer throws for non-string', function(done) {
      var serialize = get('string');
      assert.throws(function() {
        serialize(42);
      }, 'Expected string to serialize: 42');
      done();
    });

    test('returns an appropriate serializer for number', function(done) {
      var serialize = get('number');
      assert.equal(serialize(42), '42');
      done();
    });

    test('number serializer throws for non-number', function(done) {
      var serialize = get('number');
      assert.throws(function() {
        serialize('foo');
      }, 'Expected number to serialize: foo');
      done();
    });

    test('returns an appropriate serializer for date', function(done) {
      var serialize = get('date');
      var then = '2014-06-09T23:57:12.588Z';
      var date = new Date(then);
      assert.equal(dec(serialize(date)), then);
      done();
    });

    test('date serializer throws for non-date', function(done) {
      var serialize = get('date');
      assert.throws(function() {
        serialize('foo');
      }, 'Expected date to serialize: foo');
      done();
    });

    test('returns an appropriate serializer for array', function(done) {
      var serialize = get('array');
      var array = ['foo', 42];
      var json = JSON.stringify(array);
      assert.equal(serialize(array), enc(json));
      done();
    });

    test('array serializer throws for non-array', function(done) {
      var serialize = get('array');
      assert.throws(function() {
        serialize('foo');
      }, 'Expected array to serialize: foo');
      done();
    });

    test('returns an appropriate serializer for object', function(done) {
      var serialize = get('object');
      var obj = {foo: 'bar'};
      var json = dec(serialize(obj));
      assert.deepEqual(obj, JSON.parse(json));
      done();
    });

  });

});
