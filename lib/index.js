var Store = require('./store').Store;

var updatingHash = false;

function onHashChange(event) {
  if (updatingHash) {
    return;
  }
  var values = location.hash.substring(1).split('/');
  store.update(values);
}

function updateHash(values) {
  updatingHash = true;
  location.hash = '#' + values.join('/');
  updatingHash = false;
}

var store = new Store(updateHash);

addEventListener('hashchange', onHashChange);
