var lab = exports.lab = require('lab').script();
var expect = require('code').expect;

var Store = require('../../lib/store').Store;

var experiment = lab.experiment;
var test = lab.test;

experiment('store', function() {

  experiment('Store', function() {
    var noop = function() {};

    experiment('constructor', function() {

      test('creates a new instance', function(done) {
        var store = new Store(noop);
        expect(store).to.be.an.instanceof(Store);
        done();
      });

    });

    experiment('#register()', function() {

      test('registers a new provider', function(done) {
        var store = new Store(noop);
        store.register({foo: 'bar'}, noop);
        done();
      });

      test('returns a function used to update state', function(done) {
        var calls = [];
        var store = new Store(function(values) {
          calls.push(values);
        });
        var update = store.register({foo: 'bar'}, noop);

        expect(update).to.be.a.function();

        // accepts state object
        update({foo: 'bam'});
        expect(calls).to.have.length(1);
        expect(calls[0]).to.deep.equal({foo: 'bam'});

        // accepts key, value style
        update('foo', 'baz');
        expect(calls).to.have.length(2);
        expect(calls[1]).to.deep.equal({foo: 'baz'});

        done();
      });

    });

    experiment('#update()', function() {

      test('notifies providers of updated values', function(done) {
        var store = new Store(noop);

        var p1Calls = [];
        store.register({foo: 'foo.0', bar: 'bar.0'}, function(changes) {
          p1Calls.push(changes);
        });

        var p2Calls = [];
        store.register({bar: 'bar.1', _: 'pre'}, function(changes) {
          p2Calls.push(changes);
        });

        store.update({foo: 'foo.0a', bar: 'bar.0a', 'pre.bar': 'bar.1a'});
        expect(p1Calls).to.have.length(0);
        expect(p2Calls).to.have.length(0);

        setTimeout(function() {
          expect(p1Calls).to.have.length(1);
          expect(p1Calls[0]).to.deep.equal({foo: 'foo.0a', bar: 'bar.0a'});

          expect(p2Calls).to.have.length(1);
          expect(p2Calls[0]).to.deep.equal({bar: 'bar.1a'});
          done();
        }, 0);

      });

      test('uses defaults if string cannot be deserialized', function(done) {
        var store = new Store(noop);

        var p1Calls = [];
        store.register({number: 42}, function(changes) {
          p1Calls.push(changes);
        });

        store.update({number: 'bogus'});
        expect(p1Calls).to.have.length(0);

        setTimeout(function() {
          expect(p1Calls).to.have.length(1);
          expect(p1Calls[0]).to.deep.equal({number: 42});
          done();
        }, 0);

      });

      test('uses defaults if not enough values provided', function(done) {
        var store = new Store(noop);

        var p1Calls = [];
        store.register({number: 42}, function(changes) {
          p1Calls.push(changes);
        });

        store.update({});
        expect(p1Calls).to.have.length(0);

        setTimeout(function() {
          expect(p1Calls).to.have.length(1);
          expect(p1Calls[0]).to.deep.equal({number: 42});
          done();
        }, 0);

      });

      test('notifies providers once on multiple calls', function(done) {
        var store = new Store(noop);

        var calls = [];
        store.register({foo: 'foo.0', bar: 'bar.0'}, function(changes) {
          calls.push(changes);
        });

        store.update({foo: 'foo.1', bar: 'bar.1'});
        store.update({foo: 'foo.2', bar: 'bar.2'});
        expect(calls).to.have.length(0);

        setTimeout(function() {
          expect(calls).to.have.length(1);
          expect(calls[0]).to.deep.equal({foo: 'foo.2', bar: 'bar.2'});
          done();
        }, 0);

      });

      test('notifies providers with updated values', function(done) {
        var store = new Store(noop);

        var calls = [];
        var update = store.register(
            {foo: 'foo.0', bar: 'bar.0'},
            function(changes) {
              calls.push(changes);
            });

        update({foo: 'foo.1', bar: 'bar.1'});
        store.update({foo: 'foo.2', bar: 'bar.2'});
        expect(calls).to.have.length(0);

        setTimeout(function() {
          expect(calls).to.have.length(1);
          expect(calls[0]).to.deep.equal({foo: 'foo.2', bar: 'bar.2'});
          done();
        }, 0);

      });

      test('notification does not include unchanged values', function(done) {
        var store = new Store(noop);

        var calls = [];
        var update = store.register(
            {foo: 'foo.0', bar: 'bar.0'},
            function(changes) {
              calls.push(changes);
            });

        update({foo: 'foo.1', bar: 'bar.1'});
        store.update({foo: 'foo.2', bar: 'bar.1'});
        expect(calls).to.have.length(0);

        setTimeout(function() {
          expect(calls).to.have.length(1);
          expect(calls[0]).to.deep.equal({foo: 'foo.2'});
          done();
        }, 0);

      });

      test('no notification if no values changed', function(done) {
        var store = new Store(noop);

        var calls = [];
        var update = store.register(
            {foo: 'foo.0', bar: 'bar.0'},
            function(changes) {
              calls.push(changes);
            });

        update({foo: 'foo.1', bar: 'bar.1'});
        store.update({foo: 'foo.1', bar: 'bar.1'});
        expect(calls).to.have.length(0);

        setTimeout(function() {
          expect(calls).to.have.length(0);
          done();
        }, 0);

      });

      test('deserializes before notifying providers', function(done) {
        var store = new Store(noop);

        var p1Calls = [];
        store.register({number: 10}, function(changes) {
          p1Calls.push(changes);
        });

        var p2Calls = [];
        store.register({date: new Date(1)}, function(changes) {
          p2Calls.push(changes);
        });

        store.update({number: '42', date: new Date(2).toISOString()});

        setTimeout(function() {
          expect(p1Calls).to.have.length(1);
          expect(p1Calls[0]).to.deep.equal({number: 42});

          expect(p2Calls).to.have.length(1);
          expect(p2Calls[0]).to.deep.equal({date: new Date(2)});
          done();
        }, 0);

      });

      test('calls providers with existing values', function(done) {
        var store = new Store(noop);

        store.update({number: '42', date: new Date(2).toISOString()});

        var p1Calls = [];
        store.register({number: 10}, function(changes) {
          p1Calls.push(changes);
        });

        var p2Calls = [];
        store.register({date: new Date(1)}, function(changes) {
          p2Calls.push(changes);
        });

        expect(p1Calls).to.have.length(0);
        expect(p2Calls).to.have.length(0);

        setTimeout(function() {
          expect(p1Calls).to.have.length(1);
          expect(p1Calls[0]).to.deep.equal({number: 42});

          expect(p2Calls).to.have.length(1);
          expect(p2Calls[0]).to.deep.equal({date: new Date(2)});
          done();
        }, 0);

      });

    });

  });

});
