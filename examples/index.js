var config = {
  food: 'chicken',
  car: 'fiat'
};

var update = hashed.register(config, function(state) {
  console.log('changed', state);
});

hashed.start();
