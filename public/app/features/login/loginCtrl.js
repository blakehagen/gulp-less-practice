angular.module('gulpPractice').controller('loginCtrl', function ($scope, $state) {


  $scope.me = 'I am the greatest if this works!';
  $scope.name = 'blake';

  $scope.goStore = function () {
    $state.go('store');
  };


});