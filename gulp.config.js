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
    css: temp + 'styles.css',
    defaultPort: 4400,
    htmlTemplates: publicApp + '**/*.html',
    images: public + 'assets/*.*',
    index: public + 'index.html',
    less: public + './styles/**/*.less',
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