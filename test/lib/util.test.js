var lab = require('lab');

var util = require('../../lib/util');

var assert = lab.assert;
var experiment = lab.experiment;
var test = lab.test;

experiment('util', function() {

  experiment('typeOf()', function() {
    var typeOf = util.typeOf;

    test('returns "number" for numbers', function(done) {
      assert.equal('number', typeOf(42));
      assert.equal('number', typeOf(0));
      done();
    });

    test('returns "string" for strings', function(done) {
      assert.equal('string', typeOf('foo'));
      assert.equal('string', typeOf(''));
      done();
    });

    test('returns "array" for array', function(done) {
      assert.equal('array', typeOf(['foo', 'bar']));
      assert.equal('array', typeOf([]));
      done();
    });

    test('returns "date" for date', function(done) {
      assert.equal('date', typeOf(new Date()));
      assert.equal('date', typeOf(new Date(0)));
      done();
    });

    test('returns "regexp" for RegExp', function(done) {
      assert.equal('regexp', typeOf(/foo/));
      assert.equal('regexp', typeOf(new RegExp('foo')));
      done();
    });

    test('returns "error" for Error', function(done) {
      assert.equal('error', typeOf(new Error('foo')));
      assert.equal('error', typeOf(new Error()));
      done();
    });

    test('returns "object" for object', function(done) {
      assert.equal('object', typeOf({}));
      done();
    });

    test('returns "null" for null', function(done) {
      assert.equal('null', typeOf(null));
      done();
    });

    test('returns "undefined" for undefined', function(done) {
      assert.equal('undefined', typeOf());
      assert.equal('undefined', typeOf(undefined));
      done();
    });

  });

  experiment('extend()', function() {
    var extend = util.extend;

    test('copies properties from source to dest', function(done) {
      var source = {foo: 'bar'};
      var dest = {};
      extend(dest, source);
      assert.equal(dest.foo, 'bar');
      done();
    });

    test('overwrites existing dest properties', function(done) {
      var source = {foo: 'bar'};
      var dest = {foo: 'bam'};
      extend(dest, source);
      assert.equal(dest.foo, 'bar');
      done();
    });

    test('returns dest object', function(done) {
      var source = {foo: 'bar'};
      var dest = {foo: 'bam'};
      var got = extend(dest, source);
      assert.equal(got, dest);
      done();
    });

  });

});
