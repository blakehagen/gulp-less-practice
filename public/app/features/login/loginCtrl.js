angular.module('gulpPractice').controller('loginCtrl', function ($scope, $state) {


  $scope.me = 'I am awesome';

  $scope.goStore = function () {
    $state.go('store');
  }


});