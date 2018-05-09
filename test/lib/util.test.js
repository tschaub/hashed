const lab = (exports.lab = require('lab').script());
const expect = require('code').expect;

const util = require('../../lib/util');

lab.experiment('util', () => {
  lab.experiment('typeOf()', () => {
    const typeOf = util.typeOf;

    lab.test('returns "number" for numbers', () => {
      expect(typeOf(42)).to.equal('number');
      expect(typeOf(0)).to.equal('number');
    });

    lab.test('returns "string" for strings', () => {
      expect(typeOf('foo')).to.equal('string');
      expect(typeOf('')).to.equal('string');
    });

    lab.test('returns "array" for array', () => {
      expect(typeOf(['foo', 'bar'])).to.equal('array');
      expect(typeOf([])).to.equal('array');
    });

    lab.test('returns "date" for date', () => {
      expect(typeOf(new Date())).to.equal('date');
      expect(typeOf(new Date(0))).to.equal('date');
    });

    lab.test('returns "regexp" for RegExp', () => {
      expect(typeOf(/foo/)).to.equal('regexp');
      expect(typeOf(new RegExp('foo'))).to.equal('regexp');
    });

    lab.test('returns "error" for Error', () => {
      expect(typeOf(new Error('foo'))).to.equal('error');
      expect(typeOf(new Error())).to.equal('error');
    });

    lab.test('returns "object" for object', () => {
      expect(typeOf({})).to.equal('object');
    });

    lab.test('returns "null" for null', () => {
      expect(typeOf(null)).to.equal('null');
    });

    lab.test('returns "undefined" for undefined', () => {
      expect(typeOf()).to.equal('undefined');
      expect(typeOf(undefined)).to.equal('undefined');
    });
  });

  lab.experiment('extend()', () => {
    const extend = util.extend;

    lab.test('copies properties from source to dest', () => {
      const source = {foo: 'bar'};
      const dest = {};
      extend(dest, source);
      expect(dest.foo).to.equal('bar');
    });

    lab.test('overwrites existing dest properties', () => {
      const source = {foo: 'bar'};
      const dest = {foo: 'bam'};
      extend(dest, source);
      expect(dest.foo).to.equal('bar');
    });

    lab.test('returns dest object', () => {
      const source = {foo: 'bar'};
      const dest = {foo: 'bam'};
      const got = extend(dest, source);
      expect(got).to.equal(dest);
    });
  });

  lab.experiment('zip()', () => {
    lab.test('creates an array from an object', () => {
      const obj = {foo: 'bar', num: 42};
      const arr = util.zip(obj);
      expect(arr).to.equal(['foo', 'bar', 'num', 42]);
    });
  });

  lab.experiment('unzip()', () => {
    lab.test('creates an object from an array', () => {
      const arr = ['foo', 'bar', 'num', 42];
      const obj = util.unzip(arr);
      expect(obj).to.equal({foo: 'bar', num: 42});
    });
  });
});
