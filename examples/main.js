const hashed = require('../lib/main.js');

function registerView1() {
  const elements = document.getElementById('view-1').elements;

  const config = {
    quantity: '75',
    item: 'beans'
  };

  const update = hashed.register(config, function(values) {
    // called with initial values
    for (const name in values) {
      elements.namedItem(name).value = values[name];
    }
  });

  for (const name in config) {
    elements.namedItem(name).addEventListener('change', function(evt) {
      const values = {};
      values[evt.target.getAttribute('name')] = evt.target.value;
      update(values);
    });
  }
}

function registerView2() {
  const elements = document.getElementById('view-2').elements;

  const config = {
    date: '2014-10-28',
    color: '#bada55'
  };

  const update = hashed.register(config, function(values) {
    // called with initial values
    for (const name in values) {
      elements.namedItem(name).value = values[name];
    }
  });

  for (const name in config) {
    elements.namedItem(name).addEventListener('change', function(evt) {
      const values = {};
      values[evt.target.getAttribute('name')] = evt.target.value;
      update(values);
    });
  }
}

function registerView3() {
  const elements = document.getElementById('view-3').elements;

  const config = {
    date: '2014-10-28',
    _: 'view-3'
  };

  const update = hashed.register(config, function(values) {
    // called with initial values
    for (const name in values) {
      elements.namedItem(name).value = values[name];
    }
  });

  for (const name in config) {
    if (name !== '_') {
      elements.namedItem(name).addEventListener('change', function(evt) {
        const values = {};
        values[evt.target.getAttribute('name')] = evt.target.value;
        update(values);
      });
    }
  }
}

registerView1();
registerView2();
registerView3();
