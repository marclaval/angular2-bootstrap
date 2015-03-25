// Use "register" extension from systemjs.
// That's what Traceur outputs: `System.register()`.
register(System);
cjs(System);

jasmine.DEFAULT_TIMEOUT_INTERVAL = 50;

// Cancel Karma's synchronous start,
// we will call `__karma__.start()` later, once all the specs are loaded.
__karma__.loaded = function() {};


System.baseURL = '/base/';

// So that we can import packages like `core/foo`, instead of `core/src/foo`.
System.paths = {
  '*': './*.js'
}

// Import all the specs, execute their `main()` method and kick off Karma (Jasmine).
System.import('angular2/src/dom/browser_adapter').then(function(browser_adapter) {
  browser_adapter.BrowserDomAdapter.makeCurrent();
}).then(function() {
  return Promise.all(
    Object.keys(window.__karma__.files) // All files served by Karma.
    .filter(onlySpecFiles)
    .map(file2moduleName)        // Normalize paths to module names.
    .map(function(path) {
      console.log(path);
      return System.import(path).then(function(module) {
        console.log(module);
        if (module.hasOwnProperty('main')) {
          module.main()
        } else {
          throw new Error('Module ' + path + ' does not implement main() method.');
        }
      });
    }))
})
.then(function() {
  __karma__.start();
}, function(error) {
  console.error(error.stack || error)
  __karma__.start();
});


function onlySpecFiles(path) {
  return /_spec\.js$/.test(path);
}

function file2moduleName(filePath) {
  return filePath.replace(/\\/g, '/')
    // module name should be relative to `modules` and `tools` folder
    .replace(/.*\/test\//, 'test/')
    .replace(/.*\/src\//, '')
    // module name should not have a suffix
    .replace(/\.\w*$/, '');
}
