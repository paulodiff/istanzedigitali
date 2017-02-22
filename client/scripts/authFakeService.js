'use strict';
 
/* Fake Logon Service */

angular.module('myApp.services',[])

.factory('AuthService',  ['ENV', '$http', 'Session', '$rootScope', '$timeout', '$filter', '$q',
                 function (ENV,   $http,   Session,   $rootScope,   $timeout,   $filter,   $q) {
  return {
 
 
    login :  function (credentials) {
            console.log('FAKE_AuthService login');
            var deferred = $q.defer();
            $timeout(function () {
                         Session.create('M00001','MMBREVE','TNK0001',true);
                         deferred.resolve({ success: true });
                        }, 1000);
 
            return deferred.promise;
    },

    isAuthenticated: function () {
        console.log('FAKE_AuthService isAuthenticated');
        return !!Session.id_utenti;
    },
      
    isAuthorized: function (authorizedRoles) {
        console.log('FAKE_AuthService isAuthorized');
      if (!angular.isArray(authorizedRoles)) {
        authorizedRoles = [authorizedRoles];
      }
      return (this.isAuthenticated() &&
        authorizedRoles.indexOf(Session.userRole) !== -1);
    },
 
    logout: function (credentials) {
        console.log('FAKE_AuthService logout');
        console.log( $rootScope.base_url + '/api2/logout');
      return $http
        .post( $rootScope.base_url + '/api2/logout', credentials)
        .then(function (res) {
            console.log('AuthService login then');
            console.log(res);
            console.log(res.data.id_utenti);
            Session.destroy();
        });
    }  

}



}])



.service('Session', function () {
  this.create = function (id_utenti, nome_breve_utenti, token, isAdmin) {
    console.log('Session create id:' + id_utenti);
    console.log('Session nome_breve_utenti:' + nome_breve_utenti);
    console.log('Session token:' + token);
    console.log('Session isAdmin:' + isAdmin);
    this.id_utenti = id_utenti;
    this.nome_breve_utenti = nome_breve_utenti;
    this.token = token;
    this.isAdmin = isAdmin;
  };
  this.destroy = function () {
      console.log('Session destroy');
    this.id_utenti = null;
    this.nome_breve_utenti = null;
    this.token = null;
    this.isAdmin = false;
  };
  return this;
});
