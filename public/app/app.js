angular.module('gulpPractice', ['ui.router', 'templates']).config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider

    .state('login', {
      url: '/',
      templateUrl: './features/login/loginTmpl.html',
      controller: 'loginCtrl'
    });

  $urlRouterProvider
    .otherwise('/');
  
});

angular.module('templates', []);
