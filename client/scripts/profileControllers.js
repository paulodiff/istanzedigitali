angular.module('myApp.controllers')

  .controller('profileMgrCtrl', 

           ['$scope', '$http', 'dialogs',  '$rootScope', 'AuthService', 'ProfileService', '$state','ENV', '$log','usSpinnerService',
    function($scope,   $http,  dialogs,     $rootScope,   AuthService,   ProfileService, $state,  ENV ,  $log, usSpinnerService ) {

        $scope.user = {};

    $scope.getProfile = function() {

        $log.debug('profileMgrCtrl: getProfile');
        usSpinnerService.spin('spinner-1');
        
        ProfileService.getProfile().then(function (res) {
            $log.debug('profileMgrCtrl : setting data');
            $log.debug(res.data);
            $scope.user = res.data;
             usSpinnerService.stop('spinner-1');
         })
        .catch(function(response) {
            usSpinnerService.stop('spinner-1');
            console.log(response);
            var dlg = dialogs.error(response.data.title, response.data.message, {});
					  dlg.result.then(function(btn){
                        $state.go('login');
						$scope.confirmed = 'You confirmed "Yes."';
					},function(btn){
                        $state.go('login');
						$scope.confirmed = 'You confirmed "No."';
					});
       
        });

    };


    $scope.updateProfile = function() {
        $log.debug('profileMgrCtrl: updateProfile');
        var fullApiEndpoint = $rootScope.base_url + '/' + ENV.apiProfile;
        $log.debug('profileMgrCtrl: api : ' + fullApiEndpoint );
        $http.put(fullApiEndpoint, $scope.user)
            .then(function (res) {
                dialogs.notify('ok','Profile has been updated');
                $log.debug(res);
                // $scope.user = res.data.user;
         }).catch(function(response) {
                    var dlg = dialogs.confirm(response.data.message, response.status);
					dlg.result.then(function(btn){
						$scope.confirmed = 'You confirmed "Yes."';
					},function(btn){
						$scope.confirmed = 'You confirmed "No."';
					});
       
        });
   
    };

    $scope.link = function(provider) {
      $auth.link(provider)
        .then(function() {
          dialogs.notify('You have successfully linked a ' + provider + ' account');
          $scope.getProfile();
        })
        .catch(function(response) {
          dialogs.error(response.data.message, response.status);
        });
    };

    $scope.unlink = function(provider) {
      $auth.unlink(provider)
        .then(function() {
          dialogs.notify('You have unlinked a ' + provider + ' account');
          $scope.getProfile();
        })
        .catch(function(response) {
          dialogs.error(response.data ? response.data.message : 'Could not unlink ' + provider + ' account', response.status);
        });
    };

    $scope.getProfile();
  }]);


 


