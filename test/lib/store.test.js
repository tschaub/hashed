var lab = exports.lab = require('lab').script();
var expect = require('code').expect;

var Store = require('../../lib/store').Store;

lab.experiment('store', function() {

  lab.experiment('Store', function() {
    var noop = function() {};

    lab.experiment('constructor', function() {

      lab.test('creates a new instance', function(done) {
        var store = new Store({}, noop);
        expect(store).to.be.an.instanceof(Store);
        done();
      });

      lab.test('accepts initial values', function(done) {
        var calls = [];
        var store = new Store({foo: 'bar', num: '42'}, function(values, defaults) {
          calls.push({values: values, defaults: defaults});
        });
        var update = store.register({num: 43}, noop);
        update({num: 44});
        expect(calls).to.have.length(0);
        setTimeout(function() {
          expect(calls).to.have.length(1);
          expect(calls[0]).to.equal({
            values: {foo: 'bar', num: '44'},
            defaults: {num: '43'}
          });
          done();
        }, 5);
      });

    });

    lab.experiment('#update()', function() {

      lab.test('updates store values and calls provider callbacks', function(done) {
        var store = new Store({}, noop);
        var log = [];
        store.register({foo: 'bar'}, function(values) {
          log.push(values);
        });
        expect(log).to.equal([{foo: 'bar'}]);
        log.length = 0;

        store.update({foo: 'bam'});
        setTimeout(function() {
          expect(log).to.equal([{foo: 'bam'}]);
          done();
        }, 5);
      });

      lab.test('calls callback once for multiple synchronous updates', function(done) {
        var store = new Store({}, noop);
        var log = [];
        store.register({foo: 'bar', num: 42}, function(values) {
          log.push(values);
        });
        expect(log).to.equal([{foo: 'bar', num: 42}]);
        log.length = 0;

        store.update({foo: 'bam', num: '21'});
        store.update({foo: 'baz', num: '63'});

        setTimeout(function() {
          expect(log).to.equal([{foo: 'baz', num: 63}]);
          done();
        }, 5);
      });

      lab.test('only calls callback with updated values', function(done) {
        var store = new Store({}, noop);
        var log = [];
        store.register({foo: 'bar', num: 42}, function(values) {
          log.push(values);
        });
        expect(log).to.equal([{foo: 'bar', num: 42}]);
        log.length = 0;

        store.update({num: '63', foo: 'bar'});

        setTimeout(function() {
          expect(log).to.equal([{num: 63}]);
          done();
        }, 5);
      });

      lab.test('calls callback with defaults when updated values are absent', function(done) {
        var store = new Store({foo: 'non-default', bar: 42}, noop);
        var log = [];
        store.register({foo: 'bar', num: 42}, function(values) {
          log.push(values);
        });
        expect(log).to.equal([{foo: 'non-default', num: 42}]);
        log.length = 0;

        store.update({num: '63'});

        setTimeout(function() {
          expect(log).to.equal([{foo: 'bar', num: 63}]);
          done();
        }, 5);
      });

      lab.test('last update wins', function(done) {
        var store = new Store({}, noop);
        var log = [];
        store.register({foo: 'bar', num: 42}, function(values) {
          log.push(values);
        });
        expect(log).to.equal([{foo: 'bar', num: 42}]);
        log.length = 0;

        store.update({num: '63'});
        store.update({foo: 'bam'});

        setTimeout(function() {
          expect(log).to.equal([{foo: 'bam'}]);
          done();
        }, 5);
      });

      lab.test('does not call callback if values do not change', function(done) {
        var store = new Store({}, noop);
        var log = [];
        store.register({foo: 'bar', num: 42}, function(values) {
          log.push(values);
        });
        expect(log).to.equal([{foo: 'bar', num: 42}]);
        log.length = 0;

        store.update({num: '42'});
        store.update({foo: 'bar'});

        setTimeout(function() {
          expect(log).to.have.length(0);
          done();
        }, 5);
      });

      lab.test('does not call callback for garbage updates', function(done) {
        var store = new Store({}, noop);
        var log = [];
        store.register({foo: 'bar', num: 42}, function(values) {
          log.push(values);
        });
        expect(log).to.equal([{foo: 'bar', num: 42}]);
        log.length = 0;

        store.update({num: 'garbage'});

        setTimeout(function() {
          expect(log).to.have.length(0);
          done();
        }, 5);
      });

      lab.test('calls callback with valid values if some of the values are garbage', function(done) {
        var store = new Store({}, noop);
        var log = [];
        store.register({foo: 'bar', num: 42}, function(values) {
          log.push(values);
        });
        expect(log).to.equal([{foo: 'bar', num: 42}]);
        log.length = 0;

        store.update({num: 'garbage', foo: 'bam'});

        setTimeout(function() {
          expect(log).to.equal([{foo: 'bam'}]);
          done();
        }, 5);
      });

      lab.test('calls most recently registered provider first', function(done) {
        var store = new Store({}, noop);
        var log = [];
        store.register({foo: 'bar'}, function(values) {
          log.push('first');
        });
        store.register({num: 42}, function(values) {
          log.push('second');
        });
        log.length = 0;

        store.update({num: '43', foo: 'bam'});

        setTimeout(function() {
          expect(log).to.equal(['second', 'first']);
          done();
        }, 5);
      });

      lab.test('works if callbacks unregister providers', function(done) {
        var store = new Store({}, noop);
        var log = [];

        var unregister = false;
        function first() {
          log.push('first');
        }
        function second() {
          log.push('second');
          if (unregister) {
            store.unregister(first);
          }
        }
        store.register({foo: 'bar'}, first);
        store.register({num: 42}, second);
        log.length = 0;

        unregister = true;
        store.update({num: '43', foo: 'bam'});

        setTimeout(function() {
          expect(log).to.equal(['second']);
          done();
        }, 5);
      });

    });

    lab.experiment('#register()', function() {

      lab.test('registers a new provider', function(done) {
        var store = new Store({}, noop);
        store.register({foo: 'bar'}, noop);
        done();
      });

      lab.test('initializes provider synchronously with defaults', function(done) {
        var store = new Store({}, noop);
        var called = false;
        store.register({foo: 'bar'}, function(values) {
          called = true;
          expect(values).to.equal({foo: 'bar'});
        });
        expect(called).to.equal(true);
        done();
      });

      lab.test('initializes provider synchronously with initial values', function(done) {
        var store = new Store({foo: 'bam'}, noop);
        var called = false;
        store.register({foo: 'bar'}, function(values) {
          called = true;
          expect(values).to.equal({foo: 'bam'});
        });
        expect(called).to.equal(true);
        done();
      });

      lab.test('initializes provider with defaults if store values are invalid', function(done) {
        var store = new Store({num: 'not a number'}, noop);
        var called = false;
        store.register({num: 42}, function(values) {
          called = true;
          expect(values).to.equal({num: 42});
        });
        expect(called).to.equal(true);
        done();
      });

      lab.test('returns a function used to update state', function(done) {
        var store = new Store({}, noop);
        var update = store.register({foo: 'bar'}, noop);

        expect(update).to.be.a.function();
        done();
      });

      lab.test('calls callback asynchronously on update', function(done) {
        var calls = [];
        var store = new Store({}, function(values, defaults) {
          calls.push({values: values, defaults: defaults});
        });

        var update = store.register({foo: 'bar'}, noop);

        update({foo: 'bam'});
        expect(calls).to.have.length(0);

        setTimeout(function() {
          expect(calls).to.have.length(1);
          expect(calls[0]).to.equal({
            values: {foo: 'bam'},
            defaults: {foo: 'bar'}
          });

          done();
        }, 5);
      });

      lab.test('calls callback with all values when one is updated', function(done) {
        var calls = [];
        var store = new Store({foo: 'bar', num: '41'}, function(values, defaults) {
          calls.push({values: values, defaults: defaults});
        });

        var update = store.register({foo: 'bam', num: 42}, noop);

        update({num: 43});
        expect(calls).to.have.length(0);

        setTimeout(function() {
          expect(calls).to.have.length(1);
          expect(calls[0]).to.equal({
            values: {foo: 'bar', num: '43'},
            defaults: {foo: 'bam', num: '42'}
          });

          done();
        }, 5);
      });

      lab.test('does not call callback if values do not change', function(done) {
        var calls = [];
        var store = new Store({foo: 'bar'}, function(values) {
          calls.push(values);
        });

        var update = store.register({foo: 'bam'}, noop);

        update({foo: 'bar'});
        expect(calls).to.have.length(0);

        setTimeout(function() {
          expect(calls).to.have.length(0);
          done();
        }, 5);
      });

      lab.test('debounces callback calls', function(done) {
        var calls = [];
        var store = new Store({}, function(values) {
          calls.push(values);
        });

        var update = store.register({foo: 'bar'}, noop);

        update({foo: 'bam'});
        expect(calls).to.have.length(0);

        update({foo: 'baz'});
        expect(calls).to.have.length(0);

        setTimeout(function() {
          expect(calls).to.have.length(1);
          expect(calls[0]).to.equal({foo: 'baz'});
          done();
        }, 5);
      });

      lab.test('throws when registering with a conflicting key', function(done) {
        var store = new Store({}, noop);
        store.register({foo: 'bar'}, noop);

        var call = function() {
          store.register({foo: 'bam'}, noop);
        };
        expect(call).to.throw(
            'Provider already registered using the same name: foo');
        done();
      });

      lab.test('throws when registering a duplicate callback', function(done) {
        var store = new Store({}, noop);

        var callback = function() {};
        store.register({foo: 'bar'}, callback);

        var call = function() {
          store.register({num: 42}, callback);
        };
        expect(call).to.throw(
            'Provider already registered with the same callback');
        done();
      });

    });

    lab.experiment('#unregister()', function() {

      lab.test('allows a provider to be removed', function(done) {
        var store = new Store({}, noop);

        var callback = function() {};
        store.register({foo: 'bar'}, callback);
        store.unregister(callback);
        done();
      });

      lab.test('removes values associated with the provider', function(done) {
        var calls = [];
        var store = new Store({}, function(values) {
          calls.push(values);
        });

        var firstCallback = function() {};
        var firstUpdate = store.register({foo: 'bar'}, firstCallback);

        var secondCallback = function() {};
        var secondUpdate = store.register({num: 42}, secondCallback);

        expect(calls).to.have.length(0);

        firstUpdate({foo: 'bam'});
        secondUpdate({num: 43});

        store.unregister(firstCallback);

        setTimeout(function() {
          expect(calls).to.have.length(1);
          expect(calls[0]).to.equal({num: '43'});
          done();
        }, 5);
      });

      lab.test('causes unregistered provider update to throw', function(done) {
        var store = new Store({}, noop);

        var callback = function() {};
        var update = store.register({foo: 'bar'}, callback);

        store.unregister(callback);

        var call = function() {
          update({foo: 'bam'});
        };
        expect(call).to.throw('Unregistered provider attempting to update state');
        done();
      });

      lab.test('throws if called twice for the same provider', function(done) {
        var store = new Store({}, noop);

        var callback = function() {};
        store.register({foo: 'bar'}, callback);

        store.unregister(callback);

        var call = function() {
          store.unregister(callback);
        };
        expect(call).to.throw('Unable to unregister hashed state provider');
        done();
      });

    });

  });

  lab.experiment('#serialize()', function() {

    lab.test('it uses default serializers', function(done) {
      var store = new Store({}, function() {});

      var serialized = store.serialize({foo: 'bar', num: 42});
      expect(serialized).to.equal({foo: 'bar', num: '42'});
      done();
    });

    lab.test('it uses serializer from registered provider if available', function(done) {
      var store = new Store({}, function() {});

      store.register({
        foo: {
          default: 'bar',
          serialize: function(value) {
            return value.split('').reverse().join('');
          },
          deserialize: function(str) {
            return str.split('').reverse().join('');
          }
        },
        bam: 'baz'
      }, function() {});

      var serialized = store.serialize({foo: 'bar', num: 42});
      expect(serialized).to.equal({foo: 'rab', num: '42'});
      done();
    });

  });

});
