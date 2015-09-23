'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var filter = require('gulp-filter');
var inject = require('gulp-inject');
var markdown = require('gulp-markdown');
var minifyCSS = require('gulp-minify-css');
var minifyHTML = require('gulp-minify-html');
var protractor = require('gulp-protractor').protractor;
var sourcemaps = require('gulp-sourcemaps');
var tsc = require('gulp-typescript');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var webdriver_update = require('gulp-protractor').webdriver_update;

var Builder = require('systemjs-builder');
var del = require('del');
var escape = require('escape-html');
var exec = require('child_process').exec;
var fs = require('fs');
var http = require('http');
var karma = require('karma').Server;
var path = require('path');
var join = path.join;
var runSequence = require('run-sequence');
var through2 = require('through2');

var express = require('express');
var openResource = require('open');

// --------------
// Configuration.
var PATH = {
  dest: {
    all: 'dist',
    dev: {
      all: 'dist/dev',
      lib: 'dist/dev/lib'
    },
    prod: {
      all: 'dist/prod',
      lib: 'dist/prod/lib',
      ng2: 'angular2-and-all-libs.js'
    }
  },
  src: {
    html: ['demo/**/*.html', 'src/**/*.html'],
    assets: ['demo/**/*.css'],
    sourceToDisplay: ['demo/**/demo-*', '!demo/demo-app.ts'],
    md: ['demo/**/*.md'],
    ts: ['demo/**/*.ts', 'src/**/*.ts'],
    test: ['test/**/*.ts'],
    // Order is quite important here for the HTML tag injection.
    lib: {
      dev: [
        'demo/shims_for_old_browsers.js',
        'node_modules/angular2/node_modules/traceur/bin/traceur-runtime.js',
        'node_modules/systemjs/dist/system.js',
        'demo/system.conf.js',
        'node_modules/angular2/bundles/angular2.dev.js',
        'node_modules/angular2/bundles/router.dev.js'
      ],
      prod: [
        'demo/shims_for_old_browsers.js',
        'node_modules/angular2/node_modules/traceur/bin/traceur-runtime.js',
        'node_modules/systemjs/dist/system-csp-production.js',
        'demo/system.conf.js',
        'node_modules/angular2/bundles/angular2.min.js',
        'node_modules/angular2/bundles/router.dev.js'
      ]
    }
  }
};

var tsProject = tsc.createProject('tsconfig.json', {
  typescript: require('typescript')
});

//Automate the generation
gulp.task('generateDeclaration', ['clean.tmp'], function () {
  var result = gulp.src(['src/**/*.ts'])
    .pipe(tsc(tsProject));
  return result.dts
    .pipe(gulp.dest('tmp'));
});

var SERVER_PORT = 5555;

// --------------
// Clean.

gulp.task('clean', function (done) {
  del(PATH.dest.all, done);
});

gulp.task('clean.dev', function (done) {
  del(PATH.dest.dev.all, done);
});

gulp.task('clean.app.dev', function (done) {
  // TODO: rework this part.
  del([join(PATH.dest.dev.all, '**/*'), '!' +
       PATH.dest.dev.lib, '!' + join(PATH.dest.dev.lib, '*')], done);
});

gulp.task('clean.prod', function (done) {
  del(PATH.dest.prod.all, done);
});

gulp.task('clean.app.prod', function (done) {
  // TODO: rework this part.
  del([join(PATH.dest.prod.all, '**/*'), '!' +
       PATH.dest.prod.lib, '!' + join(PATH.dest.prod.lib, '*')], done);
});

gulp.task('clean.tmp', function(done) {
  del('tmp', done);
});

// --------------
// Build dev.
gulp.task('build.lib.dev', function () {
  return gulp.src(PATH.src.lib.dev)
    .pipe(gulp.dest(PATH.dest.dev.lib));
});

gulp.task('build.js.dev', function () {
  var result = gulp.src(PATH.src.ts.concat(PATH.src.test))
    .pipe(sourcemaps.init())
    .pipe(tsc(tsProject));

  return result.js
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(PATH.dest.dev.all));
});

gulp.task('build.sources.dev', ['build.js.dev'], function () {
  var filterSourceCode = filter('**/samples/**/demo-*', {restore: true});
  return gulp.src(PATH.src.assets.concat(PATH.src.sourceToDisplay))
    .pipe(filterSourceCode)
    .pipe(convertSourceCode())
    .pipe(filterSourceCode.restore)
    .pipe(gulp.dest(PATH.dest.dev.all));
});
gulp.task('build.assets.dev', ['build.sources.dev'], function () {
  var filterMD = filter('**/*.md', {restore: true});
  return gulp.src(PATH.src.html.concat(PATH.src.md))
    .pipe(filterMD)
    .pipe(markdown())
    .pipe(convertTables())
    .pipe(filterMD.restore)
    .pipe(gulp.dest(PATH.dest.dev.all));
});

