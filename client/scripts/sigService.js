'use strict';

/* sigService */


angular.module('myApp.services')
   

.service('sigService',  ['$http','$rootScope', '$window', '$q','$log', function ($http, $rootScope, $window, $q, $log) {

  var FileItem = [];
  var DataType = {};
  var Address = {};
  
    this.onLoad = function(reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.resolve(reader.result);
            });
        };
    };

    this.onError = function(reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.reject(reader.result);
            });
        };
    };

    this.onProgress = function(reader, scope) {
        return function (event) {
            /*
            console.log(event.loaded);
            scope.$broadcast("imageProgressLoading",
                {
                    total: event.total,
                    loaded: event.loaded
                });
            */
        };
    };


  this.getReader = function(deferred, scope) {
            console.log('getReader');
            var reader = new FileReader();
            reader.onload = this.onLoad(reader, deferred, scope);
            reader.onerror = this.onError(reader, deferred, scope);
            reader.onprogress = this.onProgress(reader, scope);
            return reader;
   };

    this.readAsDataURL = function(file, scope) {
            console.log('readAsDataURL');
            var deferred = $q.defer();
             
            var reader = this.getReader(deferred, scope);         
            reader.readAsDataURL(file);
             
            return deferred.promise;
        };



  this.setAddress = function(a){
    console.log(a);
    this.Address = a;
  };

  this.getAddress = function(){
    console.log(this.Address);
    return this.Address;
  };

  this.addNewFile = function(fileInfo){
    console.log('sigService addNewFile');
    console.log(fileInfo);
    this.FileItem.push(fileInfo);
  };

  this.setFile = function name(f) {
    console.log('sigService setFile');
    console.log(f);
  };

  this.sayHello = function () {
    console.log('hello');
    return 'Hello';
  };

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
  
  /* geoLocation */

  this.geoLocatoniSupported = function(){
      return 'geolocation' in $window.navigator;
  }

  this.mapLocation = function(position) {
        console.log('mapLocation');
        console.log(position);

        
        var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + position.coords.latitude + "," + position.coords.longitude + "&sensor=true";
        console.log(url);
        return $http.get(url);
        /*
        $http.get(url)
            .then(function(result) {
                var address = result.data.results[2].formatted_address;
                $scope.address = address;
        });
        */
        //return $http.get('http://maps.googleapis.com/maps/api/geocode/json?address=rimini%20via%20n&sensor=false');
 }

  this.getCurrentPosition = function(options) {
      var deferred = $q.defer();
            if(this.geoLocatoniSupported()) {
                    $window.navigator.geolocation.getCurrentPosition(
                        function(position) {
                            $rootScope.$apply(function() {
                                //retVal.position.coords = position.coords;
                                //retVal.position.timestamp = position.timestamp;
                                console.log(position);
                                deferred.resolve(position);
                            });
                        },
                        function(error) {
                            console.log(error);
                            $rootScope.$apply(function() {
                                deferred.reject({error: error});
                            });
                        }, options);
                } else {
                    console.log('geo error');
                    deferred.reject({error: {
                        code: 2,
                        message: 'This web browser does not support HTML5 Geolocation'
                    }});
                }
                return deferred.promise;
  };



  return this;

}]);