angular.module('myApp.controllers')

.controller('homeCtrl', 
           ['$scope', 'dialogs', '$rootScope', 'AuthService', 'Session', '$state','ENV', '$log',
    function($scope,   dialogs,   $rootScope,   AuthService,   Session,   $state,  ENV ,  $log ) {

  $scope.btnCheck = false;
  $scope.goToInviaIstanza = function(){
      console.log('state.go...protocollo');
      $state.go('protocollo');
  }

  }]);

  