'use strict';

/* QueueService

    Gestione dei dati tramite una coda 

 */

angular.module('myApp.services')
   
  
.factory('QueueService',           ['ENV', '$http', '$rootScope', '$log', '$localStorage',
                            function ( ENV,   $http,   $rootScope,   $log,   $localStorage) {
  return {


    getData: function() {
         $log.debug('QueueService: getData');
         var fullApiEndpoint = $rootScope.base_url + '/' + ENV.apiQueue + '/getData'; 
         $log.debug('QueueService: api : ' + fullApiEndpoint );
         return $http({ url: fullApiEndpoint,  method: "GET" });
    }

 
  }

}]);

