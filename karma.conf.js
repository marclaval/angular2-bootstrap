module.exports = function(config) {
  config.set({

    frameworks: ['jasmine'],

    files: [
      // Sources and specs.
      // Loaded through the es6-module-loader, in `test-main.js`.
      {pattern: 'src/**', included: false},
      {pattern: 'test/**', included: false},

      'node_modules/traceur/bin/traceur-runtime.js',
      'node_modules/es6-module-loader/dist/es6-module-loader-sans-promises.src.js',
      'node_modules/systemjs/dist/system.src.js',
      'node_modules/systemjs/lib/extension-register.js',
      'node_modules/systemjs/lib/extension-cjs.js',
      'node_modules/zone.js/zone.js',
      'node_modules/zone.js/long-stack-trace-zone.js',
      'dist/lib/angular2.js',
      'test-main.js'
    ],

    exclude: [
    ],

    preprocessors: {
      'src/**/*.js': ['traceur'],
      'test/**/*.js': ['traceur']
    },

    traceurPreprocessor: {
      options: {
        modules: 'instantiate',
        moduleName: true,
        annotations: true,
        types: true
      },
      transformPath: function(fileName) {
        return fileName.replace(/\.es6$/, '.js');
      }
    },

    browsers: ['Chrome'],

    port: 9876
  });

  config.plugins.push(require('./karma-traceur-preprocessor_custom'));
};
