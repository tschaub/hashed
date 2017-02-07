var lab = exports.lab = require('lab').script();
var expect = require('code').expect;

var hash = require('../../lib/hash');

lab.experiment('hash', function() {

  lab.experiment('deserialize()', function() {

    lab.test('returns values from the hash', function(done) {
      var loc = {
        hash: '#/foo/bar/num/42'
      };

      var values = hash.deserialize(loc.hash);
      expect(values).to.equal({
        foo: 'bar',
        num: '42'
      });
      done();
    });

    lab.test('returns an empty object for no hash', function(done) {
      var loc = {
        hash: ''
      };

      var values = hash.deserialize(loc.hash);
      expect(Object.keys(values)).to.have.length(0);
      done();
    });

  });

  lab.experiment('serialize()', function() {

    lab.test('returns a string for the hash', function(done) {
      var str = hash.serialize({foo: 'bar'});
      expect(str).to.equal('#/foo/bar');
      done();
    });

    lab.test('returns # for an empty object', function(done) {
      var str = hash.serialize({});
      expect(str).to.equal('#');
      done();
    });

  });

});
