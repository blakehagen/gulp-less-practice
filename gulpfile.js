var gulp   = require('gulp');
var jshint = require('gulp-jshint');
var jscs   = require('gulp-jscs');
var util   = require('gulp-util');
var gprint = require('gulp-print');
var gulpif = require('gulp-if');
var args = require('yargs').argv;
var config = require('./gulp.config')();





gulp.task('default', function () {
  console.log('It\'s go time for gulp!');
});

gulp.task('vet', function () {
  log('Checking with jshint and jscs...');
  return gulp.src(config.allJS)
    .pipe(gulpif(args.verbose, gprint()))
    .pipe(jscs())
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish', {verbose: true}))
    .pipe(jshint.reporter('fail'));
});

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

