'use strict';

/* ProfileService

    Gestione dei dati di profilo

 */

angular.module('myApp.services')
   
  
.factory('ProfileService',           ['ENV', '$http', '$rootScope', '$log', '$localStorage',
                            function ( ENV,   $http,   $rootScope,   $log,   $localStorage) {
  return {

    getProfile1: function() {
        var deferred = $q.defer();
        var promise = deferred.promise;

        $log.debug('ProfileService: getProfile');
        var fullApiEndpoint = $rootScope.base_url + '/' + ENV.apiProfile; 
        $log.debug('ProfileService: api : ' + fullApiEndpoint );

         return $http({ 
                    url: fullApiEndpoint, 
                    method: "GET"
                  })
        .then(function (res) {
            $log.debug('profileMgrCtrl : setting data');
            $log.debug(res.data);
            $scope.user = res.data;
         })
        .catch(function(response) {
            console.log(response);
        });

    },


    getProfile: function() {
         $log.debug('ProfileService: getProfile');
         var fullApiEndpoint = $rootScope.base_url + '/' + ENV.apiProfile; 
         $log.debug('ProfileService: api : ' + fullApiEndpoint );
         return $http({ url: fullApiEndpoint,  method: "GET" });
    }

 
  }

}]);

