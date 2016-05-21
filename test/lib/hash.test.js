var lab = exports.lab = require('lab').script();
var expect = require('code').expect;

var hash = require('../../lib/hash');

lab.experiment('hash', function() {

  lab.experiment('set()', function() {

    lab.test('serializes values for the hash', function(done) {
      var values = {
        foo: 'bar',
        num: '42'
      };
      var loc = {};
      hash.set(values, loc);
      expect(loc.hash).to.equal('#/foo/bar/num/42');
      done();
    });

    lab.test('does nothing for an empty object', function(done) {
      var values = {};
      var loc = {};
      hash.set(values, loc);
      expect(loc.hash).to.equal('');
      done();
    });

  });

  lab.experiment('get()', function() {

    lab.test('returns values from the hash', function(done) {
      var loc = {
        hash: '#/foo/bar/num/42'
      };

      var values = hash.get(loc);
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

      var values = hash.get(loc);
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

  });

});
