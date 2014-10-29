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

// start monitoring changes in the URL hash
hashed.start();

// call the update function when you want to have the URL hash
// updated with some new state
update({
  stringValue: 'bar'  
});
```
