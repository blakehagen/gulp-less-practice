var gulp   = require('gulp');
var jshint = require('gulp-jshint');
var jscs   = require('gulp-jscs');
var util   = require('gulp-util');
var gprint = require('gulp-print');
var gulpif = require('gulp-if');
var less = require('gulp-less');
var config = require('./gulp.config')();
var autoprefixer = require('gulp-autoprefixer');
var del = require('del');
var args = require('yargs').argv;

// DEFAULT GULP CHECK //
gulp.task('default', function () {
  console.log('It\'s go time for gulp!');
});

//  CHECK ALL JS CODE WITH JSHINT & JSCS //
gulp.task('check-js', function () {
  log('Checking JS files with jshint and jscs...');
  return gulp.src(config.allJS)
    .pipe(gulpif(args.verbose, gprint()))
    .pipe(jscs())
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish', {verbose: true}))
    .pipe(jshint.reporter('fail'));
});

// COMPILE CSS //
gulp.task('styles', ['clean-styles'], function () {
  log('Compiling LESS --> CSS...');
  return gulp.src(config.less)
    .pipe(less())
    .pipe(autoprefixer({browsers: ['last 2 version', '> 5%']}))
    .pipe(gulp.dest(config.temp));
});

// CLEAN TEMP CSS FOLDER //
gulp.task('clean-styles', function () {
  var files = config.temp + '**/*.css';
  clean(files);
});

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