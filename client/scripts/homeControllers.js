angular.module('myApp.controllers')

.controller('homeCtrl', 
           ['$scope', 'dialogs', '$auth', '$rootScope', 'AuthService', 'Session', 'Restangular', '$state','ENV', '$log',
    function($scope,   dialogs,   $auth,   $rootScope,   AuthService,   Session,   Restangular,  $state,  ENV ,  $log ) {

  $scope.btnCheck = false;
  $scope.goToInviaIstanza = function(){
      console.log('state.go...protocollo');
      $state.go('protocollo');
  }

  /*
    $http.jsonp('https://api.github.com/repos/sahat/satellizer?callback=JSON_CALLBACK')
      .success(function(data) {
        if (data) {
          if (data.data.stargazers_count) {
            $scope.stars = data.data.stargazers_count;
          }
          if (data.data.forks) {
            $scope.forks = data.data.forks;
          }
          if (data.data.open_issues) {
            $scope.issues = data.data.open_issues;
          }
        }
      });
      */
  }]);

  