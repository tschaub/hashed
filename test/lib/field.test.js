const lab = (exports.lab = require('lab').script());
const expect = require('code').expect;

const Field = require('../../lib/field').Field;

const dec = decodeURIComponent;

lab.experiment('field', () => {
  lab.experiment('Field', () => {
    lab.experiment('constructor', () => {
      lab.test('creates a field from a number', () => {
        const field = new Field(42);
        expect(field).to.be.an.instanceof(Field);
      });

      lab.test('creates a field from a string', () => {
        const field = new Field('foo');
        expect(field).to.be.an.instanceof(Field);
      });

      lab.test('creates a field from a date', () => {
        const field = new Field(new Date());
        expect(field).to.be.an.instanceof(Field);
      });

      lab.test('creates a field from an array', () => {
        const field = new Field(['foo', 'bar']);
        expect(field).to.be.an.instanceof(Field);
      });

      lab.test('creates a field from an object with default', () => {
        const field = new Field({default: 42});
        expect(field).to.be.an.instanceof(Field);
      });

      lab.test('throws for unsupported default (RegExp)', () => {
        const call = () => {
          return new Field({default: /foo/});
        };
        expect(call).to.throw('Unable to serialize type: regexp');
      });

      lab.test('throws for unsupported default (null)', () => {
        const call = () => {
          return new Field({default: null});
        };
        expect(call).to.throw('Unable to serialize type: null');
      });

      lab.test('throws for unsupported default (undefined)', () => {
        const call = () => {
          return new Field({default: undefined});
        };
        expect(call).to.throw('Unable to serialize type: undefined');
      });

      lab.test('throws for an object without default', () => {
        const call = () => {
          return new Field({foo: 'bar'});
        };
        expect(call).to.throw('Missing default');
      });
    });

    lab.experiment('#serialize()', () => {
      lab.test('serializes strings with default string', () => {
        const field = new Field({default: 'foo'});
        expect(field.serialize('bar')).to.equal('bar');
        expect(field.serialize('')).to.equal('');
      });

      lab.test('serializes numbers with default number', () => {
        const field = new Field({default: 42});
        expect(field.serialize(100)).to.equal('100');
        expect(field.serialize(0)).to.equal('0');
      });

      lab.test('serializes dates with default date', () => {
        const field = new Field({default: new Date()});
        const then = '2014-06-09T23:57:12.588Z';
        expect(dec(field.serialize(new Date(then)))).to.equal(then);
      });

      lab.test('serializes arrays with default array', () => {
        const field = new Field({default: [42, 'foo']});
        const array = ['foo', 42];
        const json = dec(field.serialize(array));
        expect(JSON.parse(json)).to.equal(array);
      });

      lab.test('serializes objects with default object', () => {
        const field = new Field({default: {foo: 'bar'}});
        const obj = {baz: 'bam'};
        const json = dec(field.serialize(obj));
        expect(JSON.parse(json)).to.equal(obj);
      });

      lab.test('serializes with serialize function', () => {
        const serialize = value => value + 'foo';
        const field = new Field({default: 42, serialize: serialize});
        expect(field.serialize('10')).to.equal('10foo');
      });
    });

    lab.experiment('#deserialize()', () => {
      lab.test('deserializes strings with default string', () => {
        const field = new Field({default: 'foo'});
        expect(field.deserialize('bar')).to.equal('bar');
      });

      lab.test('serializes numbers with default number', () => {
        const field = new Field({default: 42});
        expect(field.deserialize('100')).to.equal(100);
        expect(field.deserialize('0')).to.equal(0);
      });

      lab.test('deserializes date with default date', () => {
        const field = new Field({default: new Date()});
        expect(field).to.be.an.instanceof(Field);
        const then = '2014-06-09T23:57:12.588Z';
        const date = field.deserialize(then);
        expect(date.getTime()).to.equal(new Date(then).getTime());
      });

      lab.test('deserializes arrays with default array', () => {
        const field = new Field({default: [42, 'foo']});
        expect(field).to.be.an.instanceof(Field);
        const array = ['foo', 42];
        const json = JSON.stringify(array);
        expect(field.deserialize(json)).to.equal(array);
      });

      lab.test('deserializes objects with default object', () => {
        const field = new Field({default: {foo: 'bar'}});
        expect(field).to.be.an.instanceof(Field);
        const obj = {baz: 'bam'};
        const json = JSON.stringify(obj);
        expect(field.deserialize(json)).to.equal(obj);
      });

      lab.test('deserializes with deserialize function', () => {
        const deserialize = value => value + 'foo';
        const field = new Field({default: 42, deserialize: deserialize});
        expect(field.deserialize(10)).to.equal('10foo');
      });
    });
  });
});
