
angular.module('gulpPractice', ['ui.router']).config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider

    .state('login', {
      url: '/',
      templateUrl: './login/loginTmpl.html',
      controller: 'loginCtrl'
    });

  $urlRouterProvider
    .otherwise('/');
  
});