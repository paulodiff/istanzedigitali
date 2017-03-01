angular.module('myApp.controllers')
  .controller('SLoginCtrl', 
           ['$scope', 'dialogs', '$auth', '$rootScope', 'AuthService', 'Session', 'Restangular', '$state','ENV', '$log',
    function($scope,   dialogs,   $auth,   $rootScope,   AuthService,   Session,   Restangular,  $state,  ENV ,  $log ) {

    $scope.NTLMLogin = function() {
      $log.debug('NTLMLogin');
      $auth.loginUrl = "/auth/NTLMlogin";
      var options = {  url: '/auth/NTLMlogin' };
      $auth.login($scope.user, options)
        .then(function() {
          dialogs.notify('ok','You have successfully signed in!');
          $state.go('home');
        })
        .catch(function(error) {
          $log.debug('login error:');
          $log.debug(error);
          if (error.data) {
            dialogs.error('Errore',error.data.message);
          } else
            dialogs.error('Errore','Errore generico di accesso');
        });
    };



    $scope.login = function() {
      $log.debug('logginin $auth.login :');
      $auth.login($scope.user)
        .then(function() {
          dialogs.notify('ok','You have successfully signed in!');
          $state.go('home');
        })
        .catch(function(error) {
          $log.debug('login error:');
          $log.debug(error);
          if (error.data) {
            dialogs.error('Errore',error.data.message);
          } else
            dialogs.error('Errore','Errore generico di accesso');
        });
    };

    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function() {
          dialogs.notify('ok','You have successfully signed in with ' + provider + '!');
          $state.go('home');
        })
        .catch(function(error) {
          if (error.error) {
            // Popup error - invalid redirect_uri, pressed cancel button, etc.
            $log.error(error);
            dialogs.error(error);
          } else if (error.data) {
            // HTTP response error from server
            $log.error(error);
            dialogs.error(error);
          } else {
            $log.error(error);
            dialogs.error(error);
          }
        });
    };
  }])

  .controller('SLogoutCtrl', 

           ['$scope', 'dialogs', '$auth', '$rootScope', 'AuthService', 'Session', 'Restangular', '$state','ENV', '$log',
    function($scope,   dialogs,   $auth,   $rootScope,   AuthService,   Session,   Restangular,  $state,  ENV ,  $log ) {

    if (!$auth.isAuthenticated()) { return; }
    $auth.logout()
      .then(function() {
        dialogs.notify('ok','You have been logged out');
        $state.go('home');
      });
  }])

  .controller('SProfileCtrl', 

           ['$scope', 'dialogs', '$auth', '$rootScope', 'AuthService', 'Session', 'Restangular', '$state','ENV', '$log', 'Account',
    function($scope,   dialogs,   $auth,   $rootScope,   AuthService,   Session,   Restangular,  $state,  ENV ,  $log, Account ) {


    $scope.getProfile = function() {
      Account.getProfile()
        .then(function(response) {
          $scope.user = response.data;
        })
        .catch(function(response) {
          dialogs.error('err', response.data.message + response.status);
        });
    };
    $scope.updateProfile = function() {
      Account.updateProfile($scope.user)
        .then(function() {
          dialogs.notify('ok','Profile has been updated');
        })
        .catch(function(response) {
          dialogs.error('err',response.data.message, response.status);
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
  }])


  .controller('SSignupCtrl', 

           ['$scope', 'dialogs', '$auth', '$rootScope', 'AuthService', 'Session', 'Restangular', '$state','ENV', '$log',
    function($scope,   dialogs,   $auth,   $rootScope,   AuthService,   Session,   Restangular,  $state,  ENV ,  $log ) {

    $scope.signup = function() {
      $auth.signup($scope.user)
        .then(function(response) {
          $auth.setToken(response);
          $state.go('home');
          dialogs.notify('You have successfully created a new account and have been signed-in');
        })
        .catch(function(response) {
          console.log(response);
          dialogs.error('Errore','Signup Error');
        });
    };
  }])


.controller('SHomeCtrl', function($scope, $http) {

  $scope.btnCheck = false;

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
  })

  .controller('SNavbarCtrl',

           ['$scope', 'dialogs', '$auth', '$rootScope', 'AuthService', 'Session', 'Restangular', '$state','ENV', '$log',
    function($scope,   dialogs,   $auth,   $rootScope,   AuthService,   Session,   Restangular,  $state,  ENV ,  $log ) {

    $scope.isAuthenticated = function() {
      // return $auth.isAuthenticated();
      return AuthService.isAuthenticated();
    };


    $scope.getUserId = function() {

      if ($auth.isAuthenticated()) {
        return $auth.getPayload().sub.userId;
      } else {
        return '';
      }
      
    };


  }]);    