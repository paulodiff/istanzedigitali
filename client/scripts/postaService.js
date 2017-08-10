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
         $log.info('PostaService: getPosta');
         var fullApiEndpoint = $rootScope.base_url + '/' + ENV.apiPosta; 
         $log.info('PostaService: api : ' + fullApiEndpoint );
         return $http({ url: fullApiEndpoint,  method: "GET", params: obj });
    },

    updatePosta: function(obj) {
         $log.info('PostaService: updatePosta');
         var fullApiEndpoint = $rootScope.base_url + '/' + ENV.apiPosta; 
         $log.info('PostaService: api : ' + fullApiEndpoint );
         return  $http.put(fullApiEndpoint, obj);
    },

    addPosta: function(obj) {
         $log.info('PostaService: addPosta');
         var fullApiEndpoint = $rootScope.base_url + '/' + ENV.apiPosta; 
         $log.info('PostaService: api : ' + fullApiEndpoint );
         return $http.post(fullApiEndpoint, obj);
    },

    deletePosta: function(objId) {
         $log.info('PostaService: deletePosta');
         // var fullApiEndpoint = $rootScope.base_url + '/' + ENV.apiPosta; 
         var fullApiEndpoint = $rootScope.base_url +  '/postamgr/posta/' + objId;
         $log.info('PostaService: deletePosta : ' + fullApiEndpoint );
         return $http.delete(fullApiEndpoint);
    },

    getPostaStats: function(obj) {
         $log.info('PostaService: getPostaStats', obj);
         // var fullApiEndpoint = $rootScope.base_url + '/' + ENV.apiPosta; 
         var fullApiEndpoint = $rootScope.base_url +  '/postamgr/stats';
         $log.info('PostaService: getPostaStats : ' + fullApiEndpoint );
         return $http({ url: fullApiEndpoint,  method: "GET", params: obj });
    },

    getCDC: function() {
         $log.info('PostaService: getCDC');
         var fullApiEndpoint = $rootScope.base_url + '/' + ENV.apiPostaCDC; 
         $log.info('PostaService: api : ' + fullApiEndpoint );
         return $http({ url: fullApiEndpoint,  method: "GET" });
    },

     addCDC: function(obj) {
         $log.info('PostaService: addCDC');
         var fullApiEndpoint = $rootScope.base_url + '/' + ENV.apiPostaCDC; 
         $log.info('PostaService: api : ' + fullApiEndpoint );
         return $http.post(fullApiEndpoint, obj);
    }

/*
$http.post(url2post, newItem)
            .then(function (res) {
                // dialogs.notify('ok','Profile has been updated');
                $scope.gridOptions.data.push(newItem);
                $log.debug(res);
                // $scope.user = res.data.user;
         }).catch(function(response) {
           $log.debug(response);
           var dlg = dialogs.error(response.data.title, response.data.message);
        });
  };
*/
 
  }

}]);

