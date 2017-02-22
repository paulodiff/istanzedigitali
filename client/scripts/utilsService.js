angular.module('myApp.services')
  .factory('UtilsService', function($http) {

    function addZero(x,n) {
      while (x.toString().length < n) {
        x = "0" + x;
      }
    return x;
    }


    return {
      getTimestampPlusRandom: function() {

          // Create a date object with the current time
          var d = new Date(),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();

          if (month.length < 2) month = '0' + month;
          if (day.length < 2) day = '0' + day;
    
          var time = [ d.getHours(), d.getMinutes(), d.getSeconds() ];
          var ms = addZero(d.getMilliseconds(), 3);

          console.log('UtilsService');
          console.log(time);

          var suffix = Math.floor(Math.random()*90000) + 10000;

          //time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;
          
          //time[0] = time[0] || 12;

          // If seconds and minutes are less than 10, add a zero
            for ( var i = 1; i < 3; i++ ) {
              if ( time[i] < 10 ) {
                time[i] = "0" + time[i];
              }
            }

          

          console.log(time.join(""));  

          // Return the formatted string
          return [year, month, day].join('') + "@" + time.join("") + "@" + ms + "@" + suffix;
          //return date.join("") + "@" + time.join("") + "@" + suffix;
        },

      updateProfile: function(profileData) {
        return $http.put('/api/s/me', profileData);
      },

      getRandomId: function(){
          var text = "";
          var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
          for( var i=0; i < 5; i++ )  text += possible.charAt(Math.floor(Math.random() * possible.length));
            return text;
      }
    };
  });