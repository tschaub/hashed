const lab = (exports.lab = require('lab').script());
const expect = require('code').expect;

const hash = require('../../lib/hash');

lab.experiment('hash', () => {
  lab.experiment('deserialize()', () => {
    lab.test('returns values from the hash', () => {
      const loc = {
        hash: '#/foo/bar/num/42'
      };

      const values = hash.deserialize(loc.hash);
      expect(values).to.equal({
        foo: 'bar',
        num: '42'
      });
    });

    lab.test('returns an empty object for no hash', () => {
      const loc = {
        hash: ''
      };

      const values = hash.deserialize(loc.hash);
      expect(Object.keys(values)).to.have.length(0);
    });
  });

  lab.experiment('serialize()', () => {
    lab.test('returns a string for the hash', () => {
      const str = hash.serialize({foo: 'bar'});
      expect(str).to.equal('#/foo/bar');
    });

    lab.test('returns # for an empty object', () => {
      const str = hash.serialize({});
      expect(str).to.equal('#');
    });
  });
});
