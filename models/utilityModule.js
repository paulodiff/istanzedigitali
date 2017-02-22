var jwt = require('jsonwebtoken');
var moment = require('moment');
var ENV   = require('../config.js'); // load configuration data
var fs = require('fs');

function addZero(x,n) {
      while (x.toString().length < n) {
        x = "0" + x;
      }
    return x;
}

module.exports = {

  test : function(){
    console.log('test');
  },

 pad: function(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  },

  uint8ArrayToBase64Url : function(uint8Array, start, end) {
    start = start || 0;
    end = end || uint8Array.byteLength;

  const base64 = window.btoa(
    String.fromCharCode.apply(null, uint8Array.subarray(start, end)));
  return base64
    .replace(/\=/g, '') // eslint-disable-line no-useless-escape
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  },

// Converts the URL-safe base64 encoded |base64UrlData| to an Uint8Array buffer.
  base64UrlToUint8Array : function(base64UrlData) {
    const padding = '='.repeat((4 - base64UrlData.length % 4) % 4);
    const base64 = (base64UrlData + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const buffer = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
        buffer[i] = rawData.charCodeAt(i);
    }
    return buffer;
    },

  base64_encode: function(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
  },


  ensureAuthenticated : function(req, res, next) {

        //"Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOnsiY29tcGFueU5hbWUiOiJDb211bmVfZGlfUmltaW5pIiwiYXBwIjoicHJvdG9jb2xsbyJ9LCJpYXQiOjE0Nzk5OTkwMzQsImV4cCI6MTU2NjM5NTQzNH0.5Ako1xZ9If5bNrKN3ns8sZ8YaqaJD7FWDt07zcRb8c0"

        console.log('[#AUTH#] ensureAuthenticated ....');
        if (!req.header('Authorization')) {
            console.log('[#AUTH#] ensureAuthenticated : 401 NO TOKEN');
            return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
        }
          var token = req.header('Authorization').split(' ')[1];
         
          // console.log(req.header('Authorization'));
          var payload = null;
          try {
            payload = jwt.decode(token, ENV.secret);
          }
          catch (err) {
            console.log('[#AUTH#] ensureAuthenticated decoded error');
            console.log(err);
            return res.status(401).send({ message: err.message });
          }

          // console.log(payload);

          if(payload){
            if (payload.exp) {
              if (payload.exp <= moment().unix()) {
                console.log('[#AUTH#] token expired');
                return res.status(401).send({ message: 'Token has expired' });
              }
            } else {
              var msg = '[#AUTH#] ensureAuthenticated decoded error - exp NOT FOUND';
              console.log(msg);
              return res.status(401).send({ message: msg });
            }
          } else {
            var msg = '[#AUTH#] ensureAuthenticated decoded error - payload NOT FOUND';
            console.log(msg);
            return res.status(401).send({ message: msg });
          }

          console.log('[#AUTH#] ok pass');
          req.user = payload.sub;
          next();
    },
    
    createJWT: function(user) {
          var payload = {
            sub: user,
            iat: moment().unix(),
            exp: moment().add(1, 'days').unix()
          };
          return jwt.sign(payload, ENV.secret);
    },

    decodeJWT: function(token) {
        //console.log(token);
          var payload = null;
          try {
            payload = jwt.decode(token, ENV.secret);
            if (payload.exp <= moment().unix()) {
              console.log('token expired');
            }
            return payload;
          }
          catch (err) {
            console.log('ensureAuthenticated decoded error');
            console.log(err);
            return {};
          }

          console.log(payload);
    },


    getNowFormatted: function(strTime2Add) {

          var d = new Date(),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();

          if (month.length < 2) month = '0' + month;
          if (day.length < 2) day = '0' + day;
    
          var time = [ d.getHours(), d.getMinutes(), d.getSeconds() ];
          var ms = addZero(d.getMilliseconds(), 3);

          console.log('UtilsService:getNowFormatted');


          var suffix = Math.floor(Math.random()*90000) + 10000;

            for ( var i = 1; i < 3; i++ ) {
              if ( time[i] < 10 ) {
                time[i] = "0" + time[i];
              }
            }

          console.log(time.join(""));  

          var timeFormatted = [year, month, day].join('-');
          if (strTime2Add) {
            timeFormatted = timeFormatted + strTime2Add;
          } 

          // Return the formatted string
          return timeFormatted;
          //return date.join("") + "@" + time.join("") + "@" + suffix;

    },


    getTimestampPlusRandom: function() {

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

            for ( var i = 1; i < 3; i++ ) {
              if ( time[i] < 10 ) {
                time[i] = "0" + time[i];
              }
            }

          

          console.log(time.join(""));  

          // Return the formatted string
          return [year, month, day].join('') + "@" + time.join("") + "@" + ms + "@" + suffix;
          //return date.join("") + "@" + time.join("") + "@" + suffix;
        }
}




/*
// utility Middleware Module
module.exports = function () {
    var module = {};

    module.ensureAuthenticated = function(req, res, next) {
        console.log('ensureAuthenticated');
        if (!req.header('Authorization')) {
            console.log('ensureAuthenticated : 401');
            return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
        }
        var token = req.header('Authorization').split(' ')[1];

          var payload = null;
          try {
            payload = jwt.decode(token, config.TOKEN_SECRET);
          }
          catch (err) {
            console.log(err);
            return res.status(401).send({ message: err.message });
          }

          if (payload.exp <= moment().unix()) {
            console.log('token expired');
            return res.status(401).send({ message: 'Token has expired' });
          }
          console.log('ok next');
          req.user = payload.sub;
          next();
    };



    module.createJWT = function(user) {
          var payload = {
            sub: user._id,
            iat: moment().unix(),
            exp: moment().add(14, 'days').unix()
          };
          return jwt.encode(payload, config.TOKEN_SECRET);
    };

    module.test = function(){
        console.log('module test function');
    };


    // Other stuff...
    module.pickle = function(cucumber, herbs, vinegar) {
        // This will be available 'outside'.
        // Pickling stuff...
    };

    function jarThemPickles(pickle, jar) {
        // This will be NOT available 'outside'.
        // Pickling stuff...

        return pickleJar;
    };

    return module;
};
*/