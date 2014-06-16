var lab = require('lab');

var field = require('../../lib/field');

var assert = lab.assert;
var experiment = lab.experiment;
var test = lab.test;

experiment('field', function() {

  experiment('Field', function() {
    var Field = field.Field;

    experiment('constructor', function() {

      test('creates a field from a number', function(done) {
        var field = new Field(42);
        assert.instanceOf(field, Field);
        done();
      });

      test('creates a field from a string', function(done) {
        var field = new Field('foo');
        assert.instanceOf(field, Field);
        done();
      });

      test('creates a field from a date', function(done) {
        var field = new Field(new Date());
        assert.instanceOf(field, Field);
        done();
      });

      test('creates a field from an array', function(done) {
        var field = new Field(['foo', 'bar']);
        assert.instanceOf(field, Field);
        done();
      });

      test('creates a field from an object with init', function(done) {
        var field = new Field({init: 42});
        assert.instanceOf(field, Field);
        done();
      });

      test('throws for unsupported init (RegExp)', function(done) {
        assert.throws(function() {
          var field = new Field({init: /foo/});
        }, 'Unable to serialize type: regexp');
        done();
      });

      test('throws for unsupported init (null)', function(done) {
        assert.throws(function() {
          var field = new Field({init: null});
        }, 'Unable to serialize type: null');
        done();
      });

      test('throws for unsupported init (undefined)', function(done) {
        assert.throws(function() {
          var field = new Field({init: undefined});
        }, 'Unable to serialize type: undefined');
        done();
      });

      test('throws for an object without init', function(done) {
        assert.throws(function() {
          var field = new Field({foo: 'bar'});
        }, 'Missing init');
        done();
      });

    });

    experiment('#serialize()', function(done) {

      test('serializes strings with init string', function(done) {
        var field = new Field({init: 'foo'});
        assert.instanceOf(field, Field);
        assert.equal(field.serialize('bar'), 'bar');
        assert.equal(field.serialize(''), '');
        done();
      });

      test('serializes numbers with init number', function(done) {
        var field = new Field({init: 42});
        assert.instanceOf(field, Field);
        assert.equal(field.serialize(100), '100');
        assert.equal(field.serialize(0), '0');
        done();
      });

      test('serializes dates with init date', function(done) {
        var field = new Field({init: new Date()});
        assert.instanceOf(field, Field);
        var then = '2014-06-09T23:57:12.588Z';
        assert.equal(field.serialize(new Date(then)), then);
        done();
      });

      test('serializes arrays with init array', function(done) {
        var field = new Field({init: [42, 'foo']});
        assert.instanceOf(field, Field);
        var array = ['foo', 42];
        var json = field.serialize(array);
        assert.deepEqual(JSON.parse(json), array);
        done();
      });

      test('serializes objects with init object', function(done) {
        var field = new Field({init: {foo: 'bar'}});
        assert.instanceOf(field, Field);
        var obj = {baz: 'bam'};
        var json = field.serialize(obj);
        assert.deepEqual(JSON.parse(json), obj);
        done();
      });

      test('serializes strings with init function (string)', function(done) {
        var field = new Field({init: function() {return 'foo';}});
        assert.instanceOf(field, Field);
        assert.equal(field.serialize('bar'), 'bar');
        done();
      });

      test('serializes with serialize function', function(done) {
        var serialize = function(value) {
          return value + 'foo';
        };
        var field = new Field({init: 42, serialize: serialize});
        assert.instanceOf(field, Field);
        assert.equal(field.serialize('10'), '10foo');
        done();
      });

    });

    experiment('#deserialize()', function(done) {

      test('deserializes strings with init string', function(done) {
        var field = new Field({init: 'foo'});
        assert.instanceOf(field, Field);
        assert.equal(field.deserialize('bar'), 'bar');
        done();
      });

      test('serializes numbers with init number', function(done) {
        var field = new Field({init: 42});
        assert.instanceOf(field, Field);
        assert.equal(field.deserialize('100'), 100);
        assert.equal(field.deserialize('0'), 0);
        done();
      });

      test('deserializes date with init date', function(done) {
        var field = new Field({init: new Date()});
        assert.instanceOf(field, Field);
        var then = '2014-06-09T23:57:12.588Z';
        var date = field.deserialize(then);
        assert.equal(date.getTime(), new Date(then).getTime());
        done();
      });

      test('deserializes arrays with init array', function(done) {
        var field = new Field({init: [42, 'foo']});
        assert.instanceOf(field, Field);
        var array = ['foo', 42];
        var json = JSON.stringify(array);
        assert.deepEqual(field.deserialize(json), array);
        done();
      });

      test('deserializes objects with init object', function(done) {
        var field = new Field({init: {foo: 'bar'}});
        assert.instanceOf(field, Field);
        var obj = {baz: 'bam'};
        var json = JSON.stringify(obj);
        assert.deepEqual(field.deserialize(json), obj);
        done();
      });

      test('deserializes strings with init function (string)', function(done) {
        var field = new Field({init: function() {return 'foo';}});
        assert.instanceOf(field, Field);
        assert.equal(field.deserialize('bar'), 'bar');
        done();
      });

      test('deserializes with deserialize function', function(done) {
        var deserialize = function(value) {
          return value + 'foo';
        };
        var field = new Field({init: 42, deserialize: deserialize});
        assert.instanceOf(field, Field);
        assert.equal(field.deserialize(10), '10foo');
        done();
      });

    });

  });

});
