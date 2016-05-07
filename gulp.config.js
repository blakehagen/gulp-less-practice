module.exports = function () {
  var public     = './public/';
  var publicApp  = public + 'app/';
  var server     = './server/';
  var nodeServer = server + 'server.js';
  var temp       = public + 'temp/';
  var css        = temp + 'styles/';

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
      // ANGULAR FIRST //
      publicApp + 'vendor/angular/angular.min.js',
      // OTHER 3RD PARTY LIBRARIES //
      publicApp + 'vendor/**/*.js',
      // APP.JS //
      publicApp + 'app.js',
      // OTHER JS //
      publicApp + 'features/**/*.js'
    ],
    buildProduction: './production/',
    css: [
      css + 'vendor/**/*.css',
      css + '*.css'
    ],
    cssDestination: css,
    cssVendor: public + 'styles/vendor/**/*.*',
    defaultPort: 4400,
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
        root: 'app/'
      }
    }
  };
  return config;
};