var lab = exports.lab = require('lab').script();
var expect = require('code').expect;

var Schema = require('../../lib/schema').Schema;

var dec = decodeURIComponent;

lab.experiment('schema', function() {

  lab.experiment('Schema', function() {

    lab.experiment('constructor', function() {

      lab.test('creates a new instance', function(done) {
        var schema = new Schema({foo: 'bar'});
        expect(schema).to.be.an.instanceof(Schema);
        done();
      });

    });

    lab.experiment('#serialize()', function() {

      lab.test('serializes values', function(done) {
        var schema = new Schema({aNumber: 10, anArray: ['one', 'two']});
        expect(schema.serialize('aNumber', 42)).to.equal('42');
        var json = dec(schema.serialize('anArray', [2, 3]));
        expect(JSON.parse(json)).to.equal([2, 3]);
        done();
      });

      lab.test('works with unprefixed keys', function(done) {
        var schema = new Schema({number: 10, _: 'pre'});
        expect(schema.serialize('number', 42)).to.equal('42');
        done();
      });

      lab.test('calls custom serializer', function(done) {
        var calls = [];
        var schema = new Schema({
          custom: {
            default: 10,
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

      lab.test('throws for type mismatch', function(done) {
        var schema = new Schema({aNumber: 10});
        var call = function() {
          schema.serialize('aNumber', 'asdf');
        };
        expect(call).to.throw('Expected number to serialize: asdf');
        done();
      });

      lab.test('throws for unknown key', function(done) {
        var schema = new Schema({aNumber: 10});
        var call = function() {
          schema.serialize('foo', 'asdf');
        };
        expect(call).to.throw('Unknown key: foo');
        done();
      });

    });

    lab.experiment('#deserialize()', function() {

      lab.test('deserializes values', function(done) {
        var schema = new Schema({aNumber: 10, anArray: ['one', 'two']});
        expect(schema.deserialize('aNumber', '42')).to.equal(42);
        var json = '[2, 3]';
        expect(schema.deserialize('anArray', json)).to.equal([2, 3]);
        done();
      });

      lab.test('throws for type mismatch', function(done) {
        var schema = new Schema({aNumber: 10});
        var call = function() {
          schema.deserialize('aNumber', 'asdf');
        };
        expect(call).to.throw('Expected to deserialize a number: asdf');
        done();
      });

      lab.test('throws for unknown key', function(done) {
        var schema = new Schema({aNumber: 10});
        var call = function() {
          schema.deserialize('foo', 'asdf');
        };
        expect(call).to.throw('Unknown key: foo');
        done();
      });

    });

    lab.experiment('#getDefault()', function() {

      lab.test('gets the default for a key', function(done) {
        var schema = new Schema({foo: 'bar'});
        expect(schema.getDefault('foo')).to.equal('bar');
        done();
      });

      lab.test('gets the default value given an object with default', function(done) {
        var schema = new Schema({foo: {default: 'bar'}});
        expect(schema.getDefault('foo')).to.equal('bar');
        done();
      });

      lab.test('throws for unknown key', function(done) {
        var schema = new Schema({foo: 'bar'});
        var call = function() {
          schema.getDefault('asdf');
        };
        expect(call).to.throw('Unknown key: asdf');
        done();
      });

    });

    lab.experiment('#getPrefixed()', function() {

      lab.test('prepends the prefix', function(done) {
        var schema = new Schema({
          aNumber: 10, anArray: ['one', 'two'],
          _: 'customPrefix'
        });

        expect(schema.getPrefixed('aNumber')).to.equal('customPrefix.aNumber');
        expect(schema.getPrefixed('anArray')).to.equal('customPrefix.anArray');
        done();
      });

      lab.test('works without a prefix', function(done) {
        var schema = new Schema({
          aNumber: 10, anArray: ['one', 'two']
        });

        expect(schema.getPrefixed('aNumber')).to.equal('aNumber');
        expect(schema.getPrefixed('anArray')).to.equal('anArray');
        done();
      });

    });

    lab.experiment('#conflicts()', function() {

      lab.test('two unprefixed conflict-free schemas', function(done) {
        var first = new Schema({
          foo: 'bar',
          number: 42
        });

        var second = new Schema({
          bam: 'baz',
          digit: 42
        });

        expect(first.conflicts(second)).to.be.false();
        expect(second.conflicts(first)).to.be.false();
        done();
      });

      lab.test('two unprefixed conflicting schemas', function(done) {
        var first = new Schema({
          foo: 'bar',
          number: 42
        });

        var second = new Schema({
          foo: 'bam',
          digit: 42
        });

        expect(first.conflicts(second)).to.equal('foo');
        expect(second.conflicts(first)).to.equal('foo');
        done();
      });

      lab.test('one unprefixed, one prefixed, no conflicts', function(done) {
        var first = new Schema({
          foo: 'bar',
          number: 42
        });

        var second = new Schema({
          foo: 'bam',
          number: 42,
          _: 'second'
        });

        expect(first.conflicts(second)).to.be.false();
        expect(second.conflicts(first)).to.be.false();
        done();
      });

      lab.test('two prefixed, no conflicts', function(done) {
        var first = new Schema({
          foo: 'bar',
          number: 42,
          _: 'first'
        });

        var second = new Schema({
          foo: 'bam',
          number: 42,
          _: 'second'
        });

        expect(first.conflicts(second)).to.be.false();
        expect(second.conflicts(first)).to.be.false();
        done();
      });

      lab.test('same prefix, no conflicts', function(done) {
        var first = new Schema({
          number: 42,
          _: 'same'
        });

        var second = new Schema({
          foo: 'bam',
          _: 'same'
        });

        expect(first.conflicts(second)).to.be.false();
        expect(second.conflicts(first)).to.be.false();
        done();
      });

      lab.test('same prefix, with conflicts', function(done) {
        var first = new Schema({
          number: 42,
          _: 'same'
        });

        var second = new Schema({
          number: 10,
          _: 'same'
        });

        expect(first.conflicts(second)).to.equal('same.number');
        expect(second.conflicts(first)).to.equal('same.number');
        done();
      });

    });

  });

});
