'use strict';

var gulp                 = require('gulp');
var taskList             = require('gulp-task-listing');
var jshint               = require('gulp-jshint');
var jscs                 = require('gulp-jscs');
var util                 = require('gulp-util');
var gprint               = require('gulp-print');
var gulpif               = require('gulp-if');
var less                 = require('gulp-less');
var autoprefixer         = require('gulp-autoprefixer');
var plumber              = require('gulp-plumber');
var inject               = require('gulp-inject');
var gnodemon             = require('gulp-nodemon');
var imagemin             = require('gulp-imagemin');
var angularTemplateCache = require('gulp-angular-templatecache');
var minifyHtml           = require('gulp-minify-html');
var minifyCss            = require('gulp-minify-css');
var gconcat              = require('gulp-concat');
var uglify               = require('gulp-uglify');
var strip                = require('gulp-strip-debug');
var del                  = require('del');
var args                 = require('yargs').argv;
var browserSync          = require('browser-sync');
var config               = require('./gulp.config')();
var port                 = process.env.PORT || config.defaultPort;

// DEFAULT GULP CHECK  & LIST GULP TASKS //
gulp.task('default', function () {
  log('Hi. I\'m Gulp. Let\'s do this...');
  log('Showing available Gulp tasks...');
  taskList();
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

// COPY IMAGES //
gulp.task('images', ['clean-images'], function () {
  log('Copy and compress images...');
  return gulp.src(config.images)
    .pipe(imagemin({verbose: true}))
    .pipe(gulp.dest(config.buildProduction + 'images'));
});

// CLEAN //
gulp.task('clean', function () {
  var delConfig = [].concat(config.buildProduction, config.temp);
  log('Cleaning: ' + util.colors.blue(delConfig));
  del(delConfig);
});

// CLEAN CODE //
gulp.task('clean-code', function () {
  var files = [].concat(
    config.temp + '**/*.js',
    config.buildProduction + '**/*.html',
    config.buildProduction + 'js/**/*.js'
  );
  clean(files);
});

// CLEAN PROD IMAGES //
gulp.task('clean-images', function () {
  clean(config.buildProduction + 'images/**/*.*');
});

// CLEAN TEMP CSS FOLDER //
gulp.task('clean-styles', function () {
  clean(config.cssDestination);
});

// ADD PREFIXES TO CSS FILES & MOVE TO TEMP //
gulp.task('autoprefixCss', function () {
  log('Adding prefixes to app CSS files...');
  gulp.src(config.appCSS)
    .pipe(gconcat('cssPrefixes.css'))
    .pipe(autoprefixer({browsers: ['last 2 version', '> 5%']}))
    .pipe(gulp.dest(config.cssDestination));
});

// COMPILE VENDOR CSS //
gulp.task('vendorStyles', function () {
  log('Compiling VENDOR LESS --> CSS...');
  return gulp.src(config.less[0])
    .pipe(plumber())
    .pipe(less())
    .pipe(autoprefixer({browsers: ['last 2 version', '> 5%']}))
    .pipe(gulp.dest(config.cssDestination + '/vendor'));
});

// COMPILE APP CSS //
gulp.task('appStyles', function () {
  log('Compiling APP LESS --> CSS...');
  return gulp.src(config.less[1])
    .pipe(plumber())
    .pipe(less())
    .pipe(autoprefixer({browsers: ['last 2 version', '> 5%']}))
    .pipe(gulp.dest(config.cssDestination));
});

// COMPILE CSS //
gulp.task('styles', ['clean-styles','vendorStyles', 'appStyles', 'autoprefixCss'], function () {
  log('Compiling --> --> --> CSS...');
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

// TEMPLATE CACHE & MINIFY HTML //
gulp.task('templateCache', ['clean-code'], function () {
  log('Creating Angular $templateCache...');
  return gulp.src(config.htmlTemplates)
    .pipe(minifyHtml({empty: true}))
    .pipe(angularTemplateCache(
      config.templateCache.file,
      config.templateCache.options
    ))
    .pipe(gulp.dest(config.temp + 'templates'));
});

// CONCAT, STRIP & MINIFY JS  --> PROD //
gulp.task('optimizeJs', function () {
  log('Concat, strip, and minify JS...');
  gulp.src(config.appJS)
    .pipe(gconcat('script.js'))
    .pipe(strip())
    .pipe(uglify())
    .pipe(gulp.dest(config.buildProduction + 'js'));
});

// CONCAT & MINIFY CSS  --> PROD //
gulp.task('optimizeCss', ['styles'], function () {
  log('Concat and minify CSS...');
  gulp.src(config.css)
    .pipe(gconcat('stylesheet.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest(config.buildProduction + 'styles'));
});

// OPTIMIZE PRODUCTION BUILD //
gulp.task('optimize', ['css-inject', 'js-inject', 'templateCache', 'optimizeJs', 'optimizeCss'], function () {
  log('Optimizing production build...');
  var templateCache = config.temp + config.templateCache.file;
  return gulp.src(config.index)
    .pipe(plumber())
    .pipe(inject(gulp.src(templateCache, {read: false}), {starttag: '<!-- inject:templates:js -->'}))
    .pipe(gulp.dest(config.buildProduction));
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