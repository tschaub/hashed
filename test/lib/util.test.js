var lab = exports.lab = require('lab').script();
var expect = require('code').expect;

var util = require('../../lib/util');

lab.experiment('util', function() {

  lab.experiment('typeOf()', function() {
    var typeOf = util.typeOf;

    lab.test('returns "number" for numbers', function(done) {
      expect(typeOf(42)).to.equal('number');
      expect(typeOf(0)).to.equal('number');
      done();
    });

    lab.test('returns "string" for strings', function(done) {
      expect(typeOf('foo')).to.equal('string');
      expect(typeOf('')).to.equal('string');
      done();
    });

    lab.test('returns "array" for array', function(done) {
      expect(typeOf(['foo', 'bar'])).to.equal('array');
      expect(typeOf([])).to.equal('array');
      done();
    });

    lab.test('returns "date" for date', function(done) {
      expect(typeOf(new Date())).to.equal('date');
      expect(typeOf(new Date(0))).to.equal('date');
      done();
    });

    lab.test('returns "regexp" for RegExp', function(done) {
      expect(typeOf(/foo/)).to.equal('regexp');
      expect(typeOf(new RegExp('foo'))).to.equal('regexp');
      done();
    });

    lab.test('returns "error" for Error', function(done) {
      expect(typeOf(new Error('foo'))).to.equal('error');
      expect(typeOf(new Error())).to.equal('error');
      done();
    });

    lab.test('returns "object" for object', function(done) {
      expect(typeOf({})).to.equal('object');
      done();
    });

    lab.test('returns "null" for null', function(done) {
      expect(typeOf(null)).to.equal('null');
      done();
    });

    lab.test('returns "undefined" for undefined', function(done) {
      expect(typeOf()).to.equal('undefined');
      expect(typeOf(undefined)).to.equal('undefined');
      done();
    });

  });

  lab.experiment('extend()', function() {
    var extend = util.extend;

    lab.test('copies properties from source to dest', function(done) {
      var source = {foo: 'bar'};
      var dest = {};
      extend(dest, source);
      expect(dest.foo).to.equal('bar');
      done();
    });

    lab.test('overwrites existing dest properties', function(done) {
      var source = {foo: 'bar'};
      var dest = {foo: 'bam'};
      extend(dest, source);
      expect(dest.foo).to.equal('bar');
      done();
    });

    lab.test('returns dest object', function(done) {
      var source = {foo: 'bar'};
      var dest = {foo: 'bam'};
      var got = extend(dest, source);
      expect(got).to.equal(dest);
      done();
    });

  });

  lab.experiment('zip()', function() {

    lab.test('creates an array from an object', function(done) {
      var obj = {foo: 'bar', num: 42};
      var arr = util.zip(obj);
      expect(arr).to.equal(['foo', 'bar', 'num', 42]);
      done();
    });

  });

  lab.experiment('unzip()', function() {

    lab.test('creates an object from an array', function(done) {
      var arr = ['foo', 'bar', 'num', 42];
      var obj = util.unzip(arr);
      expect(obj).to.equal({foo: 'bar', num: 42});
      done();
    });

  });

});
