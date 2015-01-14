# `hashed`

Serialize your application state in the URL hash.

## Usage

If you use a module bundler like [Browserify](http://browserify.org/), you can install `hashed` with `npm`.

In your project root:

    npm install hashed --save-dev

In one of your application modules:

```js
var hashed = require('hashed');
```

If you're using a non-CommonJS module loader or just plain `<script>` tags, the package comes with minified and unminified versions of the library as [UMD](https://github.com/umdjs/umd/blob/master/README.md) bundles in the `dist` directory.

## API

### `hashed.register`

The `hashed` module exports a single `register` function that is to be called by components that want to initialize their state by deserializing values from the URL hash or persist their state by serializing values to the URL hash.  Multiple components (that may not know about one another) can register for "slots" in the hash.

The `register` function takes two arguments:

 * **config** - `Object` Definition for the state "schema" (default values and types for each field).

 * **listener** - `function(Object)` A function that is called when the URL hash is updated.  The object properties represent new state values.  The object will not include property values that have not changed.

The `register` function returns a function:

 * `function(Object)` A function that should be called whenever a component's state changes.  The URL hash will be updated with serialized versions of the state values.

## Example

// default values
var config = {
  stringValue: 'foo',
  numberValue: 42
};

var update = hashed.register(config, function(hash) {
  // called when the URL hash is updated
  // the hash object includes any changed values
});

// call the update function when you want to have the URL hash
// updated with some new state
update({
  stringValue: 'bar'
});
```

[![Current Status](https://secure.travis-ci.org/tschaub/hashed.png?branch=master)](https://travis-ci.org/tschaub/hashed)
