const lab = (exports.lab = require('lab').script());
const expect = require('code').expect;

const Schema = require('../../lib/schema').Schema;

const dec = decodeURIComponent;

lab.experiment('schema', () => {
  lab.experiment('Schema', () => {
    lab.experiment('constructor', () => {
      lab.test('creates a new instance', () => {
        const schema = new Schema({foo: 'bar'});
        expect(schema).to.be.an.instanceof(Schema);
      });
    });

    lab.experiment('#serialize()', () => {
      lab.test('serializes values', () => {
        const schema = new Schema({aNumber: 10, anArray: ['one', 'two']});
        expect(schema.serialize('aNumber', 42)).to.equal('42');
        const json = dec(schema.serialize('anArray', [2, 3]));
        expect(JSON.parse(json)).to.equal([2, 3]);
      });

      lab.test('works with unprefixed keys', () => {
        const schema = new Schema({number: 10, _: 'pre'});
        expect(schema.serialize('number', 42)).to.equal('42');
      });

      lab.test('calls custom serializer', () => {
        const calls = [];
        const schema = new Schema({
          custom: {
            default: 10,
            serialize: (value, s) => {
              calls.push([value, s]);
              return String(value);
            }
          }
        });

        const state = {};
        expect(schema.serialize('custom', 42, state)).to.equal('42');
        expect(calls.length).to.equal(1);
        expect(calls[0][0]).to.equal(42);
        expect(calls[0][1]).to.equal(state);
      });

      lab.test('throws for type mismatch', () => {
        const schema = new Schema({aNumber: 10});
        const call = () => {
          schema.serialize('aNumber', 'asdf');
        };
        expect(call).to.throw('Expected number to serialize: asdf');
      });

      lab.test('throws for unknown key', () => {
        const schema = new Schema({aNumber: 10});
        const call = () => {
          schema.serialize('foo', 'asdf');
        };
        expect(call).to.throw('Unknown key: foo');
      });
    });

    lab.experiment('#deserialize()', () => {
      lab.test('deserializes values', () => {
        const schema = new Schema({aNumber: 10, anArray: ['one', 'two']});
        expect(schema.deserialize('aNumber', '42')).to.equal(42);
        const json = '[2, 3]';
        expect(schema.deserialize('anArray', json)).to.equal([2, 3]);
      });

      lab.test('throws for type mismatch', () => {
        const schema = new Schema({aNumber: 10});
        const call = () => {
          schema.deserialize('aNumber', 'asdf');
        };
        expect(call).to.throw('Expected to deserialize a number: asdf');
      });

      lab.test('throws for unknown key', () => {
        const schema = new Schema({aNumber: 10});
        const call = () => {
          schema.deserialize('foo', 'asdf');
        };
        expect(call).to.throw('Unknown key: foo');
      });
    });

    lab.experiment('#getDefault()', () => {
      lab.test('gets the default for a key', () => {
        const schema = new Schema({foo: 'bar'});
        expect(schema.getDefault('foo')).to.equal('bar');
      });

      lab.test('gets the default value given an object with default', () => {
        const schema = new Schema({foo: {default: 'bar'}});
        expect(schema.getDefault('foo')).to.equal('bar');
      });

      lab.test('throws for unknown key', () => {
        const schema = new Schema({foo: 'bar'});
        const call = () => {
          schema.getDefault('asdf');
        };
        expect(call).to.throw('Unknown key: asdf');
      });
    });

    lab.experiment('#getPrefixed()', () => {
      lab.test('prepends the prefix', () => {
        const schema = new Schema({
          aNumber: 10,
          anArray: ['one', 'two'],
          _: 'customPrefix'
        });

        expect(schema.getPrefixed('aNumber')).to.equal('customPrefix.aNumber');
        expect(schema.getPrefixed('anArray')).to.equal('customPrefix.anArray');
      });

      lab.test('works without a prefix', () => {
        const schema = new Schema({
          aNumber: 10,
          anArray: ['one', 'two']
        });

        expect(schema.getPrefixed('aNumber')).to.equal('aNumber');
        expect(schema.getPrefixed('anArray')).to.equal('anArray');
      });
    });

    lab.experiment('#conflicts()', () => {
      lab.test('two unprefixed conflict-free schemas', () => {
        const first = new Schema({
          foo: 'bar',
          number: 42
        });

        const second = new Schema({
          bam: 'baz',
          digit: 42
        });

        expect(first.conflicts(second)).to.be.false();
        expect(second.conflicts(first)).to.be.false();
      });

      lab.test('two unprefixed conflicting schemas', () => {
        const first = new Schema({
          foo: 'bar',
          number: 42
        });

        const second = new Schema({
          foo: 'bam',
          digit: 42
        });

        expect(first.conflicts(second)).to.equal('foo');
        expect(second.conflicts(first)).to.equal('foo');
      });

      lab.test('one unprefixed, one prefixed, no conflicts', () => {
        const first = new Schema({
          foo: 'bar',
          number: 42
        });

        const second = new Schema({
          foo: 'bam',
          number: 42,
          _: 'second'
        });

        expect(first.conflicts(second)).to.be.false();
        expect(second.conflicts(first)).to.be.false();
      });

      lab.test('two prefixed, no conflicts', () => {
        const first = new Schema({
          foo: 'bar',
          number: 42,
          _: 'first'
        });

        const second = new Schema({
          foo: 'bam',
          number: 42,
          _: 'second'
        });

        expect(first.conflicts(second)).to.be.false();
        expect(second.conflicts(first)).to.be.false();
      });

      lab.test('same prefix, no conflicts', () => {
        const first = new Schema({
          number: 42,
          _: 'same'
        });

        const second = new Schema({
          foo: 'bam',
          _: 'same'
        });

        expect(first.conflicts(second)).to.be.false();
        expect(second.conflicts(first)).to.be.false();
      });

      lab.test('same prefix, with conflicts', () => {
        const first = new Schema({
          number: 42,
          _: 'same'
        });

        const second = new Schema({
          number: 10,
          _: 'same'
        });

        expect(first.conflicts(second)).to.equal('same.number');
        expect(second.conflicts(first)).to.equal('same.number');
      });
    });
  });
});
