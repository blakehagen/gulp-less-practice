module.exports = function () {
  var public = './public/';
  var config = {
    temp: './temp/',
    allJS: [
      './server/**/*.js',
      './public/**/*.js',
      './*.js'
    ],
    less: public + './styles/styles.less'
  };
  return config;
};