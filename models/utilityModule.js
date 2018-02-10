var jwt = require('jsonwebtoken');
var moment = require('moment');
var ENV   = require('../config/config.js'); // load configuration data
var fs = require('fs');
var crypto = require('crypto');
var request = require('request');

var log4js = require('log4js');
log4js.configure(ENV.log4jsConfig);
var log = log4js.getLogger("app")


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

  base64_decode: function (base64str, file) {
    // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
    var bitmap = new Buffer(base64str, 'base64');
    // write buffer to file
    fs.writeFileSync(file, bitmap);
  },

  ensureAuthenticated : function(req, res, next) {

        //"Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOnsiY29tcGFueU5hbWUiOiJDb211bmVfZGlfUmltaW5pIiwiYXBwIjoicHJvdG9jb2xsbyJ9LCJpYXQiOjE0Nzk5OTkwMzQsImV4cCI6MTU2NjM5NTQzNH0.5Ako1xZ9If5bNrKN3ns8sZ8YaqaJD7FWDt07zcRb8c0"

        console.log('[#AUTH#] ensureAuthenticated (start)');
        if (!req.header('Authorization')) {
            console.log('[#AUTH#] ensureAuthenticated : 401 NO TOKEN');
            return res.status(401).send({ message: 'Effettuare login prima di procedere (401 NO TOKEN)' });
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
                return res.status(401).send({ 
                  title: 'Sessione scaduta',
                  message: 'Sessione scaduta - Disconnettersi e poi rifare la procedura di autenticazione'
                });
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
          req.token = token;
          next();
    },

    notUserDemo: function(req, res, next) {
      console.log('[#AUTH#] notUserDemo ');
      if( req.user.name == 'DEMO'){
        return res.status(401).send({ message: '[#AUTH#] notUserDemo : NOT ALLOWED!' });
      }
      console.log('[#AUTH#] notUserDemo ' + req.user.name);
      next();
    },


    // controllo se esiste e se è corretto il token passato
    checkIfTokenInList: function(req, res, next) {

      log.info('[#AUTH#] checkIfTokenInList ');
      if (!req.header('ISTANZE-API-KEY')) {
        log.error('[#AUTH#] checkIfTokenInList : 401 NO TOKEN');
        return res.status(401).send({ msg: 'Effettuare login prima di procedere (401 NO TOKEN)' });
      }

      var token = req.header('ISTANZE-API-KEY');
       // .set('ISTANZE-API-KEY', 'foobar')
     
      if(token){
        log.info(token);
        var md5Token = crypto.createHash('md5').update(token).digest("hex");
        var fName = ENV.tokenPath + '/' + md5Token;
        log.info('[#AUTH#]checkIfTokenInList...' + fName);
      
        if (!fs.existsSync(fName)) {
              log.error('[#AUTH#] checkIfTokenInList : TOKEN not exists in path');
              return res.status(401).send({ msg: 'Token non presente in lista autorizzazioni' });
        }
        next();
      } else {
          log.error('[#AUTH#] checkIfTokenInList : TOKEN not exists');
          return res.status(402).send({ msg: 'Token non presente' });
      }

    },
    
    createJWT: function(user, timeout1, timeout2) {
          // moment.js syntax 
          timeout1 = timeout1 || 8;
          timeout2 = timeout2 || 'h';
          var payload = {
            sub: user,
            iat: moment().unix(),
            // timeout di 2 ore
            exp: moment().add(timeout1, timeout2).unix()
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

    addTokenToList: function(token) {
      // save file
      var md5Token = crypto.createHash('md5').update(token).digest("hex");
      var fName = ENV.tokenPath + '/' + md5Token;
      console.log('addTokenToList:' + fName);
      fs.writeFileSync(fName, token);

    },
    removeTokenFromList: function(token) {
      var md5Token = crypto.createHash('md5').update(token).digest("hex");
      var fName = ENV.tokenPath + '/' + md5Token;
      console.log('removeTokenFromList...' + fName);
      fs.unlinkSync(fName);
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

          // console.log('UtilsService');
          // console.log(time);

          var suffix = Math.floor(Math.random()*90000) + 10000;

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

    checkAppVersion: function(req, res, next) {
       //"Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOnsiY29tcGFueU5hbWUiOiJDb211bmVfZGlfUmltaW5pIiwiYXBwIjoicHJvdG9jb2xsbyJ9LCJpYXQiOjE0Nzk5OTkwMzQsImV4cCI6MTU2NjM5NTQzNH0.5Ako1xZ9If5bNrKN3ns8sZ8YaqaJD7FWDt07zcRb8c0"

        console.log('[#APPVERSION#] (start)');
        if (!req.header('AppVersion')) {
            console.log('[#APPVERSION#] 401 NO header');
            return res.status(401).send({ message: 'Errore generico nel controllo della versione della app' });
        }
        var token = req.header('AppVersion');
        console.log('header:' + token);
        console.log('server:'+ ENV.app_version);
        var versionInfo =  '(local:' + token + '-remote:'+ ENV.app_version + ')';
        if (token != ENV.app_version ){
          console.log('[#APPVERSION#] ricaricare app versione cambiata');
          return res.status(418).send({ 
            title: 'Stai utilizzanto una versione della applicazione obsoleta',
            message: "La versione della applicazione è stata aggiornata. E' necessario effettuare la disconnessione, chiudere il browser e riaprirlo per ottenere l'applicazione aggiornata. " + versionInfo });
        }

        console.log('[#APPVERSION#] ok pass');
        next();
    },

    emailSend: function(mailOptions){
      var transporter = nodemailer.createTransport(ENV.smtpConfig);
      /*
      var mailOptions = {
                      from: '"Comune di Rimini - Istanze Digitali" <ruggero.ruggeri@comune.rimini.it>', // sender address
                      to: objFieldSanitized.emailRichiedente, // list of receivers
                      subject: 'Promemoria presentazione istanza digitale', 
                      // text: msg, // plaintext body
                      html: htmlResponseMsg // html body
                  };
      */
      return new Promise(function (resolve, reject) {
          transporter.sendMail(mailOptions, function(error, info){
                  if(error){
                          logConsole.error('emailSend ERROR!');
                          logConsole.error(error);
                          reject(error);
                  } else {
                          logConsole.info('Email sent!');
                          resolve('Email Sent!');
                      }
                  });
              });   
    },

    /* Funzione di verifica per Captch di Google */
    verifyReCaptcha: function(ReCaptcha) {

      console.log('verifyReCaptcha');
      return new Promise(function (resolve, reject) {

        if (!ReCaptcha) {
          console.log('[#AUTH#] verifyReCaptcha : 401 NO TOKEN');
          reject({ msg: 'Effettuare login prima di procedere (401 NO TOKEN)' });
        }

        var data = {
            secret: ENV.recaptchaSecret, 
            response: ReCaptcha
        };
       
      
        var url = 'https://www.google.com/recaptcha/api/siteverify';
        console.log('verifyReCaptcha:url', url);

        var options = {
            uri: url,
            method: 'POST',
            proxy: ENV.proxy_url,
            json: true,
            qs: data
        };

        request(options, function (error, response, body) {
            if (error) {
                console.log('verifyReCaptcha:Errore invio richiesta ...');
                console.log(error);
                reject(error);
            }
            if (!error && response.statusCode == 200) {
                console.log('verifyReCaptcha:Errore risposta:');
                console.log(response.body);
                if(response.body.success){
                    resolve(response);
                } else {
                    reject(response);
                }
            } else {
                console.log('verifyReCaptcha GENERICO invio richiesta ...', response);
                reject(response);
            }
        });
    });
  }



}

/*

      var transporter = nodemailer.createTransport(ENV_PROT.smtpConfig);
                    var mailOptions = {
                        from: '"Comune di Rimini - Istanze Digitali" <ruggero.ruggeri@comune.rimini.it>', // sender address
                        to: objFieldSanitized.emailRichiedente, // list of receivers
                        subject: 'Promemoria presentazione istanza digitale', 
                        // text: msg, // plaintext body
                        html: htmlResponseMsg // html body
                    };
                    transporter.sendMail(mailOptions, function(error, info){
                        if(error){
                            log.error(reqId);
                            log.error(err);
                            ErrorMsg = {
                            title: 'Errore di protocollo',
                                msg: 'Errore durante invio mail. ' + supportMsg,
                                code : 459
                            }
                            callback(ErrorMsg, null);
                        } else {
                            log.info('Email sent!');
                            callback(null, 'Invio mail ... ok');
                        }
                    });
              

*/

/*

   function(callback){
                log.info('ASYNC Gmail Recaptcha ...:');
                var RecaptchaResponse = 'NULL';

                if(objFieldList['fields[RecaptchaResponse]'] && objFieldList['fields[RecaptchaResponse]'][0] ){
                    console.log(objFieldList['fields[RecaptchaResponse]'][0]);
                    var RecaptchaResponse = objFieldList['fields[RecaptchaResponse]'][0];
                }
                

                console.log('ASYNC:TEST:',RecaptchaResponse);
                ErrorMsg = {
                                            title: 'Errore controllo ReCaptcha',
                                            msg: 'Si è verificato un errore nel controllo del codice antifrode ReCaptcha. ' + supportMsg,
                                            reqId: reqId,
                                            code : 480
                            };
                console.log(req.body);

                if(fakeConfig.captCha == 1) {

                    verifyReCaptcha(RecaptchaResponse).then(function (result) {
                            if (result.statusCode == 200) {
                                log.info('Gmail Recaptcha OK!');
                                // console.log(result.response);
                                callback(null, 'Gmail Recaptcha OK!');
                            } else {
                                //console.log(result);
                            log.error('Gmail Recaptcha ERROR! code:' + result.statusCode);
                            callback(ErrorMsg, null);
                            }
                        }).catch(function (err) {
                            // console.log(err);
                            log.error('Gmail Recaptcha ERRORE GENERICO!');
                            log.error(err);
                            callback(ErrorMsg, null);
                        });

                }

            
                if(fakeConfig.captCha == 0) {
                    log.info('ASYNC Gmail Recaptcha DISABLED!!! - OK:');
                    callback(null, 'Gmail Recaptcha ... DISABLED ok');
                }

                if(fakeConfig.captCha == 2) {
                    log.info('ASYNC Gmail Recaptcha TEST ERROR !!! - OK:');
                    callback(ErrorMsg, null);
                }

        },
*/


