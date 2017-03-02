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

      $log.debug( 'AuthService');
      $log.debug(fullApiEndpoint);
      $log.debug(credentials);
        
      return $http({ 
                    url: fullApiEndpoint, 
                    method: "POST",
                    params: {username: credentials.username, password: credentials.password }
                  })
        .then(function (res) {
            $log.debug('AuthService login then');
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
      
    logout: function (credentials) {
        $log.debug('AuthService logout');
        var fullApiEndpoint = $rootScope.base_url + '/' + ENV.apiLogout; 
        $log.debug(fullApiEndpoint);
      return $http
        .post(fullApiEndpoint, credentials)
        .then(function (res) {
            $log.debug(res);
            $log.debug('AuthService logout: delete JWT');
            delete $localStorage.JWT;
            $log.debug('AuthService logout: remove http header');
            $http.defaults.headers.common.Authorization = '';
            // Session.destroy();
        }).catch(function(response) {
            $log.debug('AuthService logout ERROR');
            $log.debug(response);
            throw new Error('thrown in then');
       });
    },  
      
    isAuthenticated: function () {
        // $log.debug('AuthService isAuthenticated .. check JWT', !!$localStorage.JWT);
        return !!$localStorage.JWT;
    },
      
    isAuthorized: function (authorizedRoles) {
        $log.debug('AuthService isAuthorized');
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