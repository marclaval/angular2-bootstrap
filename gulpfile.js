'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var filter = require('gulp-filter');
var inject = require('gulp-inject');
var markdown = require('gulp-markdown');
var minifyCSS = require('gulp-minify-css');
var minifyHTML = require('gulp-minify-html');
var plumber = require('gulp-plumber');
var protractor = require('gulp-protractor').protractor;
var sourcemaps = require('gulp-sourcemaps');
var tsc = require('gulp-typescript');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var webdriver_update = require('gulp-protractor').webdriver_update;

var Builder = require('systemjs-builder');
var del = require('del');
var exec = require('child_process').exec;
var fs = require('fs');
var http = require('http');
var karma = require('karma').server;
var path = require('path');
var join = path.join;
var runSequence = require('run-sequence');
var series = require('stream-series');
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
      lib: 'dist/dev/lib',
      ng2: 'dist/dev/lib/angular2.js',
      router: 'dist/dev/lib/router.js',
      test: 'dist/dev/lib/test.js'
    },
    prod: {
      all: 'dist/prod',
      lib: 'dist/prod/lib',
      ng2: 'angular2_and_all_libs.js'
    }
  },
  src: {
    html: ['demo/**/*.html', 'src/**/*.html'],
    css: ['demo/**/*.css'],
    md: ['demo/**/*.md'],
    ts: ['demo/**/*.ts', 'src/**/*.ts'],
    test: ['test/**/*.ts'],
    // Order is quite important here for the HTML tag injection.
    lib: [
      './node_modules/angular2/node_modules/traceur/bin/traceur-runtime.js',
      './node_modules/es6-module-loader/dist/es6-module-loader-sans-promises.js',
      './node_modules/es6-module-loader/dist/es6-module-loader-sans-promises.js.map',
      './node_modules/reflect-metadata/Reflect.js',
      './node_modules/reflect-metadata/Reflect.js.map',
      './node_modules/systemjs/dist/system.src.js',
      './node_modules/angular2/node_modules/zone.js/dist/zone.js'
    ]
  }
};

var ng2Builder = new Builder({
  paths: {
    'angular2/*': 'node_modules/angular2/es6/dev/*.js',
    rx: 'node_modules/angular2/node_modules/rx/dist/rx.js'
  },
  meta: {
    rx: {
      format: 'cjs'
    }
  }
});

var appProdBuilder = new Builder({
  baseURL: 'file:./tmp',
  meta: {
    'angular2/angular2': { build: false },
    'angular2/router': { build: false }
  }
});

