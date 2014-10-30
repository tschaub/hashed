var lab = require('lab');

var store = require('../../lib/store');

var assert = lab.assert;
var experiment = lab.experiment;
var test = lab.test;

experiment('store', function() {

  experiment('Store', function() {
    var Store = store.Store;
    var noop = function() {};

    experiment('constructor', function() {

      test('creates a new instance', function(done) {
        var store = new Store(noop);
        assert.instanceOf(store, Store);
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

        assert.isFunction(update);

        // accepts state object
        update({foo: 'bam'});
        assert.lengthOf(calls, 1);
        assert.deepEqual(calls[0], ['bam']);

        // accepts key, value style
        update('foo', 'baz');
        assert.lengthOf(calls, 2);
        assert.deepEqual(calls[1], ['baz']);

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
        store.register({bar: 'bar.1'}, function(changes) {
          p2Calls.push(changes);
        });

        store.update(['foo.0a', 'bar.0a', 'bar.1a']);
        assert.lengthOf(p1Calls, 0);
        assert.lengthOf(p2Calls, 0);

        setTimeout(function() {
          assert.lengthOf(p1Calls, 1);
          assert.deepEqual(p1Calls[0], {foo: 'foo.0a', bar: 'bar.0a'});

          assert.lengthOf(p2Calls, 1);
          assert.deepEqual(p2Calls[0], {bar: 'bar.1a'});
          done();
        }, 0);

      });

      test('uses defaults if string cannot be deserialized', function(done) {
        var store = new Store(noop);

        var p1Calls = [];
        store.register({number: 42}, function(changes) {
          p1Calls.push(changes);
        });

        store.update(['bogus']);
        assert.lengthOf(p1Calls, 0);

        setTimeout(function() {
          assert.lengthOf(p1Calls, 1);
          assert.deepEqual(p1Calls[0], {number: 42});
          done();
        }, 0);

      });

      test('uses defaults if not enough values provided', function(done) {
        var store = new Store(noop);

        var p1Calls = [];
        store.register({number: 42}, function(changes) {
          p1Calls.push(changes);
        });

        store.update([]);
        assert.lengthOf(p1Calls, 0);

        setTimeout(function() {
          assert.lengthOf(p1Calls, 1);
          assert.deepEqual(p1Calls[0], {number: 42});
          done();
        }, 0);

      });

      test('notifies providers once on multiple calls', function(done) {
        var store = new Store(noop);

        var calls = [];
        store.register({foo: 'foo.0', bar: 'bar.0'}, function(changes) {
          calls.push(changes);
        });

        store.update(['foo.1', 'bar.1']);
        store.update(['foo.2', 'bar.2']);
        assert.lengthOf(calls, 0);

        setTimeout(function() {
          assert.lengthOf(calls, 1);
          assert.deepEqual(calls[0], {foo: 'foo.2', bar: 'bar.2'});
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
        store.update(['foo.2', 'bar.2']);
        assert.lengthOf(calls, 0);

        setTimeout(function() {
          assert.lengthOf(calls, 1);
          assert.deepEqual(calls[0], {foo: 'foo.2', bar: 'bar.2'});
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
        store.update(['foo.2', 'bar.1']);
        assert.lengthOf(calls, 0);

        setTimeout(function() {
          assert.lengthOf(calls, 1);
          assert.deepEqual(calls[0], {foo: 'foo.2'});
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
        store.update(['foo.1', 'bar.1']);
        assert.lengthOf(calls, 0);

        setTimeout(function() {
          assert.lengthOf(calls, 0);
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

        store.update(['42', new Date(2).toISOString()]);

        setTimeout(function() {
          assert.lengthOf(p1Calls, 1);
          assert.deepEqual(p1Calls[0], {number: 42});

          assert.lengthOf(p2Calls, 1);
          assert.deepEqual(p2Calls[0], {date: new Date(2)});
          done();
        }, 0);

      });

      test('calls providers with existing values', function(done) {
        var store = new Store(noop);

        store.update(['42', new Date(2).toISOString()]);

        var p1Calls = [];
        store.register({number: 10}, function(changes) {
          p1Calls.push(changes);
        });

        var p2Calls = [];
        store.register({date: new Date(1)}, function(changes) {
          p2Calls.push(changes);
        });

        assert.lengthOf(p1Calls, 0);
        assert.lengthOf(p2Calls, 0);

        setTimeout(function() {
          assert.lengthOf(p1Calls, 1);
          assert.deepEqual(p1Calls[0], {number: 42});

          assert.lengthOf(p2Calls, 1);
          assert.deepEqual(p2Calls[0], {date: new Date(2)});
          done();
        }, 0);

      });

    });

  });

});
