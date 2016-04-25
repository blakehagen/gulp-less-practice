'use strict';

var gulp         = require('gulp');
var jshint       = require('gulp-jshint');
var jscs         = require('gulp-jscs');
var util         = require('gulp-util');
var gprint       = require('gulp-print');
var gulpif       = require('gulp-if');
var less         = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var plumber      = require('gulp-plumber');
var inject       = require('gulp-inject');
var gnodemon     = require('gulp-nodemon');
var del          = require('del');
var args         = require('yargs').argv;
var browserSync  = require('browser-sync');
var config       = require('./gulp.config')();
var port         = process.env.PORT || config.defaultPort;

// DEFAULT GULP CHECK //
gulp.task('default', function () {
  log('Hi. I\'m Gulp. Let\'s build this...');
});

//  CHECK ALL JS CODE WITH JSHINT & JSCS //
gulp.task('js-check', function () {
  log('Checking JS files with jshint and jscs...');
  return gulp.src(config.appJS)
    .pipe(gulpif(args.verbose, gprint()))
    .pipe(jscs())
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish', {verbose: true}))
    .pipe(jshint.reporter('fail'));
});

// INJECT JS INTO INDEX.HTML //
gulp.task('js-inject', function () {
  log('Injecting JS files into index.html...');
  return gulp.src(config.index)
    .pipe(inject(gulp.src(config.appJS, {read: false}), {ignorePath: 'public'}))
    .pipe(gulp.dest(config.public));
});

// CLEAN TEMP CSS FOLDER //
gulp.task('clean-styles', function () {
  var files = config.temp + '**/*.css';
  clean(files);
});

// COMPILE CSS //
gulp.task('styles', ['clean-styles'], function () {
  log('Compiling LESS --> CSS...');
  return gulp.src(config.less)
    .pipe(plumber())
    .pipe(less())
    .pipe(autoprefixer({browsers: ['last 2 version', '> 5%']}))
    .pipe(gulp.dest(config.temp));
});

// WATCH LESS FILES FOR CHANGES //
gulp.task('less-watcher', function () {
  log('Watching for style changes...');
  gulp.watch([config.less], ['styles']);
});

// INJECT CSS INTO INDEX.HTML //
gulp.task('css-inject', ['styles'], function () {
  log('Injecting CSS into index.html...');
  return gulp.src(config.index)
    .pipe(inject(gulp.src(config.css, {read: false}), {ignorePath: 'public'}))
    .pipe(gulp.dest(config.public));
});

// SERVE-DEV //
gulp.task('serve-dev', ['js-check', 'js-inject', 'css-inject'], function () {
  var isDev       = true;
  var nodeOptions = {
    script: config.nodeServer,
    delayTime: 1,
    env: {
      'NODE_ENV': isDev ? 'dev' : 'prod'
    },
    watch: ['./server']
  }
  return gnodemon(nodeOptions)
    .on('restart', ['js-check'], function (ev) {
      log('**** nodemon restarted');
      log('files changed on restart:\n' + ev);
    })
    .on('start', function () {
      log('**** nodemon started');
      startBrowserSync();
    })
    .on('crash', function () {
      log('**** nodemon crashed');
    })
    .on('exit', function () {
      log('**** nodemon exited');
    });
});


// // // // // // // // // // //
// // UTILITY FUNCTIONS // // //
// // // // // // // // // // //

function startBrowserSync() {
  if (browserSync.active) {
    return;
  }
  log('Starting browserSync on port ' + port);
  var options = {
    proxy: 'localhost:' + port,
    port: 3000,
    files: [config.public + '**/*.*'],
    injectChanges: true,
    logFileChanges: true,
    // logLevel: 'debug',
    // logPrefix: 'gulp-patterns',
    notify: true,
    reloadDelay: 1000
  };
  browserSync(options);
}

// ERROR LOG //
function errorLogger(error) {
  log('*** ERROR START ***');
  log(error);
  log('*** ERROR END ***');
  this.emit('end');
}

// LOG FUNCTION //
function log(msg) {
  if (typeof (msg) === 'object') {
    for (var item in msg) {
      if (msg.hasOwnProperty(item)) {
        util.log(util.colors.blue(msg[item]));
      }
    }
  } else {
    util.log(util.colors.blue(msg));
  }
}

// FUNCTION TO CLEAN FILES //
function clean(path) {
  log('Cleaning: ' + util.colors.blue(path));
  del(path);
}