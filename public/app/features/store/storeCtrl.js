angular.module('gulpPractice').controller('storeCtrl', function ($scope) {
  
  $scope.test = function () {
    $scope.hello = ('hello world!!!!');
  };

  $scope.test();

});