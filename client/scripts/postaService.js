'use strict';

/* PostaService

    Gestione dei dati della posta

 */

angular.module('myApp.services')
   
  
.factory('PostaService',             ['ENV', '$http', '$rootScope', '$log', '$localStorage',
                            function ( ENV,   $http,   $rootScope,   $log,   $localStorage) {
  return {

    getPostaList: function(options) {
        var deferred = $q.defer();
        var promise = deferred.promise;

        $log.info('PostaService: getPostaList');
        var fullApiEndpoint = $rootScope.base_url + '/' + ENV.apiPosta; 
        $log.info('PostaService: api : ' + fullApiEndpoint );
        return $http({ 
                    url: fullApiEndpoint, 
                    method: "GET"
                  })
            .then(function (res) {
                $log.info('profileMgrCtrl : setting data');
                $log.info(res.data);
                $scope.user = res.data;
            })
            .catch(function(response) {
                console.log(response);
            });
    },


    getPosta: function(obj) {
         $log.info('PostaService: getProfile');
         var fullApiEndpoint = $rootScope.base_url + '/' + ENV.apiPosta; 
         $log.info('PostaService: api : ' + fullApiEndpoint );
         return $http({ url: fullApiEndpoint,  method: "GET" });
    },

    updatePosta: function(obj) {
             $log.info('PostaService: getProfile');
         var fullApiEndpoint = $rootScope.base_url + '/' + ENV.apiProfile; 
         $log.info('PostaService: api : ' + fullApiEndpoint );
         return $http({ url: fullApiEndpoint,  method: "GET" });
    }


 
  }

}]);

