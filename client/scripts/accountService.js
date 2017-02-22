angular.module('myApp.services')
  .factory('Account', function($http) {
    return {
      getProfile: function() {
        return $http.get('/api/s/me');
      },
      updateProfile: function(profileData) {
        return $http.put('/api/s/me', profileData);
      }
    };
  });