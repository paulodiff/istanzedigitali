var jwt = require('jsonwebtoken');
var moment = require('moment');
var ENV = require('../config/config.js'); // load configuration data
var fs = require('fs');
var crypto = require('crypto');

var log = require('log4js').getLogger("app");
log.info('START recaptchaModule.js');

/* recapchaModule per la verifica della security */

 /* Funzione di verifica per Captch di Google */
exports.verifyReCaptcha = function(ReCaptcha) {
        console.log('verifyReCaptcha');
        return new Promise(function (resolve, reject) {
    
            var data = {
                secret: ENV.recaptcha_secret, 
                response: ReCaptcha
            };
            
            var url = 'https://www.google.com/recaptcha/api/siteverify';
            console.log('verifyReCaptcha:url',url);

            // console.log(data);

            var options = {
                uri: url,
                method: 'POST',
                proxy: ENV_PROT.proxy_url,
                json: true,
                qs: data
            };

            request(options, function (error, response, body) {
                if (error) {
                    console.log('verifyReCaptcha:Errore invio richiesta ...');
                    // console.log(error);
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
                    // console.log('Errore invio richiesta ...', response);
                    reject(response);
                }
            });
        });
    }



