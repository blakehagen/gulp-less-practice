'use strict';

var gulp                 = require('gulp');
var babel                = require("gulp-babel");
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
var useref               = require('gulp-useref');
var ngAnnotate           = require('gulp-ng-annotate');
var del                  = require('del');
var args                 = require('yargs').argv;
var addStream            = require('add-stream');
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

// // INJECT JS INTO INDEX.HTML //
// gulp.task('js-inject', function () {
//   log('Injecting JS files into index.html...');
//   return gulp.src(config.index)
//     .pipe(inject(gulp.src(config.appJSVendor, {read: false}), {
//       ignorePath: 'public',
//       starttag: '<!-- inject:vendor:js -->'
//     }))
//     .pipe(inject(gulp.src(config.appJS, {read: false}), {ignorePath: 'public'}))
//     .pipe(gulp.dest(config.public));
// });

// // COPY IMAGES //
// gulp.task('images', ['clean-images'], function () {
//   log('Copy and compress images...');
//   return gulp.src(config.images)
//     .pipe(imagemin({verbose: true}))
//     .pipe(gulp.dest(config.build + 'images'));
// });

// // CLEAN //
// gulp.task('clean', function () {
//   var delConfig = [].concat(config.build, config.temp);
//   log('Cleaning: ' + util.colors.blue(delConfig));
//   del(delConfig);
// });

// // CLEAN CODE //
// gulp.task('clean-code', function () {
//   var files = [].concat(
//     config.temp + '**/*.js',
//     config.build + '**/*.html',
//     config.build + 'js/**/*.js'
//   );
//   clean(files);
// });

// CLEAN BUILD FOLDER //
gulp.task('clean-build', function () {
  clean(config.build);
});

// // CLEAN PROD IMAGES //
// gulp.task('clean-images', function () {
//   clean(config.build + 'images/**/*.*');
// });

// // CLEAN TEMP CSS FOLDER //
// gulp.task('clean-styles', function () {
//   clean(config.cssDestination);
// });

// // ADD PREFIXES TO CSS FILES & MOVE TO TEMP //
// gulp.task('autoprefixCss', function () {
//   log('Adding prefixes to app CSS files...');
//   gulp.src(config.appCSS)
//     .pipe(gconcat('stylesWithPrefixes.css'))
//     .pipe(autoprefixer({browsers: ['last 2 version', '> 5%']}))
//     .pipe(gulp.dest(config.cssDestination));
// });

// COMPILE CSS //
// gulp.task('styles', ['clean-styles','autoprefixCss', 'compileStyles' ], function () {
//   log('Compiling --> --> --> CSS...');
// });

// // WATCH LESS FILES FOR CHANGES //
// gulp.task('less-watcher', function () {
//   log('Watching for style changes...');
//   gulp.watch([config.less], ['styles']);
// });

// // INJECT CSS INTO INDEX.HTML //
// gulp.task('css-inject', ['styles'], function () {
//   log('Injecting CSS into index.html...');
//   return gulp.src(config.index)
//     .pipe(inject(gulp.src(config.css, {read: false}), {ignorePath: 'public'}))
//     .pipe(gulp.dest(config.public));
// });

// TEMPLATE CACHE & MINIFY HTML --> BUILD //

function prepareTemplates() {
  return gulp.src(config.htmlTemplates)
    .pipe(minifyHtml({empty: true}))
    .pipe(angularTemplateCache(
      config.templateCache.file,
      config.templateCache.options
    ))
    .pipe(angularTemplateCache());
}

// gulp.task('templateCache', function () {
//   log('Creating Angular $templateCache...');
//   return gulp.src(config.htmlTemplates)
//     .pipe(minifyHtml({empty: true}))
//     .pipe(angularTemplateCache(
//       config.templateCache.file,
//       config.templateCache.options
//     ))
//     .pipe(gulp.dest(config.build + 'templates'));
// });

// CONCAT, STRIP & MINIFY VENDOR JS  --> BUILD //
gulp.task('optimizeVendorJs', function () {
  log('Concat, strip, and minify VENDOR JS...');
  gulp.src(config.appJSVendor)
    .pipe(gconcat('lib.js'))
    .pipe(strip())
    .pipe(uglify())
    .pipe(gulp.dest(config.build + 'js'));
});

// NG-ANNOTATE, CONCAT, STRIP & MINIFY APP JS  --> BUILD //
gulp.task('optimizeAppJs', function () {
  log('Ng-Annotate, Concat, strip, and minify APP JS...');
  gulp.src(config.appJS)
    .pipe(ngAnnotate())
    .pipe(gconcat('app.js'))
    .pipe(addStream.obj(prepareTemplates()))
    .pipe(gconcat('app.js'))
    .pipe(strip())
    .pipe(uglify())
    .pipe(gulp.dest(config.build + 'js'));
});

// OPTIMIZE VENDOR AND APP JS --> BUILD //
gulp.task('optimizeJs', ['optimizeAppJs', 'optimizeVendorJs'], function () {
  log('OPTIMIZING ALL JS...');
});

