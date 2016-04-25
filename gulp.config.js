module.exports = function () {
  var public     = './public/';
  var publicApp  =  public + 'app/';
  var server     = './server/';
  var nodeServer = server + 'server.js';
  var temp       = public + 'temp/';


  var config = {
    temp: temp,
    allJS: [
      './server/**/*.js',
      './public/**/*.js',
      './*.js'
    ],
    public: public,
    css: temp + 'styles.css',
    index: public + 'index.html',
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
    defaultPort: 4400,
    nodeServer: nodeServer,
    server: server,
    less: public + './styles/styles.less'
  };
  return config;
};