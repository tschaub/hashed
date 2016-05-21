var lab = exports.lab = require('lab').script();
var expect = require('code').expect;

var serializers = require('../../lib/serializers');

var enc = encodeURIComponent;
var dec = decodeURIComponent;

lab.experiment('serializers', function() {

  lab.experiment('get()', function() {
    var get = serializers.get;

    lab.test('returns a function for a known type', function(done) {
      var serialize = get('string');
      expect(serialize).to.be.a.function();
      done();
    });

    lab.test('throws for an unknown type', function(done) {
      var call = function() {
        get('foo');
      };
      expect(call).to.throw('Unable to serialize type: foo');
      done();
    });

    lab.test('returns an appropriate serializer for string', function(done) {
      var serialize = get('string');
      expect(serialize('foo')).to.equal('foo');
      done();
    });

    lab.test('string serializer throws for non-string', function(done) {
      var serialize = get('string');
      var call = function() {
        serialize(42);
      };
      expect(call).to.throw('Expected string to serialize: 42');
      done();
    });

    lab.test('returns an appropriate serializer for number', function(done) {
      var serialize = get('number');
      expect(serialize(42)).to.equal('42');
      done();
    });

    lab.test('number serializer throws for non-number', function(done) {
      var serialize = get('number');
      var call = function() {
        serialize('foo');
      };
      expect(call).to.throw('Expected number to serialize: foo');
      done();
    });

    lab.test('returns an appropriate serializer for boolean', function(done) {
      var serialize = get('boolean');
      expect(serialize(true)).to.equal('1');
      expect(serialize(false)).to.equal('0');
      done();
    });

    lab.test('boolean serializer throws for non-boolean', function(done) {
      var serialize = get('boolean');
      var call = function() {
        serialize('foo');
      };
      expect(call).to.throw('Expected boolean to serialize: foo');
      done();
    });

    lab.test('returns an appropriate serializer for date', function(done) {
      var serialize = get('date');
      var then = '2014-06-09T23:57:12.588Z';
      var date = new Date(then);
      expect(dec(serialize(date))).to.equal(then);
      done();
    });

    lab.test('date serializer throws for non-date', function(done) {
      var serialize = get('date');
      var call = function() {
        serialize('foo');
      };
      expect(call).to.throw('Expected date to serialize: foo');
      done();
    });

    lab.test('returns an appropriate serializer for array', function(done) {
      var serialize = get('array');
      var array = ['foo', 42];
      var json = JSON.stringify(array);
      expect(serialize(array)).to.equal(enc(json));
      done();
    });

    lab.test('array serializer throws for non-array', function(done) {
      var serialize = get('array');
      var call = function() {
        serialize('foo');
      };
      expect(call).to.throw('Expected array to serialize: foo');
      done();
    });

    lab.test('returns an appropriate serializer for object', function(done) {
      var serialize = get('object');
      var obj = {foo: 'bar'};
      var json = dec(serialize(obj));
      expect(obj).to.equal(JSON.parse(json));
      done();
    });

  });

});
