const lab = (exports.lab = require('lab').script());
const expect = require('code').expect;

const deserializers = require('../../lib/deserializers');

lab.experiment('deserializers', () => {
  lab.experiment('get()', () => {
    const get = deserializers.get;

    lab.test('returns a function for a known type', () => {
      const deserialize = get('string');
      expect(deserialize).to.be.a.function();
    });

    lab.test('throws for an unknown type', () => {
      const call = () => {
        get('foo');
      };
      expect(call).to.throw('Unable to deserialize type: foo');
    });

    lab.test('returns an appropriate deserializer for string', () => {
      const deserialize = get('string');
      expect(deserialize('foo')).to.equal('foo');
    });

    lab.test('string deserializer throws for non-string', () => {
      const deserialize = get('string');
      const call = () => {
        deserialize(10);
      };
      expect(call).to.throw('Expected string to deserialize: 10');
    });

    lab.test('string deserializer throws for empty string', () => {
      const deserialize = get('string');
      const call = () => {
        deserialize('');
      };
      expect(call).to.throw('Expected string to deserialize: ');
    });

    lab.test('returns an appropriate deserializer for number', () => {
      const deserialize = get('number');
      expect(deserialize('42')).to.equal(42);
    });

    lab.test('number deserializer throws for non-string', () => {
      const deserialize = get('number');
      const call = () => {
        deserialize([]);
      };
      expect(call).to.throw('Expected string to deserialize: ');
    });

    lab.test('number deserializer throws for empty string', () => {
      const deserialize = get('number');
      const call = () => {
        deserialize('');
      };
      expect(call).to.throw('Expected string to deserialize: ');
    });

    lab.test('number deserializer throws for non-numeric string', () => {
      const deserialize = get('number');
      const call = () => {
        deserialize('foo');
      };
      expect(call).to.throw('Expected to deserialize a number: foo');
    });

    lab.test('returns an appropriate deserializer for boolean', () => {
      const deserialize = get('boolean');
      expect(deserialize('1')).to.be.true();
      expect(deserialize('0')).to.be.false();
    });

    lab.test('boolean deserializer throws for non-boolean', () => {
      const deserialize = get('boolean');
      const call = () => {
        deserialize('foo');
      };
      expect(call).to.throw('Expected "1" or "0" for boolean: foo');
    });

    lab.test('boolean deserializer throws for empty string', () => {
      const deserialize = get('boolean');
      const call = () => {
        deserialize('');
      };
      expect(call).to.throw('Expected string to deserialize: ');
    });

    lab.test('returns an appropriate deserializer for date', () => {
      const deserialize = get('date');
      const then = '2014-06-09T23:57:12.588Z';
      const date = deserialize(then);
      expect(date).to.be.a.date();
      expect(date.getTime()).to.equal(new Date(then).getTime());
    });

    lab.test('date deserializer throws for non string', () => {
      const deserialize = get('date');
      const call = () => {
        deserialize(10);
      };
      expect(call).to.throw('Expected string to deserialize: 10');
    });

    lab.test('date deserializer throws for empty string', () => {
      const deserialize = get('date');
      const call = () => {
        deserialize('');
      };
      expect(call).to.throw('Expected string to deserialize: ');
    });

    lab.test('date deserializer throws for invalid date string', () => {
      const deserialize = get('date');
      const call = () => {
        deserialize('foo');
      };
      expect(call).to.throw('Expected to deserialize a date: foo');
    });

    lab.test('returns an appropriate serializer for array', () => {
      const deserialize = get('array');
      expect(deserialize('["bar", 100]')).to.equal(['bar', 100]);
    });

    lab.test('array deserializer throws for non string', () => {
      const deserialize = get('array');
      const call = () => {
        deserialize(10);
      };
      expect(call).to.throw('Expected string to deserialize: 10');
    });

    lab.test('array deserializer throws for empty string', () => {
      const deserialize = get('array');
      const call = () => {
        deserialize('');
      };
      expect(call).to.throw('Expected string to deserialize: ');
    });

    lab.test('array deserializer throws for invalid array string', () => {
      const deserialize = get('array');
      const call = () => {
        deserialize('foo');
      };
      expect(call).to.throw('Expected to deserialize an array: foo');
    });

    lab.test('returns an appropriate deserializer for object', () => {
      const deserialize = get('object');
      const json = '{"foo": "bar"}';
      const obj = deserialize(json);
      expect(obj).to.equal({foo: 'bar'});
    });

    lab.test('object deserializer throws for non string', () => {
      const deserialize = get('object');
      const call = () => {
        deserialize(10);
      };
      expect(call).to.throw('Expected string to deserialize: 10');
    });

    lab.test('object deserializer throws for empty string', () => {
      const deserialize = get('object');
      const call = () => {
        deserialize('');
      };
      expect(call).to.throw('Expected string to deserialize: ');
    });

    lab.test('object deserializer throws for invalid object', () => {
      const deserialize = get('object');
      const call = () => {
        deserialize('foo');
      };
      expect(call).to.throw('Expected to deserialize an object: foo');
    });
  });
});
