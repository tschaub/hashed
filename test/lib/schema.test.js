var lab = exports.lab = require('lab').script();
var expect = require('code').expect;

var Schema = require('../../lib/schema').Schema;

var experiment = lab.experiment;
var test = lab.test;

var dec = decodeURIComponent;

experiment('schema', function() {

  experiment('Schema', function() {

    experiment('constructor', function() {

      test('creates a new instance', function(done) {
        var schema = new Schema({foo: 'bar'});
        expect(schema).to.be.an.instanceof(Schema);
        done();
      });

    });

    experiment('#getLength()', function() {

      test('returns the number of fields', function(done) {
        var schema = new Schema({foo: 'bar', baz: 'bam'});
        expect(schema.getLength()).to.equal(2);
        done();
      });

      test('ignores the prefix', function(done) {
        var schema = new Schema({foo: 'bar', baz: 'bam', _: 'pre'});
        expect(schema.getLength()).to.equal(2);
        done();
      });

    });

    experiment('#serialize()', function() {

      test('serializes values', function(done) {
        var schema = new Schema({aNumber: 10, anArray: ['one', 'two']});
        expect(schema.serialize('aNumber', 42)).to.equal('42');
        var json = dec(schema.serialize('anArray', [2, 3]));
        expect(JSON.parse(json)).to.deep.equal([2, 3]);
        done();
      });

      test('works with unprefixed keys', function(done) {
        var schema = new Schema({number: 10, _: 'pre'});
        expect(schema.serialize('number', 42)).to.equal('42');
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
        expect(schema.serialize('custom', 42, state)).to.equal('42');
        expect(calls.length).to.equal(1);
        expect(calls[0][0]).to.equal(42);
        expect(calls[0][1]).to.equal(state);
        done();
      });

      test('throws for type mismatch', function(done) {
        var schema = new Schema({aNumber: 10});
        var call = function() {
            schema.serialize('aNumber', 'asdf');
        };
        expect(call).to.throw('Expected number to serialize: asdf');
        done();
      });

      test('throws for unknown key', function(done) {
        var schema = new Schema({aNumber: 10});
        var call = function() {
            schema.serialize('foo', 'asdf');
        };
        expect(call).to.throw('Unknown key: foo');
        done();
      });

    });

    experiment('#deserialize()', function() {

      test('deserializes values', function(done) {
        var schema = new Schema({aNumber: 10, anArray: ['one', 'two']});
        expect(schema.deserialize('aNumber', '42')).to.equal(42);
        var json = '[2, 3]';
        expect(schema.deserialize('anArray', json)).to.deep.equal([2, 3]);
        done();
      });

      test('throws for type mismatch', function(done) {
        var schema = new Schema({aNumber: 10});
        var call = function() {
            schema.deserialize('aNumber', 'asdf');
        };
        expect(call).to.throw('Expected to deserialize a number: asdf');
        done();
      });

      test('throws for unknown key', function(done) {
        var schema = new Schema({aNumber: 10});
        var call = function() {
            schema.deserialize('foo', 'asdf');
        };
        expect(call).to.throw('Unknown key: foo');
        done();
      });

    });

    experiment('#getDefault()', function() {

      test('gets the default for a key', function(done) {
        var schema = new Schema({foo: 'bar'});
        expect(schema.getDefault('foo')).to.equal('bar');
        done();
      });

      test('gets the default given init value', function(done) {
        var schema = new Schema({foo: {init: 'bar'}});
        expect(schema.getDefault('foo')).to.equal('bar');
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
        expect(schema.getDefault('foo')).to.equal('bar');
        done();
      });

      test('throws for unknown key', function(done) {
        var schema = new Schema({foo: 'bar'});
        var call = function() {
            schema.getDefault('asdf');
        };
        expect(call).to.throw('Unknown key: asdf');
        done();
      });

    });

    experiment('#getPrefixed()', function() {

      test('prepends the prefix', function(done) {
        var schema = new Schema({
          aNumber: 10, anArray: ['one', 'two'],
          _: 'customPrefix'
        });

        expect(schema.getPrefixed('aNumber')).to.equal('customPrefix.aNumber');
        expect(schema.getPrefixed('anArray')).to.equal('customPrefix.anArray');
        done();
      });

      test('works without a prefix', function(done) {
        var schema = new Schema({
          aNumber: 10, anArray: ['one', 'two']
        });

        expect(schema.getPrefixed('aNumber')).to.equal('aNumber');
        expect(schema.getPrefixed('anArray')).to.equal('anArray');
        done();
      });

    });

  });

});
