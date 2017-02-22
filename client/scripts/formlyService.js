angular.module('myApp.services')
  .factory('FormlyService', function($http) {
    return {
      getFormly: function() {
        return $http.get('/api/s/me');
      },
      updateFormly: function(data) {
        return $http.put('/api/seq/me', data);
      },
      createFormly: function(data) {
        return $http.post('/api/seq/create', data);
      },
      mapFormly : function(data) {
        console.log(data);
        return $http.get('http://maps.googleapis.com/maps/api/geocode/json?address=rimini%20via%20n&sensor=false');
      }
    };
  });