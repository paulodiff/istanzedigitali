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

      $log.info( 'AuthService');
      $log.info(fullApiEndpoint);
      $log.info(checkApiEndpoint);
      $log.info(credentials);
        
      return $http({ 
                    url: fullApiEndpoint, 
                    method: "GET",
                    params: {username: credentials.username, password: credentials.password }
                  })
        .then(function (res) {
            $log.info('AuthService login then');
            $log.info(res);
            $log.info(res.data.token);
            
            $log.info( 'AuthService set JWT to storage');
            $localStorage.JWT = res.data.token;
            $log.info( 'AuthService set http common header');
            $http.defaults.headers.common.Authorization = 'Bearer ' + res.data.token;
            // $localStorage.currentUser = { username: username, token: response.token };
            // add jwt token to auth header for all requests made by the $http service
 
        }).catch(function(response) {
            $log.info('AuthService login ERROR');
            $log.info(response);
            throw new Error('thrown in then');
       });
    },
      
    storeToken: function(token) {
      if(token){
          $log.info('AuthService store token');
          $log.info(token);
          
          $log.info( 'AuthService store set JWT to storage');
          $localStorage.JWT = token;
          $log.info( 'AuthService store set http common header');
          $http.defaults.headers.common.Authorization = 'Bearer ' + token;
      }
    },

    // imposta e ritorna il 
    getRelayStateToken: function(){
          $log.info('AuthService: getRelayStateToken');
          $log.info('AuthService store RelayStateToken to storage');
          $localStorage.RelayStateToken = Math.random() * 100000000000000000;
          return $localStorage.RelayStateToken;
    },

    checkRelayStateToken: function(RelayStateToken){
      $log.info('AuthService: checkRelayStateToken');
      if(RelayStateToken){
        if($localStorage.RelayStateToken){
          if($localStorage.RelayStateToken == RelayStateToken){
            return true;
          }else{
            $log.info('AuthService: checkRelayStateToken <>');
            return false;
          }
        }else{
          $log.info('AuthService: checkRelayStateToken NOT EXIST');
          return false;
        }
      }else{
        $log.info('AuthService: checkRelayStateToken null parameter');
        return false;
      }
    },


    logout: function (credentials) {
        $log.info('AuthService logout');
        var fullApiEndpoint = $rootScope.base_url + '/' + ENV.apiLogoutLDAP; 
        $log.info(fullApiEndpoint);
        /*
        $log.info('AuthService logout: delete JWT');
        delete $localStorage.JWT;
        $log.info('AuthService logout: remove http header');
        $http.defaults.headers.common.Authorization = '';
        */
       
      return $http
        .get(fullApiEndpoint, credentials)
        .then(function (res) {
            $log.info(res);
            delete $localStorage.JWT;
            delete $localStorage.userData;
            $http.defaults.headers.common.Authorization = '';
        }).catch(function(response) {
            $log.info('AuthService logout ERROR');
            $log.info(response);
            delete $localStorage.JWT;
            delete $localStorage.userData;
            $http.defaults.headers.common.Authorization = '';
            throw new Error('thrown in then');
       });
    },  


   loginLDAP: function (credentials) {
      
      var fullApiEndpoint = $rootScope.base_url + '/' + ENV.apiLoginLDAP; 
      
      $log.info( 'AuthServiceNTLM loginLDAP');
      $log.info(fullApiEndpoint);
        
      return $http.post( 
                    fullApiEndpoint, 
                    credentials
                  )
        .then(function (res) {
            $log.info('AuthService login then');
            $log.info(res);
            $log.info(res.data.token);
            
            $log.info( 'AuthService set JWT to storage');
            $localStorage.JWT = res.data.token;

            $log.info( 'AuthService set userData to storage');
            $localStorage.userData = res.data.userData;

            $log.info( 'AuthService set http common header');
            $http.defaults.headers.common.Authorization = 'Bearer ' + res.data.token;
            // $localStorage.currentUser = { username: username, token: response.token };
            // add jwt token to auth header for all requests made by the $http service
 
        }).catch(function(response) {
            $log.info('AuthService login ERROR');
            $log.info(response);
            throw new Error('thrown in then');
       });
    },

   loginNTLM: function () {
      
      var fullApiEndpoint = $rootScope.base_url + '/' + ENV.apiLoginNTLM; 
      
      $log.info( 'AuthServiceNTLM loginNTLM');
      $log.info(fullApiEndpoint);
        
      return $http({ 
                    url: fullApiEndpoint, 
                    method: "POST"
                  })
        .then(function (res) {
            $log.info('AuthService login then');
            $log.info(res);
            $log.info(res.data.token);
            
            $log.info( 'AuthService set JWT to storage');
            $localStorage.JWT = res.data.token;
            $log.info( 'AuthService set http common header');
            $http.defaults.headers.common.Authorization = 'Bearer ' + res.data.token;
            // $localStorage.currentUser = { username: username, token: response.token };
            // add jwt token to auth header for all requests made by the $http service
 
        }).catch(function(response) {
            $log.info('AuthService login ERROR');
            $log.info(response);
            throw new Error('thrown in then');
       });
    },

   loginDEMO: function () {
      
      var fullApiEndpoint = $rootScope.base_url + '/' + ENV.apiLoginDEMO; 
      
      $log.info( 'AuthServiceNTLM loginDEMO');
      $log.info(fullApiEndpoint);
        
      return $http({ 
                    url: fullApiEndpoint, 
                    method: "POST"
                  })
        .then(function (res) {
            $log.info('AuthService login DEMO then');
            $log.info(res);
            $log.info(res.data.token);
            
            $log.info( 'AuthService set JWT to storage');
            $localStorage.JWT = res.data.token;
            $localStorage.userData = res.data;
            $log.info( 'AuthService set http common header');
            $http.defaults.headers.common.Authorization = 'Bearer ' + res.data.token;
            // $localStorage.currentUser = { username: username, token: response.token };
            // add jwt token to auth header for all requests made by the $http service
 
        }).catch(function(response) {
            $log.info('AuthService DEMO login ERROR');
            $log.info(response);
            throw new Error('thrown in then');
       });
    },      

    isAuthenticated: function () {
        // $log.info('AuthService isAuthenticated .. check JWT', !!$localStorage.JWT);

        return !!$localStorage.JWT;
        //return true;

        /*
        // check
        var checkApiEndpoint = $rootScope.base_url + '/' + ENV.apiLoginCheck; 
        if(!!$localStorage.JWT){
            return $http
              .get(checkApiEndpoint)
              .then(function (res) {
                  $log.info(res);
                  $log.info('isAuthenticated failed! remove token!');
                  return false;
              }).catch(function(response) {
                  $log.info('isAuthenticated failed! remove token!');
                  $log.info(response);
                  delete $localStorage.JWT;
                  $http.defaults.headers.common.Authorization = '';
                  return false;
            });
        } else {
          return false;
        }
        */

    },
    
    isAdmin: function () {
        // TODO
        $log.info('AuthService isAdmin');

        
        $log.info( 'AuthService set userData to storage');
        if($localStorage.userData){
          return $localStorage.userData.isAdmin;
        }

        
    },
    

    isAuthorized: function (authorizedRoles) {
        // $log.info('AuthService isAuthorized');
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
    $log.info('Session create ...');
    $log.info(data);
    this.session_data = {};
    this.session_data = data;
  };
  this.destroy = function () {
    $log.info('Session destroy');
    this.session_data = {};
  };
  return this;
}]);