var lab = exports.lab = require('lab').script();
var expect = require('code').expect;

var deserializers = require('../../lib/deserializers');

lab.experiment('deserializers', function() {

  lab.experiment('get()', function() {
    var get = deserializers.get;

    lab.test('returns a function for a known type', function(done) {
      var deserialize = get('string');
      expect(deserialize).to.be.a.function();
      done();
    });

    lab.test('throws for an unknown type', function(done) {
      var call = function() {
        get('foo');
      };
      expect(call).to.throw('Unable to deserialize type: foo');
      done();
    });

    lab.test('returns an appropriate deserializer for string', function(done) {
      var deserialize = get('string');
      expect(deserialize('foo')).to.equal('foo');
      done();
    });

    lab.test('string deserializer throws for non-string', function(done) {
      var deserialize = get('string');
      var call = function() {
        deserialize(10);
      };
      expect(call).to.throw('Expected string to deserialize: 10');
      done();
    });

    lab.test('string deserializer throws for empty string', function(done) {
      var deserialize = get('string');
      var call = function() {
        deserialize('');
      };
      expect(call).to.throw('Expected string to deserialize: ');
      done();
    });

    lab.test('returns an appropriate deserializer for number', function(done) {
      var deserialize = get('number');
      expect(deserialize('42')).to.equal(42);
      done();
    });

    lab.test('number deserializer throws for non-string', function(done) {
      var deserialize = get('number');
      var call = function() {
        deserialize([]);
      };
      expect(call).to.throw('Expected string to deserialize: ');
      done();
    });

    lab.test('number deserializer throws for empty string', function(done) {
      var deserialize = get('number');
      var call = function() {
        deserialize('');
      };
      expect(call).to.throw('Expected string to deserialize: ');
      done();
    });

    lab.test('number deserializer throws for non-numeric string', function(done) {
      var deserialize = get('number');
      var call = function() {
        deserialize('foo');
      };
      expect(call).to.throw('Expected to deserialize a number: foo');
      done();
    });

    lab.test('returns an appropriate deserializer for boolean', function(done) {
      var deserialize = get('boolean');
      expect(deserialize('1')).to.be.true();
      expect(deserialize('0')).to.be.false();
      done();
    });

    lab.test('boolean deserializer throws for non-boolean', function(done) {
      var deserialize = get('boolean');
      var call = function() {
        deserialize('foo');
      };
      expect(call).to.throw('Expected "1" or "0" for boolean: foo');
      done();
    });

    lab.test('boolean deserializer throws for empty string', function(done) {
      var deserialize = get('boolean');
      var call = function() {
        deserialize('');
      };
      expect(call).to.throw('Expected string to deserialize: ');
      done();
    });

    lab.test('returns an appropriate deserializer for date', function(done) {
      var deserialize = get('date');
      var then = '2014-06-09T23:57:12.588Z';
      var date = deserialize(then);
      expect(date).to.be.a.date();
      expect(date.getTime()).to.equal(new Date(then).getTime());
      done();
    });

    lab.test('date deserializer throws for non string', function(done) {
      var deserialize = get('date');
      var call = function() {
        deserialize(10);
      };
      expect(call).to.throw('Expected string to deserialize: 10');
      done();
    });

    lab.test('date deserializer throws for empty string', function(done) {
      var deserialize = get('date');
      var call = function() {
        deserialize('');
      };
      expect(call).to.throw('Expected string to deserialize: ');
      done();
    });

    lab.test('date deserializer throws for invalid date string', function(done) {
      var deserialize = get('date');
      var call = function() {
        deserialize('foo');
      };
      expect(call).to.throw('Expected to deserialize a date: foo');
      done();
    });

    lab.test('returns an appropriate serializer for array', function(done) {
      var deserialize = get('array');
      expect(deserialize('["bar", 100]')).to.equal(['bar', 100]);
      done();
    });

    lab.test('array deserializer throws for non string', function(done) {
      var deserialize = get('array');
      var call = function() {
        deserialize(10);
      };
      expect(call).to.throw('Expected string to deserialize: 10');
      done();
    });

    lab.test('array deserializer throws for empty string', function(done) {
      var deserialize = get('array');
      var call = function() {
        deserialize('');
      };
      expect(call).to.throw('Expected string to deserialize: ');
      done();
    });

    lab.test('array deserializer throws for invalid array string', function(done) {
      var deserialize = get('array');
      var call = function() {
        deserialize('foo');
      };
      expect(call).to.throw('Expected to deserialize an array: foo');
      done();
    });

    lab.test('returns an appropriate deserializer for object', function(done) {
      var deserialize = get('object');
      var json = '{"foo": "bar"}';
      var obj = deserialize(json);
      expect(obj).to.equal({foo: 'bar'});
      done();
    });

    lab.test('object deserializer throws for non string', function(done) {
      var deserialize = get('object');
      var call = function() {
        deserialize(10);
      };
      expect(call).to.throw('Expected string to deserialize: 10');
      done();
    });

    lab.test('object deserializer throws for empty string', function(done) {
      var deserialize = get('object');
      var call = function() {
        deserialize('');
      };
      expect(call).to.throw('Expected string to deserialize: ');
      done();
    });

    lab.test('object deserializer throws for invalid object', function(done) {
      var deserialize = get('object');
      var call = function() {
        deserialize('foo');
      };
      expect(call).to.throw('Expected to deserialize an object: foo');
      done();
    });

  });

});
