var lab = exports.lab = require('lab').script();
var expect = require('code').expect;

var Field = require('../../lib/field').Field;

var dec = decodeURIComponent;

lab.experiment('field', function() {

  lab.experiment('Field', function() {

    lab.experiment('constructor', function() {

      lab.test('creates a field from a number', function(done) {
        var field = new Field(42);
        expect(field).to.be.an.instanceof(Field);
        done();
      });

      lab.test('creates a field from a string', function(done) {
        var field = new Field('foo');
        expect(field).to.be.an.instanceof(Field);
        done();
      });

      lab.test('creates a field from a date', function(done) {
        var field = new Field(new Date());
        expect(field).to.be.an.instanceof(Field);
        done();
      });

      lab.test('creates a field from an array', function(done) {
        var field = new Field(['foo', 'bar']);
        expect(field).to.be.an.instanceof(Field);
        done();
      });

      lab.test('creates a field from an object with default', function(done) {
        var field = new Field({default: 42});
        expect(field).to.be.an.instanceof(Field);
        done();
      });

      lab.test('throws for unsupported default (RegExp)', function(done) {
        var call = function() {
          return new Field({default: /foo/});
        };
        expect(call).to.throw('Unable to serialize type: regexp');
        done();
      });

      lab.test('throws for unsupported default (null)', function(done) {
        var call = function() {
          return new Field({default: null});
        };
        expect(call).to.throw('Unable to serialize type: null');
        done();
      });

      lab.test('throws for unsupported default (undefined)', function(done) {
        var call = function() {
          return new Field({default: undefined});
        };
        expect(call).to.throw('Unable to serialize type: undefined');
        done();
      });

      lab.test('throws for an object without default', function(done) {
        var call = function() {
          return new Field({foo: 'bar'});
        };
        expect(call).to.throw('Missing default');
        done();
      });

    });

    lab.experiment('#serialize()', function() {

      lab.test('serializes strings with default string', function(done) {
        var field = new Field({default: 'foo'});
        expect(field.serialize('bar')).to.equal('bar');
        expect(field.serialize('')).to.equal('');
        done();
      });

      lab.test('serializes numbers with default number', function(done) {
        var field = new Field({default: 42});
        expect(field.serialize(100)).to.equal('100');
        expect(field.serialize(0)).to.equal('0');
        done();
      });

      lab.test('serializes dates with default date', function(done) {
        var field = new Field({default: new Date()});
        var then = '2014-06-09T23:57:12.588Z';
        expect(dec(field.serialize(new Date(then)))).to.equal(then);
        done();
      });

      lab.test('serializes arrays with default array', function(done) {
        var field = new Field({default: [42, 'foo']});
        var array = ['foo', 42];
        var json = dec(field.serialize(array));
        expect(JSON.parse(json)).to.equal(array);
        done();
      });

      lab.test('serializes objects with default object', function(done) {
        var field = new Field({default: {foo: 'bar'}});
        var obj = {baz: 'bam'};
        var json = dec(field.serialize(obj));
        expect(JSON.parse(json)).to.equal(obj);
        done();
      });

      lab.test('serializes with serialize function', function(done) {
        var serialize = function(value) {
          return value + 'foo';
        };
        var field = new Field({default: 42, serialize: serialize});
        expect(field.serialize('10')).to.equal('10foo');
        done();
      });

    });

    lab.experiment('#deserialize()', function() {

      lab.test('deserializes strings with default string', function(done) {
        var field = new Field({default: 'foo'});
        expect(field.deserialize('bar')).to.equal('bar');
        done();
      });

      lab.test('serializes numbers with default number', function(done) {
        var field = new Field({default: 42});
        expect(field.deserialize('100')).to.equal(100);
        expect(field.deserialize('0')).to.equal(0);
        done();
      });

      lab.test('deserializes date with default date', function(done) {
        var field = new Field({default: new Date()});
        expect(field).to.be.an.instanceof(Field);
        var then = '2014-06-09T23:57:12.588Z';
        var date = field.deserialize(then);
        expect(date.getTime()).to.equal(new Date(then).getTime());
        done();
      });

      lab.test('deserializes arrays with default array', function(done) {
        var field = new Field({default: [42, 'foo']});
        expect(field).to.be.an.instanceof(Field);
        var array = ['foo', 42];
        var json = JSON.stringify(array);
        expect(field.deserialize(json)).to.equal(array);
        done();
      });

      lab.test('deserializes objects with default object', function(done) {
        var field = new Field({default: {foo: 'bar'}});
        expect(field).to.be.an.instanceof(Field);
        var obj = {baz: 'bam'};
        var json = JSON.stringify(obj);
        expect(field.deserialize(json)).to.equal(obj);
        done();
      });

      lab.test('deserializes with deserialize function', function(done) {
        var deserialize = function(value) {
          return value + 'foo';
        };
        var field = new Field({default: 42, deserialize: deserialize});
        expect(field.deserialize(10)).to.equal('10foo');
        done();
      });

    });

  });

});
