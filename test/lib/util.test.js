var lab = exports.lab = require('lab').script();
var expect = require('code').expect;

var util = require('../../lib/util');

var experiment = lab.experiment;
var test = lab.test;

experiment('util', function() {

  experiment('typeOf()', function() {
    var typeOf = util.typeOf;

    test('returns "number" for numbers', function(done) {
      expect(typeOf(42)).to.equal('number');
      expect(typeOf(0)).to.equal('number');
      done();
    });

    test('returns "string" for strings', function(done) {
      expect(typeOf('foo')).to.equal('string');
      expect(typeOf('')).to.equal('string');
      done();
    });

    test('returns "array" for array', function(done) {
      expect(typeOf(['foo', 'bar'])).to.equal('array');
      expect(typeOf([])).to.equal('array');
      done();
    });

    test('returns "date" for date', function(done) {
      expect(typeOf(new Date())).to.equal('date');
      expect(typeOf(new Date(0))).to.equal('date');
      done();
    });

    test('returns "regexp" for RegExp', function(done) {
      expect(typeOf(/foo/)).to.equal('regexp');
      expect(typeOf(new RegExp('foo'))).to.equal('regexp');
      done();
    });

    test('returns "error" for Error', function(done) {
      expect(typeOf(new Error('foo'))).to.equal('error');
      expect(typeOf(new Error())).to.equal('error');
      done();
    });

    test('returns "object" for object', function(done) {
      expect(typeOf({})).to.equal('object');
      done();
    });

    test('returns "null" for null', function(done) {
      expect(typeOf(null)).to.equal('null');
      done();
    });

    test('returns "undefined" for undefined', function(done) {
      expect(typeOf()).to.equal('undefined');
      expect(typeOf(undefined)).to.equal('undefined');
      done();
    });

  });

  experiment('extend()', function() {
    var extend = util.extend;

    test('copies properties from source to dest', function(done) {
      var source = {foo: 'bar'};
      var dest = {};
      extend(dest, source);
      expect(dest.foo).to.equal('bar');
      done();
    });

    test('overwrites existing dest properties', function(done) {
      var source = {foo: 'bar'};
      var dest = {foo: 'bam'};
      extend(dest, source);
      expect(dest.foo).to.equal('bar');
      done();
    });

    test('returns dest object', function(done) {
      var source = {foo: 'bar'};
      var dest = {foo: 'bam'};
      var got = extend(dest, source);
      expect(got).to.equal(dest);
      done();
    });

  });

  experiment('zip()', function() {

    test('creates an array from an object', function(done) {
      var obj = {foo: 'bar', num: 42};
      var arr = util.zip(obj);
      expect(arr).to.deep.equal(['foo', 'bar', 'num', 42]);
      done();
    });

  });

  experiment('unzip()', function() {

    test('creates an object from an array', function(done) {
      var arr = ['foo', 'bar', 'num', 42];
      var obj = util.unzip(arr);
      expect(obj).to.deep.equal({foo: 'bar', num: 42});
      done();
    });

  });

});
