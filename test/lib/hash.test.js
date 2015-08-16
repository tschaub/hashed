var lab = exports.lab = require('lab').script();
var expect = require('code').expect;

var Store = require('../../lib/store').Store;
var hash = require('../../lib/hash');

lab.experiment('hash', function() {

  lab.afterEach(function(done) {
    hash.reset();
    done();
  });

  lab.experiment('updateHash()', function() {

    lab.test('serializes values for the hash', function(done) {
      var values = {
        foo: 'bar',
        num: '42'
      };
      var loc = {};
      hash.updateHash(values, loc);
      expect(loc.hash).to.equal('#/foo/bar/num/42');
      done();
    });

    lab.test('does nothing for an empty object', function(done) {
      var values = {};
      var loc = {};
      hash.updateHash(values, loc);
      expect(loc.hash).to.be.undefined();
      done();
    });

  });

  lab.experiment('updateStore()', function() {
    var noop = function() {};

    lab.test('calls store.update() with values from the hash', function(done) {
      var log = [];
      var store = new Store(noop);
      store.update = function() {
        log.push(arguments);
      };

      var loc = {
        hash: '#/foo/bar/num/42'
      };

      hash.updateStore(loc, store);
      expect(log).to.have.length(1);
      var args = log[0];
      expect(args).to.have.length(1);
      expect(args[0]).to.deep.equal({
        foo: 'bar',
        num: '42'
      });
      done();
    });

    lab.test('calls update with an empty object for no hash', function(done) {
      var log = [];
      var store = new Store(noop);
      store.update = function() {
        log.push(arguments);
      };

      var loc = {
        hash: ''
      };

      hash.updateStore(loc, store);
      expect(log).to.have.length(1);
      var args = log[0];
      expect(args).to.have.length(1);
      expect(Object.keys(args[0])).to.have.length(0);
      done();
    });

    lab.test('does not call store.update() for values from updateHash()', function(done) {
      var log = [];
      var store = new Store(noop);
      store.update = function() {
        log.push(arguments);
      };

      var loc = {};

      hash.updateHash({foo: 'bar'}, loc);
      hash.updateStore(loc, store);

      expect(log).to.have.length(0);
      done();
    });

    lab.test('only calls store.update() for externally changed values', function(done) {
      var log = [];
      var store = new Store(noop);
      store.update = function() {
        log.push(arguments);
      };


      hash.updateHash({foo: 'bar'}, {});
      hash.updateHash({num: 42}, {});

      hash.updateStore({hash: '#/foo/bar'}, store);
      expect(log).to.have.length(0);

      hash.updateStore({hash: '#/num/42'}, store);
      expect(log).to.have.length(0);

      hash.updateStore({hash: '#/baz/bam'}, store);
      expect(log).to.have.length(1);
      expect(log[0][0]).to.deep.equal({baz: 'bam'});
      done();
    });

  });

});
