var lab = require('lab');

var schema = require('../../lib/schema');

var assert = lab.assert;
var experiment = lab.experiment;
var test = lab.test;

var dec = decodeURIComponent;

experiment('schema', function() {

  experiment('Schema', function() {
    var Schema = schema.Schema;

    experiment('constructor', function() {

      test('creates a new instance', function(done) {
        var s = new Schema({foo: 'bar'});
        assert.instanceOf(s, Schema);
        done();
      });

    });

    experiment('#getOffset()', function() {

      test('returns a number for known keys', function(done) {
        var s = new Schema({foo: 'bar'});
        assert.isNumber(s.getOffset('foo'));
        done();
      });

      test('returns different numbers for different keys', function(done) {
        var s = new Schema({foo: 'bar', baz: 'bam'});
        var fooOffset = s.getOffset('foo');
        assert.isNumber(fooOffset);
        var bazOffset = s.getOffset('baz');
        assert.isNumber(bazOffset);

        assert.notEqual(fooOffset, bazOffset);
        done();
      });

      test('throws for unknown keys', function(done) {
        var s = new Schema({foo: 'bar'});
        assert.throws(function() {
          s.getOffset('bam');
        }, 'Invalid key: bam');
        done();
      });

    });

    experiment('#getLength()', function() {

      test('returns the number of fields', function(done) {
        var s = new Schema({foo: 'bar', baz: 'bam'});
        assert.equal(s.getLength(), 2);
        done();
      });

    });

    experiment('#serialize()', function() {

      test('serializes values', function(done) {
        var s = new Schema({aNumber: 10, anArray: ['one', 'two']});
        assert.equal(s.serialize('aNumber', 42), '42');
        var json = dec(s.serialize('anArray', [2, 3]));
        assert.deepEqual(JSON.parse(json), [2, 3]);
        done();
      });

      test('calls custom serializer', function(done) {
        var calls = [];
        var s = new Schema({
          custom: {
            init: 10,
            serialize: function(value, state) {
              calls.push([value, state]);
              return String(value);
            }
          }
        });

        var state = {};
        assert.equal(s.serialize('custom', 42, state), '42');
        assert.equal(calls.length, 1);
        assert.equal(calls[0][0], 42);
        assert.equal(calls[0][1], state);
        done();
      });

      test('throws for type mismatch', function(done) {
        var s = new Schema({aNumber: 10});
        assert.throws(function() {
          s.serialize('aNumber', 'asdf');
        }, 'Expected number to serialize: asdf');
        done();
      });

      test('throws for unknown key', function(done) {
        var s = new Schema({aNumber: 10});
        assert.throws(function() {
          s.serialize('foo', 'asdf');
        }, 'Unknown key: foo');
        done();
      });

    });

    experiment('#deserialize()', function() {

      test('deserializes values', function(done) {
        var s = new Schema({aNumber: 10, anArray: ['one', 'two']});
        assert.equal(s.deserialize('aNumber', '42'), 42);
        var json = '[2, 3]';
        assert.deepEqual(s.deserialize('anArray', json), [2, 3]);
        done();
      });

      test('throws for type mismatch', function(done) {
        var s = new Schema({aNumber: 10});
        assert.throws(function() {
          s.deserialize('aNumber', 'asdf');
        }, 'Expected to deserialize a number: asdf');
        done();
      });

      test('throws for unknown key', function(done) {
        var s = new Schema({aNumber: 10});
        assert.throws(function() {
          s.deserialize('foo', 'asdf');
        }, 'Unknown key: foo');
        done();
      });

    });

    experiment('#getDefault()', function() {

      test('gets the default for a key', function(done) {
        var s = new Schema({foo: 'bar'});
        assert.equal(s.getDefault('foo'), 'bar');
        done();
      });

      test('gets the default given init value', function(done) {
        var s = new Schema({foo: {init: 'bar'}});
        assert.equal(s.getDefault('foo'), 'bar');
        done();
      });

      test('gets the default given init function', function(done) {
        var s = new Schema({
          foo: {
            init: function() {
              return 'bar';
            }
          }
        });
        assert.equal(s.getDefault('foo'), 'bar');
        done();
      });

      test('throws for unknown key', function(done) {
        var s = new Schema({foo: 'bar'});
        assert.throws(function() {
          s.getDefault('asdf');
        }, 'Unknown key: asdf');
        done();
      });

    });

  });

});
