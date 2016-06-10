angular.module('gulpPractice', ['ui.router', 'templates']).config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider

    .state('login', {
      url: '/',
      templateUrl: './features/login/loginTmpl.html',
      controller: 'loginCtrl'
    })

    .state('store', {
      url: '/store',
      templateUrl: './features/store/storeTmpl.html',
      controller: 'storeCtrl'
    });

  $urlRouterProvider
    .otherwise('/');

});

angular.module('templates', []);
