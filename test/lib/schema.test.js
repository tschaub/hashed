var lab = require('lab');

var Schema = require('../../lib/schema').Schema;

var assert = lab.assert;
var experiment = lab.experiment;
var test = lab.test;

var dec = decodeURIComponent;

experiment('schema', function() {

  experiment('Schema', function() {

    experiment('constructor', function() {

      test('creates a new instance', function(done) {
        var schema = new Schema({foo: 'bar'});
        assert.instanceOf(schema, Schema);
        done();
      });

    });

    experiment('#getOffset()', function() {

      test('returns a number for known keys', function(done) {
        var schema = new Schema({foo: 'bar'});
        assert.isNumber(schema.getOffset('foo'));
        done();
      });

      test('returns different numbers for different keys', function(done) {
        var schema = new Schema({foo: 'bar', baz: 'bam'});
        var fooOffset = schema.getOffset('foo');
        assert.isNumber(fooOffset);
        var bazOffset = schema.getOffset('baz');
        assert.isNumber(bazOffset);

        assert.notEqual(fooOffset, bazOffset);
        done();
      });

      test('throws for unknown keys', function(done) {
        var schema = new Schema({foo: 'bar'});
        assert.throws(function() {
          schema.getOffset('bam');
        }, 'Invalid key: bam');
        done();
      });

    });

    experiment('#getLength()', function() {

      test('returns the number of fields', function(done) {
        var schema = new Schema({foo: 'bar', baz: 'bam'});
        assert.equal(schema.getLength(), 2);
        done();
      });

    });

    experiment('#serialize()', function() {

      test('serializes values', function(done) {
        var schema = new Schema({aNumber: 10, anArray: ['one', 'two']});
        assert.equal(schema.serialize('aNumber', 42), '42');
        var json = dec(schema.serialize('anArray', [2, 3]));
        assert.deepEqual(JSON.parse(json), [2, 3]);
        done();
      });

      test('calls custom serializer', function(done) {
        var calls = [];
        var schema = new Schema({
          custom: {
            init: 10,
            serialize: function(value, s) {
              calls.push([value, s]);
              return String(value);
            }
          }
        });

        var state = {};
        assert.equal(schema.serialize('custom', 42, state), '42');
        assert.equal(calls.length, 1);
        assert.equal(calls[0][0], 42);
        assert.equal(calls[0][1], state);
        done();
      });

      test('throws for type mismatch', function(done) {
        var schema = new Schema({aNumber: 10});
        assert.throws(function() {
          schema.serialize('aNumber', 'asdf');
        }, 'Expected number to serialize: asdf');
        done();
      });

      test('throws for unknown key', function(done) {
        var schema = new Schema({aNumber: 10});
        assert.throws(function() {
          schema.serialize('foo', 'asdf');
        }, 'Unknown key: foo');
        done();
      });

    });

    experiment('#deserialize()', function() {

      test('deserializes values', function(done) {
        var schema = new Schema({aNumber: 10, anArray: ['one', 'two']});
        assert.equal(schema.deserialize('aNumber', '42'), 42);
        var json = '[2, 3]';
        assert.deepEqual(schema.deserialize('anArray', json), [2, 3]);
        done();
      });

      test('throws for type mismatch', function(done) {
        var schema = new Schema({aNumber: 10});
        assert.throws(function() {
          schema.deserialize('aNumber', 'asdf');
        }, 'Expected to deserialize a number: asdf');
        done();
      });

      test('throws for unknown key', function(done) {
        var schema = new Schema({aNumber: 10});
        assert.throws(function() {
          schema.deserialize('foo', 'asdf');
        }, 'Unknown key: foo');
        done();
      });

    });

    experiment('#getDefault()', function() {

      test('gets the default for a key', function(done) {
        var schema = new Schema({foo: 'bar'});
        assert.equal(schema.getDefault('foo'), 'bar');
        done();
      });

      test('gets the default given init value', function(done) {
        var schema = new Schema({foo: {init: 'bar'}});
        assert.equal(schema.getDefault('foo'), 'bar');
        done();
      });

      test('gets the default given init function', function(done) {
        var schema = new Schema({
          foo: {
            init: function() {
              return 'bar';
            }
          }
        });
        assert.equal(schema.getDefault('foo'), 'bar');
        done();
      });

      test('throws for unknown key', function(done) {
        var schema = new Schema({foo: 'bar'});
        assert.throws(function() {
          schema.getDefault('asdf');
        }, 'Unknown key: asdf');
        done();
      });

    });

  });

});
