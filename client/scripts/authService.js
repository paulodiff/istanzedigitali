'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.

angular.module('myApp.services', [])
   
  .service('VersionService', [function() {
      return '1.0.2';
  }])


.factory('AuthService',           ['ENV', '$http', 'Session', '$rootScope', '$log', '$localStorage',
                         function ( ENV,   $http,   Session,   $rootScope,   $log,   $localStorage) {
  return {

    login: function (credentials) {
      
      var fullApiEndpoint = $rootScope.base_url + '/' + ENV.apiLogin; 
      var checkApiEndpoint = $rootScope.base_url + '/' + ENV.apiLoginCheck; 

      $log.debug( 'AuthService');
      $log.debug(fullApiEndpoint);
      $log.debug(checkApiEndpoint);
      $log.debug(credentials);
        
      return $http({ 
                    url: fullApiEndpoint, 
                    method: "GET",
                    params: {username: credentials.username, password: credentials.password }
                  })
        .then(function (res) {
            $log.debug('AuthService login then');
            $log.debug(res);
            $log.debug(res.data.token);
            
            $log.debug( 'AuthService set JWT to storage');
            $localStorage.JWT = res.data.token;
            $log.debug( 'AuthService set http common header');
            $http.defaults.headers.common.Authorization = 'Bearer ' + res.data.token;
            // $localStorage.currentUser = { username: username, token: response.token };
            // add jwt token to auth header for all requests made by the $http service
 
        }).catch(function(response) {
            $log.debug('AuthService login ERROR');
            $log.debug(response);
            throw new Error('thrown in then');
       });
    },
      
    storeToken: function(token) {
      if(token){
          $log.debug('AuthService store token');
          $log.debug(token);
          
          $log.debug( 'AuthService store set JWT to storage');
          $localStorage.JWT = token;
          $log.debug( 'AuthService store set http common header');
          $http.defaults.headers.common.Authorization = 'Bearer ' + token;
      }
    },

    // imposta e ritorna il 
    getRelayStateToken: function(){
          $log.debug('AuthService: getRelayStateToken');
          $log.debug('AuthService store RelayStateToken to storage');
          $localStorage.RelayStateToken = Math.random() * 100000000000000000;
          return $localStorage.RelayStateToken;
    },

    checkRelayStateToken: function(RelayStateToken){
      $log.debug('AuthService: checkRelayStateToken');
      if(RelayStateToken){
        if($localStorage.RelayStateToken){
          if($localStorage.RelayStateToken == RelayStateToken){
            return true;
          }else{
            $log.debug('AuthService: checkRelayStateToken <>');
            return false;
          }
        }else{
          $log.debug('AuthService: checkRelayStateToken NOT EXIST');
          return false;
        }
      }else{
        $log.debug('AuthService: checkRelayStateToken null parameter');
        return false;
      }
    },


    logout: function (credentials) {
        $log.debug('AuthService logout');
        var fullApiEndpoint = $rootScope.base_url + '/' + ENV.apiLogout; 
        $log.debug(fullApiEndpoint);
        /*
        $log.debug('AuthService logout: delete JWT');
        delete $localStorage.JWT;
        $log.debug('AuthService logout: remove http header');
        $http.defaults.headers.common.Authorization = '';
        */
       
      return $http
        .get(fullApiEndpoint, credentials)
        .then(function (res) {
            $log.debug(res);
            delete $localStorage.JWT;
            $http.defaults.headers.common.Authorization = '';
        }).catch(function(response) {
            $log.debug('AuthService logout ERROR');
            $log.debug(response);
            delete $localStorage.JWT;
            $http.defaults.headers.common.Authorization = '';
            throw new Error('thrown in then');
       });
    },  
      
    isAuthenticated: function () {
        // $log.debug('AuthService isAuthenticated .. check JWT', !!$localStorage.JWT);

        return !!$localStorage.JWT;
        //return true;

        /*
        // check
        var checkApiEndpoint = $rootScope.base_url + '/' + ENV.apiLoginCheck; 
        if(!!$localStorage.JWT){
            return $http
              .get(checkApiEndpoint)
              .then(function (res) {
                  $log.debug(res);
                  $log.debug('isAuthenticated failed! remove token!');
                  return false;
              }).catch(function(response) {
                  $log.debug('isAuthenticated failed! remove token!');
                  $log.debug(response);
                  delete $localStorage.JWT;
                  $http.defaults.headers.common.Authorization = '';
                  return false;
            });
        } else {
          return false;
        }
        */

    },
    
    isAuthorized: function (authorizedRoles) {
        // $log.debug('AuthService isAuthorized');
      if (!angular.isArray(authorizedRoles)) {
        authorizedRoles = [authorizedRoles];
      }
      return (this.isAuthenticated() &&
        authorizedRoles.indexOf(Session.userRole) !== -1);
    }
  };
}])

.service('Session',  ['$log', function ($log) {
  this.create = function (data) {
    $log.debug('Session create ...');
    $log.debug(data);
    this.session_data = {};
    this.session_data = data;
  };
  this.destroy = function () {
    $log.debug('Session destroy');
    this.session_data = {};
  };
  return this;
}]);