var jwt = require('jsonwebtoken');
var moment = require('moment');
var ENV   = require('../config/config.js'); // load configuration data
var fs = require('fs');
var crypto = require('crypto');
var constants = require('constants');
var request = require('request');

var log4js = require('log4js');
log4js.configure(ENV.log4jsConfig);
var log = log4js.getLogger("app")
var base64url = require('base64url');


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

  // https://stackoverflow.com/questions/8750780/encrypting-data-with-public-key-in-node-js
  encryptStringWithRsaPrivateKey64: function(toEncrypt) {
    var privateKey = fs.readFileSync(ENV.privateKey, "utf8");
    var buffer = new Buffer(toEncrypt);
    var encrypted = crypto.privateEncrypt(privateKey, buffer);
    var encrypted64 = base64url(encrypted);
    console.log('[#ENC64#]', toEncrypt);
    console.log('[#ENC64#]', encrypted);
    console.log('[#ENC64#]', encrypted64);
    return encrypted64;
  },

  decryptStringWithRsaPrivateKey64: function(toDecrypt) {

  /*
    console.log('[##DEC64#] ', toDecrypt);
    var buffer1 = new Buffer(txt2crypt);
    var privateKey = fs.readFileSync(ENV.privateKey, "utf8");
    var encrypted = crypto.privateEncrypt(privateKey, buffer1);
    console.log('[##DEC64#]', encrypted);
    console.log('[##DEC64#]', encrypted.toString());
    console.log('[##DEC64#]', encrypted.toString("base64"));
  
    var land = encrypted.toString("base64");

    // console.log('[##DEC64#]', encrypted64);
    // var decoded64 = base64url.decode(encrypted64)
    // console.log('[##DEC64#]', decoded64);

    var buffer2 = new Buffer(land, "base64");

    var obj = {
      key: privateKey,
      padding: constants.RSA_PKCS1_PADDING
    };

    var decrypted = crypto.privateDecrypt(privateKey, buffer2);
    console.log('[##DEC64#]', decrypted);
  */

  var privateKey = fs.readFileSync(ENV.privateKey, "utf8");
  var publicKey = fs.readFileSync(ENV.publicKey, "utf8");

  
  var str2test = 'MARIO';
  console.log('[##DEC64#]-------------TEST BASE 64 -------------', str2test);
  const ciphers = crypto.getCiphers();
  console.log(ciphers); 

  // get password's md5 hash
  var password = 'password';
  var password_hash = crypto.createHash('md5').update(password, 'utf-8').digest('hex').toUpperCase();
  console.log('key=', password_hash); // 098F6BCD4621D373CADE4E832627B4F6

  // our data to encrypt
  var data = '06401;0001001;04;15650.05;03';
  console.log('data=', data);

  // generate initialization vector
  var iv = new Buffer.alloc(16); // fill with zeros
  console.log('iv=', iv);

  // encrypt data
  var cipher = crypto.createCipheriv('aes-256-cbc', password_hash, iv);
  var encryptedData = cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
  console.log('encrypted data=', encryptedData.toUpperCase());



  console.log('[##DEC64#]', str2test);
  var encrypted64 = base64url(str2test);
  console.log('[##DEC64#]', encrypted64);
  var decoded = base64url.decode(encrypted64);
  console.log('[##DEC64#]', decoded);


  console.log('[##DEC64#]-------------TEST ENCRYPTION -------------');
  console.log('[##DEC64#] start : ',str2test);
  var buffer = new Buffer(str2test);
  var encrypted = crypto.publicEncrypt(publicKey, buffer);
  console.log('[##DEC64#] typeof encrypted : ', typeof encrypted);
  console.log('[##DEC64#] typeof encrypted : ', Buffer.isBuffer(encrypted));
  // console.log('[##DEC64#] typeof encrypted : ', encrypted.isEncoding('utf8'));

  console.log('[##DEC64#] encrypted :---------------------------');
  console.log(encrypted);
  var encrypted2string = encrypted.toString();
  console.log('[##DEC64#] encrypted2string -------------------------- :');
  console.log(encrypted2string);
  var encrypted64 = base64url(encrypted2string);
  console.log('[##DEC64#] encrypted64 -------------------------- :');
  console.log(encrypted64);
  var decoded = base64url.decode(encrypted64);
  console.log('[##DEC64#] decoded -------------------------- :');
  console.log(decoded);

  if( encrypted2string === decoded){
    console.log('[OK per la decodifica 64]');
  } else {
    console.log('[##########################################ROC64#] dec2str64 : DECODFICA NON UGUATE!');
    console.log('[##DEC64#] typeof encrypted64 : ', typeof encrypted2string);
    console.log('[##DEC64#] typeof decoded : ', typeof decoded);
  }

  /*
  'ascii' - for 7-bit ASCII data only. This encoding method is very fast and will strip the high bit if set.
  'utf8' - Multibyte encoded Unicode characters. Many web pages and other document formats use UTF-8.
  'utf16le' - 2 or 4 bytes, little-endian encoded Unicode characters. Surrogate pairs (U+10000 to U+10FFFF) are supported.
  'ucs2' - Alias of 'utf16le'.
  'base64' - Base64 string encoding. When creating a buffer from a string, this encoding will also correctly accept "URL and Filename Safe Alphabet" as specified in RFC 4648, Section 5.
  'binary' - A way of encoding the buffer into a one-byte (latin-1) encoded string. The string 'latin-1' is not supported. Instead, pass 'binary' to use 'latin-1' encoding.
  'hex' - Encode each byte as two hexadecimal characters.
  */

  var bufferASCII = new Buffer(decoded, 'ascii');
  var bufferUT = new Buffer(decoded, 'utf16le');
  var bufferUTF8 = new Buffer(decoded, 'utf8');
  var bufferBase64 = new Buffer(decoded, 'base64');
  // var bufferHex= new Buffer(decoded, 'hex');
  var bufferBin = new Buffer(decoded, 'binary');

  var source = new Buffer(encrypted2string);

  if (encrypted.equals(bufferUTF8)) {
    console.log('[OK per la ricostruzione del buffer]');
  } else {
    console.log('[--------ERROR----RICOSTRUZIONE DEL---------BUFFER----]');
    console.log('[##DEC64#] typeof encrypted : ', typeof encrypted);
    console.log('[##DEC64#] typeof buffer2   : ', typeof bufferUTF8);
    console.log(encrypted.toString());
    console.log(bufferUTF8.toString());
    console.log('[##DEC64#] list ------------------ ');
    console.log(encrypted);
    // console.log(source);
    console.log(bufferUTF8);
    console.log(bufferUT);
    console.log(bufferBase64);
    console.log(bufferASCII);
    // console.log(bufferHex);
    console.log(bufferBin);

  }
  
  console.log('[##DEC64#] buffer2 :---------------------------');
  


  // var buffer_decoded = new Buffer(decoded);
  var decrypted = crypto.privateDecrypt(privateKey, buffer2);
  console.log('[##DEC64#] end :',decrypted.toString());



  console.log('[##DEC64#]-------------END TEST ENCRYPTION -------------');

 /*

  console.log('[##DEC64#]', toDecrypt);
  var privateKey = fs.readFileSync(ENV.privateKey, "utf8");
  var decrypted64 = base64url.decode(toDecrypt);
  console.log('[#DEC64#]', decrypted64);
  // var buffer = new Buffer(decrypted64, "base64");
  var buffer = new Buffer(decrypted64);
  // OPENSSL_PKCS1_PADDING
    
  var obj = {
     key: privateKey,
      padding: constants.RSA_PKCS1_PADDING
  };
  var decrypted = crypto.privateDecrypt(obj, buffer);
  console.log('[#DEC64#]', decrypted);
  */
    
  return decrypted;
  },


  /* controlla se esiste il token ed è consistente 
  
    return false se non è autenticato o l'user autenticato
  */

  ensureAuthenticatedFun : function(req) {
    console.log('[#AUTHF#] ensureAuthenticated (start)');
    if (!req.header('Authorization')) {
        console.log('[#AUTHF#] ensureAuthenticated : 401 NO TOKEN');
        return false;
    }
      var token = req.header('Authorization').split(' ')[1];
      // console.log(req.header('Authorization'));
      var payload = null;
      try {
        payload = jwt.decode(token, ENV.secret);
      }
      catch (err) {
        console.log('[#AUTHF#] ensureAuthenticated decoded error');
        console.log(err);
        return false;
      }

      if(payload){
        if (payload.exp) {
          if (payload.exp <= moment().unix()) {
            console.log('[#AUTHF#] token expired');
            return false;
          }
        } else {
          var msg = '[#AUTHF#] ensureAuthenticated decoded error - exp NOT FOUND';
          console.log(msg);
          return false;
        }
      } else {
        var msg = '[#AUTHF#] ensureAuthenticated decoded error - payload NOT FOUND';
        console.log(msg);
        return false;
      }

      console.log('[#AUTHF#] ok pass');
      var user = {};
      user = payload.sub;
      user.token = token;
      return user;
  },

  /* come sopra ma protegge la route */
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