gulp.task('build.index.dev', function() {
  var lib = gulp.src(injectableDevAssetsRef(), { read: false });
  return gulp.src('./demo/index.html')
    .pipe(inject(lib, { transform: transformPath('dev') }))
    .pipe(gulp.dest(PATH.dest.dev.all));
});

gulp.task('build.app.dev', function (done) {
  runSequence('clean.app.dev', 'build.assets.dev', 'build.index.dev', done);
});

gulp.task('build.dev', function (done) {
  runSequence('clean.dev', 'build.lib.dev', 'build.app.dev', done);
});

// --------------
// Build prod.
var demoProdBuilder = new Builder({
  baseURL: 'tmp',
  meta: {
    'angular2-bootstrap': { build: false },
    'angular2/angular2': { build: false },
    'angular2/router': { build: false }
  },
  defaultJSExtensions: true
});
var appProdBuilder = new Builder({
  baseURL: 'tmp',
  meta: {
    'angular2/angular2': { build: false },
    'angular2/router': { build: false }
  },
  defaultJSExtensions: true
});

gulp.task('build.lib.prod', function () {
  return gulp.src(PATH.src.lib.prod)
    .pipe(concat(PATH.dest.prod.ng2))
    .pipe(uglify())
    .pipe(gulp.dest(PATH.dest.prod.lib));
});

gulp.task('build.sources.tmp', function () {
  var filterSourceCode = filter('**/samples/**/demo-*', {restore: true});
  return gulp.src(PATH.src.assets.concat(PATH.src.sourceToDisplay))
    .pipe(filterSourceCode)
    .pipe(convertSourceCode())
    .pipe(filterSourceCode.restore)
    .pipe(gulp.dest('tmp'));
});
gulp.task('build.assets.tmp', ['build.sources.tmp'], function () {
  var filterMD = filter('**/*.md', {restore: true});
  var filterHTML = filter('**/*.html', {restore: true});
  return gulp.src(PATH.src.html.concat(PATH.src.md))
    .pipe(filterMD)
    .pipe(markdown())
    .pipe(convertTables())
    .pipe(filterMD.restore)
    .pipe(filterHTML)
    .pipe(minifyHTML({ conditionals: true }))
    .pipe(filterHTML.restore)
    .pipe(gulp.dest('tmp'));
});

gulp.task('build.js.tmp', ['build.assets.tmp'], function () {
  var result = gulp.src(PATH.src.ts)
    .pipe(tsc(tsProject));

  return result.js
    .pipe(inlineTemplates('tmp'))
    .pipe(gulp.dest('tmp'));
});

// TODO: add inline source maps (System only generate separate source maps file).
gulp.task('build.demo.prod', ['build.js.tmp'], function() {
  return demoProdBuilder.build('demo-app', join(PATH.dest.prod.all, 'demo-app.js'),
    { minify: true }).catch(function (e) { console.log(e); });
});
gulp.task('build.js.prod', ['build.demo.prod'], function() {
  return appProdBuilder.build('angular2-bootstrap', join(PATH.dest.prod.lib, 'angular2-bootstrap.js'),
    { minify: true }).catch(function (e) { console.log(e); });
});

gulp.task('build.assets.prod', ['build.js.prod'], function () {
  var filterCSS = filter('**/*.css', {restore: true});
  return gulp.src(PATH.src.assets)
    .pipe(filterCSS)
    .pipe(minifyCSS())
    .pipe(filterCSS.restore)
    .pipe(gulp.dest(PATH.dest.prod.all));
});

gulp.task('build.index.prod', function() {
  var lib = gulp.src([join(PATH.dest.prod.lib, '**/*.js'),
                         join(PATH.dest.prod.all, '**/*.css')], { read: false });
  return gulp.src('./demo/index.html')
    .pipe(inject(lib, { transform: transformPath('prod') }))
    .pipe(gulp.dest(PATH.dest.prod.all));
});

gulp.task('build.app.prod', function (done) {
  runSequence('clean.app.prod', 'build.assets.prod', 'build.index.prod', 'clean.tmp', done);
});

gulp.task('build.prod', function (done) {
  runSequence('clean.prod', 'build.lib.prod', 'clean.tmp', 'build.app.prod', done);
});

// --------------
// Unit tests.
gulp.task('karma-launch', function() {
  var server = new karma({
    configFile: join(__dirname, 'karma.conf.js')
  });
  server.start();
});

gulp.task('karma-run', function (done) {
  runKarma('karma.conf.js', done);
});

