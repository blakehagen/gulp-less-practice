module.exports = function () {
  var public    = './public/';
  var publicApp = public + 'app/';
  var temp = './temp/';


  var config    = {
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
      publicApp + './*.js',
      publicApp + '**/*.js'
    ],
    less: public + './styles/styles.less'
  };
  return config;
};