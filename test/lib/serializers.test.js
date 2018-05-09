const lab = (exports.lab = require('lab').script());
const expect = require('code').expect;

const serializers = require('../../lib/serializers');

const enc = encodeURIComponent;
const dec = decodeURIComponent;

lab.experiment('serializers', () => {
  lab.experiment('get()', () => {
    const get = serializers.get;

    lab.test('returns a function for a known type', () => {
      const serialize = get('string');
      expect(serialize).to.be.a.function();
    });

    lab.test('throws for an unknown type', () => {
      const call = () => {
        get('foo');
      };
      expect(call).to.throw('Unable to serialize type: foo');
    });

    lab.test('returns an appropriate serializer for string', () => {
      const serialize = get('string');
      expect(serialize('foo')).to.equal('foo');
    });

    lab.test('string serializer throws for non-string', () => {
      const serialize = get('string');
      const call = () => {
        serialize(42);
      };
      expect(call).to.throw('Expected string to serialize: 42');
    });

    lab.test('returns an appropriate serializer for number', () => {
      const serialize = get('number');
      expect(serialize(42)).to.equal('42');
    });

    lab.test('number serializer throws for non-number', () => {
      const serialize = get('number');
      const call = () => {
        serialize('foo');
      };
      expect(call).to.throw('Expected number to serialize: foo');
    });

    lab.test('returns an appropriate serializer for boolean', () => {
      const serialize = get('boolean');
      expect(serialize(true)).to.equal('1');
      expect(serialize(false)).to.equal('0');
    });

    lab.test('boolean serializer throws for non-boolean', () => {
      const serialize = get('boolean');
      const call = () => {
        serialize('foo');
      };
      expect(call).to.throw('Expected boolean to serialize: foo');
    });

    lab.test('returns an appropriate serializer for date', () => {
      const serialize = get('date');
      const then = '2014-06-09T23:57:12.588Z';
      const date = new Date(then);
      expect(dec(serialize(date))).to.equal(then);
    });

    lab.test('date serializer throws for non-date', () => {
      const serialize = get('date');
      const call = () => {
        serialize('foo');
      };
      expect(call).to.throw('Expected date to serialize: foo');
    });

    lab.test('returns an appropriate serializer for array', () => {
      const serialize = get('array');
      const array = ['foo', 42];
      const json = JSON.stringify(array);
      expect(serialize(array)).to.equal(enc(json));
    });

    lab.test('array serializer throws for non-array', () => {
      const serialize = get('array');
      const call = () => {
        serialize('foo');
      };
      expect(call).to.throw('Expected array to serialize: foo');
    });

    lab.test('returns an appropriate serializer for object', () => {
      const serialize = get('object');
      const obj = {foo: 'bar'};
      const json = dec(serialize(obj));
      expect(obj).to.equal(JSON.parse(json));
    });
  });
});