var tsProject = tsc.createProject('tsconfig.json', {
  typescript: require('typescript')
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

gulp.task('build.ng2.dev', function () {
  ng2Builder.build('angular2/router', PATH.dest.dev.router, {});
  ng2Builder.build('angular2/test', PATH.dest.dev.test, {});
  return ng2Builder.build('angular2/angular2', PATH.dest.dev.ng2, {});
});

gulp.task('build.lib.dev', ['build.ng2.dev'], function () {
  return gulp.src(PATH.src.lib)
    .pipe(gulp.dest(PATH.dest.dev.lib));
});

gulp.task('build.js.dev', function () {
  var result = gulp.src(PATH.src.ts.concat(PATH.src.test))
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(tsc(tsProject));

  return result.js
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(PATH.dest.dev.all));
});

gulp.task('build.assets.dev', ['build.js.dev'], function () {
  var filterMD = filter('**/*.md');
  return gulp.src(PATH.src.html.concat(PATH.src.css.concat(PATH.src.md)))
    .pipe(filterMD)
    .pipe(markdown())
    .pipe(convertTables())
    .pipe(filterMD.restore())
    .pipe(gulp.dest(PATH.dest.dev.all));
});

gulp.task('build.index.dev', function() {
  var target = gulp.src(injectableDevAssetsRef(), { read: false });
  return gulp.src('./demo/index.html')
    .pipe(inject(target, { transform: transformPath('dev') }))
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

gulp.task('build.ng2.prod', function () {
  ng2Builder.build('angular2/router', join('tmp', 'router.js'), {});
  return ng2Builder.build('angular2/angular2', join('tmp', 'angular2.js'), {});
});

gulp.task('build.lib.prod', ['build.ng2.prod'], function () {
  var jsOnly = filter('**/*.js');
  var lib = gulp.src(PATH.src.lib);
  var ng2 = gulp.src('tmp/angular2.js');
  var router = gulp.src('tmp/router.js');

  return series(lib, ng2, router)
    .pipe(jsOnly)
    .pipe(concat(PATH.dest.prod.ng2))
    .pipe(uglify())
    .pipe(gulp.dest(PATH.dest.prod.lib));
});

gulp.task('build.assets.tmp', function () {
  var filterMD = filter('**/*.md');
  var filterHTML = filter('**/*.html');
  return gulp.src(PATH.src.html.concat(PATH.src.md))
    .pipe(filterMD)
    .pipe(markdown())
    .pipe(convertTables())
    .pipe(filterMD.restore())
    .pipe(filterHTML)
    .pipe(minifyHTML({ conditionals: true }))
    .pipe(filterHTML.restore())
    .pipe(gulp.dest('tmp'));
});

gulp.task('build.js.tmp', ['build.assets.tmp'], function () {
  var result = gulp.src(PATH.src.ts)
    .pipe(plumber())
    .pipe(tsc(tsProject));

  return result.js
    .pipe(inlineTemplates('tmp'))
    .pipe(gulp.dest('tmp'));
});

// TODO: add inline source maps (System only generate separate source maps file).
gulp.task('build.js.prod', ['build.js.tmp'], function() {
  return appProdBuilder.build('demo-app', join(PATH.dest.prod.all, 'demo-app.js'),
    { minify: true }).catch(function (e) { console.log(e); });
});

gulp.task('build.assets.prod', ['build.js.prod'], function () {
  var filterCSS = filter('**/*.css');
  return gulp.src(PATH.src.css)
    .pipe(filterCSS)
    .pipe(minifyCSS())
    .pipe(filterCSS.restore())
    .pipe(gulp.dest(PATH.dest.prod.all));
});

gulp.task('build.index.prod', function() {
  var target = gulp.src([join(PATH.dest.prod.lib, PATH.dest.prod.ng2),
                         join(PATH.dest.prod.all, '**/*.css')], { read: false });
  return gulp.src('./demo/index.html')
    .pipe(inject(target, { transform: transformPath('prod') }))
    .pipe(gulp.dest(PATH.dest.prod.all));
});

gulp.task('build.app.prod', function (done) {
  // build.init.prod does not work as sub tasks dependencies so placed it here.
  runSequence('clean.app.prod', 'build.assets.prod', 'build.index.prod', 'clean.tmp', done);
});

gulp.task('build.prod', function (done) {
  runSequence('clean.prod', 'build.lib.prod', 'clean.tmp', 'build.app.prod', done);
});

// --------------
// Test.
gulp.task('karma-launch', function() {
  karma.start({
    configFile: join(__dirname, 'karma.conf.js')
  });
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

var e2eServer = null;
gulp.task('e2eServer', ['build.dev'], function (done) {
  e2eServer = http.createServer(_startSPA('dev'));
  e2eServer.listen(SERVER_PORT, done);
});
gulp.task('webdriver_update', webdriver_update);
gulp.task('protractor', ['webdriver_update', 'e2eServer'], function (done) {
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
  var src = PATH.src.lib.map(function(path) {
    return join(PATH.dest.dev.lib, path.split('/').pop());
  });
  src.push(PATH.dest.dev.ng2, PATH.dest.dev.router,
           join(PATH.dest.dev.all, '**/*.css'));
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
    return through2.obj(function(file, encoding, done) {
        var content = String(file.contents).replace(/<table>/g, '<table class="table table-bordered">');
        file.contents = new Buffer(content);
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
          var tpl = fs.readFileSync(join(pathPrefix, res[2]), {encoding: 'utf8'}).replace(/\'/g, '\\\'');
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
  console.log(cmd);
  exec(cmd, function(e, stdout) {
    // ignore errors, we don't want to fail the build in the interactive (non-ci) mode
    // karma server will print all test failures
    done();
  });
}
