# `hashed`

Serialize your application state in the URL hash.

```js
var hashed = require('hashed');

// default values
var config = {
  stringValue: 'foo',
  numberValue: 42
};

var update = hashed.register(config, function(state) {
  // called when the URL hash is updated
  // the state object includes any changed values
});

// call the update function when you want to have the URL hash
// updated with some new state
update({
  stringValue: 'bar'  
});
```
[![Current Status](https://secure.travis-ci.org/tschaub/hashed.png?branch=master)](https://travis-ci.org/tschaub/hashed)
