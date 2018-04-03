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

          console.log('utilsService: getTimestampPlusRandom');

          // Create a date object with the current time
          var d = new Date(),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();

          if (month.length < 2) month = '0' + month;
          if (day.length < 2) day = '0' + day;
    
          var time = [ d.getHours(), d.getMinutes(), d.getSeconds() ];
          var ms = addZero(d.getMilliseconds(), 3);

          // console.log('UtilsService');
          // console.log(time);

          var suffix = Math.floor(Math.random()*90000) + 10000;

          //time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;
          
          //time[0] = time[0] || 12;

          // If seconds and minutes are less than 10, add a zero
            for ( var i = 1; i < 3; i++ ) {
              if ( time[i] < 10 ) {
                time[i] = "0" + time[i];
              }
            }

          

          // console.log(time.join(""));  

          // Return the formatted string
          return [year, month, day].join('') + "@" + time.join("") + "@" + ms + "@" + suffix;
          //return date.join("") + "@" + time.join("") + "@" + suffix;
        },

      updateProfile: function(profileData) {
        console.log('utilsService: updateProfile');
        return $http.put('/api/s/me', profileData);
      },

     // https://gist.github.com/anvaka/3815296
     // restoredPerson = JSON.parse(jsonString, functionReviver);
     functionReviver: function(key, value) {
        if (key === "") return value;
        
        // console.log('--value--');
        // console.log(value);

        if (typeof value === 'string') {

            var n = value.indexOf("function");
            // console.log(value);   console.log(n);

            if (n >= 0) {
              var lastBrace = value.lastIndexOf("}");
              var firstBrace = value.indexOf("{");
              var lastBrace = value.lastIndexOf("}");
              var firstParentheses = value.indexOf("(");
              var lastParentheses = value.indexOf(")");

              var funcCode = value.substring(firstBrace + 1, lastBrace);
              var funcPars = value.substring(firstParentheses + 1, lastParentheses);

              console.log('--value-func-');
              console.log(value);
              console.log(funcPars);
              console.log(funcCode);

              var args = funcPars.split(',').map(function(arg) { return arg.replace(/\s+/, ''); });
              return new Function(args, funcCode);

            }

            // var rfunc = /function[^\(]*\(([^\)]*)\)[^\{]*{([^\}]*)\}$/;
            // var match = value.match(rfunc);

            // console.log('--match--');        console.log(match);

            /*
            if (match) {
                var args = match[1].split(',').map(function(arg) { return arg.replace(/\s+/, ''); });
                // console.log('--args--');   console.log(args);
                // console.log('--m1--'); console.log(match[1]);
                // console.log('--m2--');  console.log(match[2]);
                return new Function(args, match[2]);
            }
            */
        }
        return value;
    },

      getRandomId: function(){
        console.log('utilsService: getRandomId');
          var text = "";
          var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
          for( var i=0; i < 5; i++ )  text += possible.charAt(Math.floor(Math.random() * possible.length));
            return text;
      }
    };
  });