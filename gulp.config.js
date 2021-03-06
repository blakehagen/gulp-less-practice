module.exports = function () {
  var public     = './public/';
  var publicApp  = public + 'app/';
  var server     = './server/';
  var nodeServer = server + 'server.js';
  var temp       = public + 'temp/';

  var config = {
    allJS: [
      './server/**/*.js',
      './public/**/*.js',
      './*.js'
    ],
    appCSS: [
      public + 'styles/vendor/**/*.css',
      public + 'styles/**/*.css'
    ],
    appJS: [
      // APP.JS //
      publicApp + 'app.js',
      // OTHER JS //
      publicApp + 'features/**/*.js'
    ],
    appJSVendor: [
      // ANGULAR FIRST //
      publicApp + 'vendor/angular/angular.min.js',
      // OTHER 3RD PARTY LIBRARIES //
      publicApp + 'vendor/**/*.js'
    ],
    build: './build/',
    css: public + 'styles/css/*.css',
    cssVendor: public + 'styles/vendor/**/*.css',
    defaultPort: 4400,
    html: public + '**/*.html',
    htmlTemplates: publicApp + '**/*.html',
    images: public + 'assets/*.*',
    index: public + 'index.html',
    less: [
      public + 'styles/vendor/**/*.less',
      public + 'styles/**/*.less'],
    nodeServer: nodeServer,
    public: public,
    server: server,
    temp: temp,
    templateCache: {
      file: 'templates.js',
      options: {
        module: 'gulpPractice',
        standAlone: false,
        root: './'
      }
    }
  };
  return config;
};