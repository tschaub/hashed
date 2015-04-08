var lab = exports.lab = require('lab').script();
var expect = require('code').expect;

var Field = require('../../lib/field').Field;

var experiment = lab.experiment;
var test = lab.test;

var dec = decodeURIComponent;

experiment('field', function() {

  experiment('Field', function() {

    experiment('constructor', function() {

      test('creates a field from a number', function(done) {
        var field = new Field(42);
        expect(field).to.be.an.instanceof(Field);
        done();
      });

      test('creates a field from a string', function(done) {
        var field = new Field('foo');
        expect(field).to.be.an.instanceof(Field);
        done();
      });

      test('creates a field from a date', function(done) {
        var field = new Field(new Date());
        expect(field).to.be.an.instanceof(Field);
        done();
      });

      test('creates a field from an array', function(done) {
        var field = new Field(['foo', 'bar']);
        expect(field).to.be.an.instanceof(Field);
        done();
      });

      test('creates a field from an object with init', function(done) {
        var field = new Field({init: 42});
        expect(field).to.be.an.instanceof(Field);
        done();
      });

      test('throws for unsupported init (RegExp)', function(done) {
        var call = function() {
          return new Field({init: /foo/});
        };
        expect(call).to.throw('Unable to serialize type: regexp');
        done();
      });

      test('throws for unsupported init (null)', function(done) {
        var call = function() {
          return new Field({init: null});
        };
        expect(call).to.throw('Unable to serialize type: null');
        done();
      });

      test('throws for unsupported init (undefined)', function(done) {
        var call = function() {
          return new Field({init: undefined});
        };
        expect(call).to.throw('Unable to serialize type: undefined');
        done();
      });

      test('throws for an object without init', function(done) {
        var call = function() {
          return new Field({foo: 'bar'});
        };
        expect(call).to.throw('Missing init');
        done();
      });

    });

    experiment('#serialize()', function() {

      test('serializes strings with init string', function(done) {
        var field = new Field({init: 'foo'});
        expect(field.serialize('bar')).to.equal('bar');
        expect(field.serialize('')).to.equal('');
        done();
      });

      test('serializes numbers with init number', function(done) {
        var field = new Field({init: 42});
        expect(field.serialize(100)).to.equal('100');
        expect(field.serialize(0)).to.equal('0');
        done();
      });

      test('serializes dates with init date', function(done) {
        var field = new Field({init: new Date()});
        var then = '2014-06-09T23:57:12.588Z';
        expect(dec(field.serialize(new Date(then)))).to.equal(then);
        done();
      });

      test('serializes arrays with init array', function(done) {
        var field = new Field({init: [42, 'foo']});
        var array = ['foo', 42];
        var json = dec(field.serialize(array));
        expect(JSON.parse(json)).to.deep.equal(array);
        done();
      });

      test('serializes objects with init object', function(done) {
        var field = new Field({init: {foo: 'bar'}});
        var obj = {baz: 'bam'};
        var json = dec(field.serialize(obj));
        expect(JSON.parse(json)).to.deep.equal(obj);
        done();
      });

      test('serializes strings with init function (string)', function(done) {
        var field = new Field({init: function() {
          return 'foo';
        }});
        expect(field.serialize('bar')).to.equal('bar');
        done();
      });

      test('serializes with serialize function', function(done) {
        var serialize = function(value) {
          return value + 'foo';
        };
        var field = new Field({init: 42, serialize: serialize});
        expect(field.serialize('10')).to.equal('10foo');
        done();
      });

    });

    experiment('#deserialize()', function() {

      test('deserializes strings with init string', function(done) {
        var field = new Field({init: 'foo'});
        expect(field.deserialize('bar')).to.equal('bar');
        done();
      });

      test('serializes numbers with init number', function(done) {
        var field = new Field({init: 42});
        expect(field.deserialize('100')).to.equal(100);
        expect(field.deserialize('0')).to.equal(0);
        done();
      });

      test('deserializes date with init date', function(done) {
        var field = new Field({init: new Date()});
        expect(field).to.be.an.instanceof(Field);
        var then = '2014-06-09T23:57:12.588Z';
        var date = field.deserialize(then);
        expect(date.getTime()).to.equal(new Date(then).getTime());
        done();
      });

      test('deserializes arrays with init array', function(done) {
        var field = new Field({init: [42, 'foo']});
        expect(field).to.be.an.instanceof(Field);
        var array = ['foo', 42];
        var json = JSON.stringify(array);
        expect(field.deserialize(json)).to.deep.equal(array);
        done();
      });

      test('deserializes objects with init object', function(done) {
        var field = new Field({init: {foo: 'bar'}});
        expect(field).to.be.an.instanceof(Field);
        var obj = {baz: 'bam'};
        var json = JSON.stringify(obj);
        expect(field.deserialize(json)).to.deep.equal(obj);
        done();
      });

      test('deserializes strings with init function (string)', function(done) {
        var field = new Field({init: function() {
          return 'foo';
        }});
        expect(field.deserialize('bar')).to.equal('bar');
        done();
      });

      test('deserializes with deserialize function', function(done) {
        var deserialize = function(value) {
          return value + 'foo';
        };
        var field = new Field({init: 42, deserialize: deserialize});
        expect(field.deserialize(10)).to.equal('10foo');
        done();
      });

    });

  });

});