// COMPILE LESS --> CSS, CONCAT & MINIFY --> BUILD //
gulp.task('compile-less', function () {
  log('Compiling LESS --> CSS...');
  return gulp.src(config.less)
    .pipe(plumber())
    .pipe(less())
    .pipe(gconcat('app.css'))
    .pipe(minifyCss())
    .pipe(autoprefixer({browsers: ['last 2 version', '> 5%']}))
    .pipe(gulp.dest(config.build + 'styles'));
});

// CONCAT & MINIFY VENDOR CSS  --> BUILD //
gulp.task('optimize-vendor-css', function () {
  log('Concat and minify CSS...');
  gulp.src(config.cssVendor)
    .pipe(gconcat('lib.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest(config.build + 'styles'));
});

// CONCAT & MINIFY OTHER CSS  --> BUILD //
gulp.task('optimize-app-css', [], function () {
  log('Concat and minify CSS...');
  gulp.src(config.css)
    .pipe(gconcat('stylesheet.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest(config.build + 'styles'));
});

// INJECT FILES TO BUILD INDEX //
gulp.task('inject', function () {
  log('Injecting assets into build index...');
  // var templateCache = config.build + 'templates/' + config.templateCache.file;
  var jsLib         = config.build + 'js/lib.js';
  var jsApp         = config.build + 'js/app.js';
  var cssLib        = config.build + 'styles/lib.css';
  var cssApp        = config.build + 'styles/app.css';
  var cssStylesheet = config.build + 'styles/stylesheet.css';

  return gulp.src(config.index)
    .pipe(plumber())
    // .pipe(inject(gulp.src(templateCache, {read: false}), {
    //   starttag: '<!-- inject:templates:js -->',
    //   ignorePath: 'build'
    // }))
    .pipe(inject(gulp.src(jsLib, {read: false}), {starttag: '<!-- inject:lib:js -->', ignorePath: 'build'}))
    .pipe(inject(gulp.src(jsApp, {read: false}), {starttag: '<!-- inject:app:js -->', ignorePath: 'build'}))
    .pipe(inject(gulp.src(cssLib, {read: false}), {starttag: '  <!-- inject:lib:css -->', ignorePath: 'build'}))
    .pipe(inject(gulp.src(cssApp, {read: false}), {starttag: '<!-- inject:app:css -->', ignorePath: 'build'}))
    .pipe(inject(gulp.src(cssStylesheet, {read: false}), {
      starttag: '<!-- inject:stylesheet:css -->',
      ignorePath: 'build'
    }))
    .pipe(gulp.dest(config.build));
});

// OPTIMIZE BUILD //
gulp.task('build', ['clean-build', 'optimizeJs', 'optimize-vendor-css', 'compile-less', 'optimize-app-css', 'inject'], function () {
  log('Building the awesomeness...');
});

// // SERVE PRODUCTION BUILD //
// gulp.task('serve-prod', ['optimize'], function () {
//   serve(false); // isDev
// });

// // SERVE DEV //
// gulp.task('serve-dev', ['css-inject', 'js-check', 'js-inject'], function () {
//   serve(true); // isDev
// });


// // // // // // // // // // //
// // UTILITY FUNCTIONS // // //
// // // // // // // // // // //

// function serve(isDev) {
//   console.log('isDev: ', isDev);
//   var nodeOptions = {
//     script: config.nodeServer,
//     delayTime: 1,
//     env: {
//       'NODE_ENV': isDev ? 'dev' : 'production'
//     },
//     watch: [config.server]
//   };
//   return gnodemon(nodeOptions)
//     .on('restart', ['js-check', 'styles'], function (ev) {
//       log('**** nodemon restarted');
//       log('files changed on restart:\n' + ev);
//       setTimeout(function () {
//         browserSync.notify('reloading...');
//         browserSync.reload({stream: false});
//       })
//     })
//     .on('start', function () {
//       log('**** nodemon started');
//       startBrowserSync(isDev);
//     })
//     .on('crash', function () {
//       log('**** nodemon crashed');
//     })
//     .on('exit', function () {
//       log('**** nodemon exited');
//     });
// }

// function changeEvent(event) {
//   var srcPattern = new RegExp('/.*(?=/' + config.source + ')/');
//   log('File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
// }

// function startBrowserSync(isDev) {
//   if (args.nosync || browserSync.active) {
//     return;
//   }
//   log('Starting browserSync on port ' + port);
//
//   if (isDev) {
//     gulp.watch([config.less], ['styles'])
//       .on('change', function (event) {
//         changeEvent(event);
//       });
//   } else {
//     gulp.watch([config.less, config.appJS, config.html], ['optimize', browserSync.reload])
//       .on('change', function (event) {
//         changeEvent(event);
//       });
//   }
//
//   var options = {
//     proxy: 'localhost:' + port,
//     port: 3000,
//     files: isDev ? [config.public + '**/*.*', '!' + config.less, config.temp + '**/*.css'] : [],
//     injectChanges: true,
//     logFileChanges: true,
//     notify: true,
//     reloadDelay: 1000
//   };
//   browserSync(options);
// }

// // ERROR LOG //
// function errorLogger(error) {
//   log('*** ERROR START ***');
//   log(error);
//   log('*** ERROR END ***');
//   this.emit('end');
// }

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