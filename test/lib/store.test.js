const lab = (exports.lab = require('lab').script());
const expect = require('code').expect;

const Store = require('../../lib/store').Store;

lab.experiment('store', () => {
  lab.experiment('Store', () => {
    const noop = () => {};

    lab.experiment('constructor', () => {
      lab.test('creates a new instance', () => {
        const store = new Store({}, noop);
        expect(store).to.be.an.instanceof(Store);
      });

      lab.test(
        'accepts initial values',
        () =>
          new Promise(resolve => {
            const calls = [];
            const store = new Store(
              {foo: 'bar', num: '42'},
              (values, defaults) => {
                calls.push({values: values, defaults: defaults});
              }
            );
            const update = store.register({num: 43}, noop);
            update({num: 44});
            expect(calls).to.have.length(0);

            setTimeout(() => {
              expect(calls).to.have.length(1);
              expect(calls[0]).to.equal({
                values: {foo: 'bar', num: '44'},
                defaults: {num: '43'}
              });
              resolve();
            }, 5);
          })
      );
    });

    lab.experiment('#update()', () => {
      lab.test(
        'updates store values and calls provider callbacks',
        () =>
          new Promise(resolve => {
            const store = new Store({}, noop);
            const log = [];
            store.register({foo: 'bar'}, values => {
              log.push(values);
            });
            expect(log).to.equal([{foo: 'bar'}]);
            log.length = 0;

            store.update({foo: 'bam'});
            setTimeout(() => {
              expect(log).to.equal([{foo: 'bam'}]);
              resolve();
            }, 5);
          })
      );

      lab.test(
        'calls callback once for multiple synchronous updates',
        () =>
          new Promise(resolve => {
            const store = new Store({}, noop);
            const log = [];
            store.register({foo: 'bar', num: 42}, values => {
              log.push(values);
            });
            expect(log).to.equal([{foo: 'bar', num: 42}]);
            log.length = 0;

            store.update({foo: 'bam', num: '21'});
            store.update({foo: 'baz', num: '63'});

            setTimeout(() => {
              expect(log).to.equal([{foo: 'baz', num: 63}]);
              resolve();
            }, 5);
          })
      );

      lab.test(
        'only calls callback with updated values',
        () =>
          new Promise(resolve => {
            const store = new Store({}, noop);
            const log = [];
            store.register({foo: 'bar', num: 42}, values => {
              log.push(values);
            });
            expect(log).to.equal([{foo: 'bar', num: 42}]);
            log.length = 0;

            store.update({num: '63', foo: 'bar'});

            setTimeout(() => {
              expect(log).to.equal([{num: 63}]);
              resolve();
            }, 5);
          })
      );

      lab.test(
        'calls callback with defaults when updated values are absent',
        () =>
          new Promise(resolve => {
            const store = new Store({foo: 'non-default', bar: 42}, noop);
            const log = [];
            store.register({foo: 'bar', num: 42}, values => {
              log.push(values);
            });
            expect(log).to.equal([{foo: 'non-default', num: 42}]);
            log.length = 0;

            store.update({num: '63'});

            setTimeout(() => {
              expect(log).to.equal([{foo: 'bar', num: 63}]);
              resolve();
            }, 5);
          })
      );

      lab.test(
        'last update wins',
        () =>
          new Promise(resolve => {
            const store = new Store({}, noop);
            const log = [];
            store.register({foo: 'bar', num: 42}, values => {
              log.push(values);
            });
            expect(log).to.equal([{foo: 'bar', num: 42}]);
            log.length = 0;

            store.update({num: '63'});
            store.update({foo: 'bam'});

            setTimeout(() => {
              expect(log).to.equal([{foo: 'bam'}]);
              resolve();
            }, 5);
          })
      );

      lab.test(
        'does not call callback if values do not change',
        () =>
          new Promise(resolve => {
            const store = new Store({}, noop);
            const log = [];
            store.register({foo: 'bar', num: 42}, values => {
              log.push(values);
            });
            expect(log).to.equal([{foo: 'bar', num: 42}]);
            log.length = 0;

            store.update({num: '42'});
            store.update({foo: 'bar'});

            setTimeout(() => {
              expect(log).to.have.length(0);
              resolve();
            }, 5);
          })
      );

      lab.test(
        'does not call callback for garbage updates',
        () =>
          new Promise(resolve => {
            const store = new Store({}, noop);
            const log = [];
            store.register({foo: 'bar', num: 42}, values => {
              log.push(values);
            });
            expect(log).to.equal([{foo: 'bar', num: 42}]);
            log.length = 0;

            store.update({num: 'garbage'});

            setTimeout(() => {
              expect(log).to.have.length(0);
              resolve();
            }, 5);
          })
      );

      lab.test(
        'calls callback with valid values if some of the values are garbage',
        () =>
          new Promise(resolve => {
            const store = new Store({}, noop);
            const log = [];
            store.register({foo: 'bar', num: 42}, values => {
              log.push(values);
            });
            expect(log).to.equal([{foo: 'bar', num: 42}]);
            log.length = 0;

            store.update({num: 'garbage', foo: 'bam'});

            setTimeout(() => {
              expect(log).to.equal([{foo: 'bam'}]);
              resolve();
            }, 5);
          })
      );

      lab.test(
        'calls most recently registered provider first',
        () =>
          new Promise(resolve => {
            const store = new Store({}, noop);
            const log = [];
            store.register({foo: 'bar'}, values => {
              log.push('first');
            });
            store.register({num: 42}, values => {
              log.push('second');
            });
            log.length = 0;

            store.update({num: '43', foo: 'bam'});

            setTimeout(() => {
              expect(log).to.equal(['second', 'first']);
              resolve();
            }, 5);
          })
      );

      lab.test(
        'works if callbacks unregister providers',
        () =>
          new Promise(resolve => {
            const store = new Store({}, noop);
            const log = [];

            let unregister = false;
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

            setTimeout(() => {
              expect(log).to.equal(['second']);
              resolve();
            }, 5);
          })
      );
    });

    lab.experiment('#register()', () => {
      lab.test('registers a new provider', () => {
        const store = new Store({}, noop);
        store.register({foo: 'bar'}, noop);
      });

      lab.test('initializes provider synchronously with defaults', () => {
        const store = new Store({}, noop);
        let called = false;
        store.register({foo: 'bar'}, values => {
          called = true;
          expect(values).to.equal({foo: 'bar'});
        });
        expect(called).to.equal(true);
      });

      lab.test('initializes provider synchronously with initial values', () => {
        const store = new Store({foo: 'bam'}, noop);
        let called = false;
        store.register({foo: 'bar'}, values => {
          called = true;
          expect(values).to.equal({foo: 'bam'});
        });
        expect(called).to.equal(true);
      });

      lab.test(
        'initializes provider with defaults if store values are invalid',
        () => {
          const store = new Store({num: 'not a number'}, noop);
          let called = false;
          store.register({num: 42}, values => {
            called = true;
            expect(values).to.equal({num: 42});
          });
          expect(called).to.equal(true);
        }
      );

      lab.test('returns a function used to update state', () => {
        const store = new Store({}, noop);
        const update = store.register({foo: 'bar'}, noop);

        expect(update).to.be.a.function();
      });

      lab.test(
        'calls callback asynchronously on update',
        () =>
          new Promise(resolve => {
            const calls = [];
            const store = new Store({}, (values, defaults) => {
              calls.push({values: values, defaults: defaults});
            });

            const update = store.register({foo: 'bar'}, noop);

            update({foo: 'bam'});
            expect(calls).to.have.length(0);

            setTimeout(() => {
              expect(calls).to.have.length(1);
              expect(calls[0]).to.equal({
                values: {foo: 'bam'},
                defaults: {foo: 'bar'}
              });

              resolve();
            }, 5);
          })
      );

      lab.test(
        'calls callback with all values when one is updated',
        () =>
          new Promise(resolve => {
            const calls = [];
            const store = new Store(
              {foo: 'bar', num: '41'},
              (values, defaults) => {
                calls.push({values: values, defaults: defaults});
              }
            );

            const update = store.register({foo: 'bam', num: 42}, noop);

            update({num: 43});
            expect(calls).to.have.length(0);

            setTimeout(() => {
              expect(calls).to.have.length(1);
              expect(calls[0]).to.equal({
                values: {foo: 'bar', num: '43'},
                defaults: {foo: 'bam', num: '42'}
              });

              resolve();
            }, 5);
          })
      );

      lab.test(
        'does not call callback if values do not change',
        () =>
          new Promise(resolve => {
            const calls = [];
            const store = new Store({foo: 'bar'}, values => {
              calls.push(values);
            });

            const update = store.register({foo: 'bam'}, noop);

            update({foo: 'bar'});
            expect(calls).to.have.length(0);

            setTimeout(() => {
              expect(calls).to.have.length(0);
              resolve();
            }, 5);
          })
      );

      lab.test(
        'debounces callback calls',
        () =>
          new Promise(resolve => {
            const calls = [];
            const store = new Store({}, values => {
              calls.push(values);
            });

            const update = store.register({foo: 'bar'}, noop);

            update({foo: 'bam'});
            expect(calls).to.have.length(0);

            update({foo: 'baz'});
            expect(calls).to.have.length(0);

            setTimeout(() => {
              expect(calls).to.have.length(1);
              expect(calls[0]).to.equal({foo: 'baz'});
              resolve();
            }, 5);
          })
      );

      lab.test('throws when registering with a conflicting key', () => {
        const store = new Store({}, noop);
        store.register({foo: 'bar'}, noop);

        const call = () => {
          store.register({foo: 'bam'}, noop);
        };
        expect(call).to.throw(
          'Provider already registered using the same name: foo'
        );
      });

      lab.test('throws when registering a duplicate callback', () => {
        const store = new Store({}, noop);

        const callback = () => {};
        store.register({foo: 'bar'}, callback);

        const call = () => {
          store.register({num: 42}, callback);
        };
        expect(call).to.throw(
          'Provider already registered with the same callback'
        );
      });
    });

    lab.experiment('#unregister()', () => {
      lab.test('allows a provider to be removed', () => {
        const store = new Store({}, noop);

        const callback = () => {};
        store.register({foo: 'bar'}, callback);
        store.unregister(callback);
      });

      lab.test(
        'removes values associated with the provider',
        () =>
          new Promise(resolve => {
            const calls = [];
            const store = new Store({}, values => {
              calls.push(values);
            });

            const firstCallback = () => {};
            const firstUpdate = store.register({foo: 'bar'}, firstCallback);

            const secondCallback = () => {};
            const secondUpdate = store.register({num: 42}, secondCallback);

            expect(calls).to.have.length(0);

            firstUpdate({foo: 'bam'});
            secondUpdate({num: 43});

            store.unregister(firstCallback);

            setTimeout(() => {
              expect(calls).to.have.length(1);
              expect(calls[0]).to.equal({num: '43'});
              resolve();
            }, 5);
          })
      );

      lab.test('causes unregistered provider update to throw', () => {
        const store = new Store({}, noop);

        const callback = () => {};
        const update = store.register({foo: 'bar'}, callback);

        store.unregister(callback);

        const call = () => {
          update({foo: 'bam'});
        };
        expect(call).to.throw(
          'Unregistered provider attempting to update state'
        );
      });

      lab.test('throws if called twice for the same provider', () => {
        const store = new Store({}, noop);

        const callback = () => {};
        store.register({foo: 'bar'}, callback);

        store.unregister(callback);

        const call = () => {
          store.unregister(callback);
        };
        expect(call).to.throw('Unable to unregister hashed state provider');
      });
    });
  });

  lab.experiment('#serialize()', () => {
    lab.test('it uses default serializers', () => {
      const store = new Store({}, () => {});

      const serialized = store.serialize({foo: 'bar', num: 42});
      expect(serialized).to.equal({foo: 'bar', num: '42'});
    });

    lab.test('it uses serializer from registered provider if available', () => {
      const store = new Store({}, () => {});

      store.register(
        {
          foo: {
            default: 'bar',
            serialize: value =>
              value
                .split('')
                .reverse()
                .join(''),
            deserialize: str =>
              str
                .split('')
                .reverse()
                .join('')
          },
          bam: 'baz'
        },
        () => {}
      );

      const serialized = store.serialize({foo: 'bar', num: 42});
      expect(serialized).to.equal({foo: 'rab', num: '42'});
    });
  });
});