gulp.task('build.app.test.minify', function () {
  return gulp.src([PATH.dest.dev.all + '/**/*.html'])
    .pipe(minifyHTML({ conditionals: true }))
    .pipe(gulp.dest(PATH.dest.dev.all));
});
gulp.task('build.app.test.inline', function () {
  return gulp.src([PATH.dest.dev.all + '/**/*.js', '!' + PATH.dest.dev.all + '/lib/*'])
    .pipe(inlineTemplates(PATH.dest.dev.all))
    .pipe(gulp.dest(PATH.dest.dev.all));
});

gulp.task('test', ['build.dev'], function (neverDone) {
  runSequence(
    'build.app.test.minify',
    'build.app.test.inline',
    'karma-launch',
    function() {
      watch(['./src/**', './test/**'], function() {
        runSequence('build.app.dev', 'build.app.test.minify', 'build.app.test.inline', 'karma-run');
      });
    }
  );
});

// --------------
// E2E tests.
var e2eServer = null;
gulp.task('e2eServer', ['build.dev'], function (done) {
  e2eServer = http.createServer(_startSPA('dev'));
  e2eServer.listen(SERVER_PORT, done);
});
gulp.task('webdriver_update', webdriver_update);
gulp.task('e2e', ['webdriver_update', 'e2eServer'], function (done) {
    gulp.src(['test-e2e/**/*spec.js']).pipe(protractor({
        args: ['--baseUrl', 'http://localhost:' + SERVER_PORT]
    })).on('error', function(e) {
        e2eServer.close();
        done();
    }).on('end', function() {
        e2eServer.close();
        done();
    });
});

// --------------
// Serve dev.
gulp.task('serve.dev', ['build.dev'], function () {
  watch(['./src/**', './demo/**'], function () {
    gulp.start('build.app.dev');
  });
  serveSPA('dev');
});

// --------------
// Serve prod.
gulp.task('serve.prod', ['build.prod'], function () {
  watch(['./src/**', './demo/**'], function () {
    gulp.start('build.app.prod');
  });
  serveSPA('prod');
});

// --------------
// Utils.

function transformPath(env) {
  return function (filepath) {
    arguments[0] = filepath.replace('/' + PATH.dest[env].all + '/', '');
    return inject.transform.apply(inject.transform, arguments);
  };
}

function injectableDevAssetsRef() {
  var src = PATH.src.lib.dev.map(function(path) {
    return join(PATH.dest.dev.lib, path.split('/').pop());
  });
  src.push(join(PATH.dest.dev.all, '**/*.css'));
  return src;
}

function serveSPA(env) {
  var app = _startSPA(env);
  app.listen(SERVER_PORT, function () {
    openResource('http://localhost:' + SERVER_PORT);
  });
  
}
function _startSPA(env) {
  var app = express().use(express.static(join(__dirname, PATH.dest[env].all)));
  return app;
}

function convertTables() {
  return through2.obj(function (file, encoding, done) {
    var content = String(file.contents).replace(/<table>/g, '<table class="table table-bordered">');
    file.contents = new Buffer(content);
    this.push(file);
    done();
  });
}

function convertSourceCode() {
  return through2.obj(function (file, encoding, done) {
    var ext = path.extname(file.path);
    var language = ext == '.ts' ? 'typescript' : 'html';
    var content = '<pre><code class="language-' + language + '" ng-non-bindable>' + escape(String(file.contents)) + '</code></pre>';
    file.contents = new Buffer(content);
    file.path += '.source.html';
    this.push(file);
    done();
  });
}

function inlineTemplates(folder) {
   return through2.obj(function(file, encoding, done) {
        var content = String(file.contents);
        var pathPrefix = __dirname + path.sep + folder;
        var re = new RegExp("templateUrl\\s*:\\s*(\'|\"|\`)([^\'\"\`]*)(\'|\"|\`)", "g");
        var res = re.exec(content);
        while (res) {
          var tpl = fs.readFileSync(join(pathPrefix, res[2]), {encoding: 'utf8'}).replace(/\'/g, '\\\'').replace(/(\r\n|\n|\r)/gm, '&#10;\'+\r\n\'');
          content = content.replace(res[0], 'template: \'' + tpl + '\'');
          res = re.exec(content);
        }
        file.contents = new Buffer(content);
        this.push(file);
        done();
    });
}

function runKarma(configFile, done) {
  var cmd = process.platform === 'win32' ? 'node_modules\\.bin\\karma run ' :
                                           'node node_modules/.bin/karma run ';
  cmd += configFile;
  exec(cmd, function(e, stdout) {
    // ignore errors, we don't want to fail the build in the interactive (non-ci) mode
    // karma server will print all test failures
    done();
  });
}
