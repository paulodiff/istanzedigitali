var express = require('express');
var router = express.Router();
// var request = require('request');
var os = require('os');
var fs = require('fs');
var fsExtra = require('fs-extra');
var path = require('path');
var util = require('util');
var soap = require('soap');

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var multiparty = require('multiparty');

var jwt = require('jwt-simple');
var ENV   = require('../config/config.js'); // load configuration data
var ENV_PROT   = require('../config/configPROTOCOLLO.js'); // load user configuration data
// var mongocli = require('../models/mongocli');
var spark = require('spark-md5');
var md5File = require('md5-file');
var _ = require('lodash');
// var Report = require('fluentreports').Report;
var request = require('request');
var email = require('emailjs');
var serverEmail  = email.server.connect({
    //user:    "ruggero.ruggeri@comune.rimini.it", 
    //password:"4008a5d9baa96365a018c04815679406", 
    host:    "srv-mail.comune.rimini.it", 
    ssl:     false
});
// http://embed.plnkr.co/iwZplV/
var moment = require('moment');
var mime = require('mime');
var async = require('async');
var handlebars = require('handlebars');
var validator = require('validator');
// var Segnalazione  = require('../models/segnalazione.js'); // load configuration data
// var flow = require('../models/flow-node.js')('tmp'); // load configuration data

var uM = require('../models/utilityModule.js'); 
// var databaseModule = require("../models/databaseModule.js");

var log4js = require('log4js');
log4js.configure(ENV.log4jsConfig);
var log = log4js.getLogger("app");
var logEmail = log4js.getLogger("email-log");
var logElastic = log4js.getLogger("elastic");

// var ReCaptcha = require("../models/recaptchaModule.js");
var pM = require("../models/protocolloModule.js");


var ACCESS_CONTROLL_ALLOW_ORIGIN = false;


// Note sicurezza:
// - controllo CaptCha
// - controllo csrf
// - limite UPLOAD
// - limite ORARIO uffici con NOTIFICA
// - controllo parametri SANITIZE 
// - controllo hash file
// - controllo dati
// - generazione PDF ???
// - protocollazione
// - invio mail di risposta



log.info('Starting ... Protocollo.js');


module.exports = function(){

var WS_IRIDE =  "";
var MODO_OPERATIVO = "TEST";

/* prepara la url per accesso al gateway di autenticazione*/
router.get('/getGatewayAuthUrl/:formId', function(req, res) {

    if(!req.params.formId){
      console.log('federaToken:NOT FOUND');
      console.log(reqId);
      res.status(500).send('federaToken:NOT FOUND');
      return;
    } else {
      var msg = {}
  
      // Verifico che la configurazione per il formId esiste
      var fId = req.params.formId;
      var fConfigName = ENV_PROT.baseFolder + '/' + ENV_PROT.configUserFolder + '/' + ENV_PROT.configFilePREFIX + '-' + fId + '.js';
      // var fConfigName = ENV_PROT.configUserFolder + '/' + ENV_PROT.configFilePREFIX + '-' + user.userCompany + '.js';
      log.info('loadingDefault : load default data : ' + fConfigName);

      try {
          ENV_FORM_CONFIG = require(fConfigName);
          log.info(ENV_FORM_CONFIG);
      }
      catch (e) {
          log.error(e);
          ErrorMsg = {
              title: 'Errore loadingDefault messaggio',
              msg: 'Errore loadingDefault messaggio di risposta. ',
              code : 459
          }
          res.status(459).send(ErrorMsg);
          return;
      }

      // prepara la url per l'accesso al gateway
      // nel token devo passare una serie di parametri che devono tornare indietro ad autenticazione 
      // avvenuta a seconda della istanza
  
      // cifrare il token con il certificato
      // fare base64
      // passarlo al client
  
      // ENV.appLandingUrl
      // ENV.gatewayAuthUrl
  
      var sToReturn = req.params.formId + ";" + ENV.apiLandingUrl;
      //var sToReturn = req.params.formId + ";http1" ;

      console.log(sToReturn);
      var dataEncrypted = uM.encryptStringWithRsaPrivateKey64(sToReturn);
      console.log(sToReturn);
  
      msg.token = uM.createJWT('federaToken');
      msg.id = req.params.formId;
      msg.url = ENV.gatewayAuthUrl + '?' + ENV.gatewayAppNameIntegration + '=' + dataEncrypted;
    }
    
    console.log('/federaToken');
    //utilityModule.test();
    
    //User.findOne({ email: req.body.email }, '+password', function(err, user) {
    
    res.send(msg);
  
});
  
/* Route di ritorno da autenticazione gateway */

router.get('/gwLanding', function (req, res) {
        console.log('Protocollo.js');
        console.log(req.query.authenticatedUser);
        // console.log('Save auth transaction to db');
                
        var authenticatedUser = req.query.authenticatedUser;
        console.log('Protocollo.js: ', authenticatedUser);
        var dataDecrypted = uM.decryptStringWithRsaPrivateKey64(authenticatedUser);
        console.log('Protocollo.js: ', dataDecrypted);

        // con l'utente generare il token e ritornarlo al chiamante..
        // var token = utilityModule.createJWT(req.user);
        // res.redirect('/simplesaml/cli/#/landingSAML/' + token + '/' + req.body.RelayState);
        
        // res.redirect('/protocollo/cli/#/landingGateway/' + token + '/' + req.body.RelayState);
        res.status(200).send({msg: 'ok'});
});

/* Restituisce la configurazione del form */

router.get('/getInfoIstanza/:formId', function (req, res) {

    log.info('/getInfoIstanza/');

    if(!req.params.formId){
        log.error('getInfoIstanza:NOT FOUND');
        log.error(reqId);
        res.status(500).send('getInfoIstanza:NOT FOUND');
        return;
    } else {

        var fId = req.params.formId;
        log.info('getInfoIstanza:len:' + fId.length);

        if(fId.length > 6) {
            log.info('getInfoIstanza:len: TROPPO LUNGA');
            ErrorMsg = {
                title: 'Errore loadingDefault messaggio',
                msg: 'Errore loadingDefault messaggio di risposta. ',
                code : 458
            }
            res.status(458).send(ErrorMsg);
            return;
        }

        var fConfigName = ENV_PROT.baseFolder + '/' + ENV_PROT.configUserFolder + '/' + ENV_PROT.configFilePREFIX + '-' + fId + '.js';
        // var fConfigName = ENV_PROT.configUserFolder + '/' + ENV_PROT.configFilePREFIX + '-' + user.userCompany + '.js';
        log.info('loadingDefault : load default data : ' + fConfigName);
 
        try {
            ENV_FORM_CONFIG = require(fConfigName);
            log.info(ENV_FORM_CONFIG);
        }
        catch (e) {
            log.error(e);
            ErrorMsg = {
                title: 'Errore loadingDefault messaggio',
                msg: 'Errore loadingDefault messaggio di risposta. ',
                code : 459
            }
            res.status(459).send(ErrorMsg);
            return;
        }

        // verifica se richiesta autenticazione
        log.info('auth enable ?');
        var loggedUser = {};
        if(ENV_FORM_CONFIG.authEnable){
            log.info('Protocollo.js: auth enable ! check!');
            if (!uM.ensureAuthenticatedFun(req)){
                log.info('Protocollo.js: NOT AUTH'); // cli/#!/login/D
                log.error('Protocollo.js: NOT AUTH');
                ErrorMsg = {
                        title: 'Eseguire autenticazione',
                        msg: 'Eseguire autenticazione',
                        code : 999
                }
                res.status(999).send(ErrorMsg);
                return;
            } else {
                log.info('Protocollo.js: logged!');
                loggedUser = uM.ensureAuthenticatedFun(req);
                log.info(loggedUser);
            }
        }

        // verifica se ci sono date di validità e controlla
        log.info(ENV_FORM_CONFIG.startDate);
        if(ENV_FORM_CONFIG.startDate)   {
            log.info('Protocollo.js: CHECK PERIODO DI VALIDITA'); // cli/#!/login/D
            // moment('2010-10-20').isBetween('2010-10-19', '2010-10-25');
            var date = moment("15/02/2013", "DD/MM/YYYY");
            var startDate = moment(ENV_FORM_CONFIG.startDate, "DD/MM/YYYY");
            var endDate = moment(ENV_FORM_CONFIG.endDate, "DD/MM/YYYY");
            console.log(moment().isBetween(startDate, endDate))
            if(!moment().isBetween(startDate, endDate)){
                ErrorMsg = {
                    title: 'Form al momento non abilitato',
                    msg: 'Periodo di lavoro dal:' + ENV_FORM_CONFIG.startDate + ' al:' + ENV_FORM_CONFIG.endDate,
                    code : 998
            }
            res.status(998).send(ErrorMsg);
            return;
            }
        }

        var objRet = {};
        objRet.idIstanza = ENV_FORM_CONFIG.idIstanza;
        objRet.numeroAllegati = ENV_FORM_CONFIG.numeroAllegati;
        objRet.maxFileSize = ENV_FORM_CONFIG.maxFileSize;
        objRet.titles = ENV_FORM_CONFIG.titles;
        objRet.file1 = ENV_FORM_CONFIG.file1;
        objRet.file2 = ENV_FORM_CONFIG.file2;
        objRet.file3 = ENV_FORM_CONFIG.file3;
        objRet.file4 = ENV_FORM_CONFIG.file4;
        objRet.file5 = ENV_FORM_CONFIG.file5;
        objRet.defaultUserData = ENV_FORM_CONFIG.defaultUserData;
        objRet.descrizionePrincipale = ENV_FORM_CONFIG.descrizionePrincipale;
        objRet.contattiFooter = ENV_FORM_CONFIG.contattiFooter;
        objRet.statoIstanza = 0;
        // jsonString = JSON.stringify(person, functionReplacer);
        objRet.vm_fields = JSON.stringify(ENV_FORM_CONFIG.vm_fields,uM.functionReplacer);
        //objRet.vm_fields = btoa(String.fromCharCode.apply(null, new Uint8Array(ENV_FORM_CONFIG.vm_fields)));
        objRet.vm_model = ENV_FORM_CONFIG.vm_model;

        var token = uM.createJWT(uM.getTimestampPlusRandom(), 1, 'd');
        log.info(token);
        uM.addTokenToList(token);

        objRet.token = token;

        var Msg = {
            "documentId" : ENV_FORM_CONFIG.idIstanza,
            "actionId": "ISTANZA_RICHIESTA",
            "idIstanza": ENV_FORM_CONFIG.idIstanza,
            "code": 998
        }
        
        logElastic.info(Msg);

        res.status(200).send(objRet);
        return;
    }

});


/* UPLOAD ROUTE FORM DINAMICO FOrMLY--------------------------------------------------------------------------------------------------------- */

//router.post('/upload', multipartMiddleware, function(req, res) {
    router.post('/uploadDinamico/:formId', 
    // uM.ensureAuthenticated,
    // uM.recaptchaVerifier,
    uM.checkIfTokenInList,
    function(req, res) {


    log.info('@UPLOAD@DINAMICO@@@@@@@@ UPLOAD: after authorization ...');
    log.info(req.params.formId);
    var bRaisedError = false;
    var ErrorMsg = {};
    var ENV_FORM_CONFIG = {};
    var ID_ISTANZA = '';
    

    // richiesta di identificatore unico di transazione
    var reqId = uM.getTimestampPlusRandom();

    log.info('UPLOAD: reqId ...' + reqId);

    ErrorMsg.reqId = reqId;

    // aggiunge reqId all'utente identificato
    /*
    if(req.user) {
        req.user.reqId = reqId;
    } else {
        req.user = {};
        req.user.reqId = reqId;
    }
    */


    var objFilesList = {};
    var objFieldList = {};
    var objFieldSanitized = {};
    var objDatiProtocollo = {};
    var htmlResponseMsg = '';
    var supportMsg = ENV_PROT.supportMsg;
   
   
    // limite upload
    // https://github.com/expressjs/node-multiparty

    async.series([

        // ##### LOADING default ---------------------------------------
        function(callback){
            log.info('UPLOAD: ASYNC loadingDefault:');

            if(!req.params.formId){
                log.error('loadingDefault:userCompany property not found');
                log.error(reqId);
                ErrorMsg = {
                    title: 'Errore loadingDefault messaggio',
                    msg: 'Errore loadingDefault messaggio di risposta. ',
                    code : 459
                }
                callback(ErrorMsg, null);
            } else {
                var fConfigName = ENV_PROT.baseFolder + '/' + ENV_PROT.configUserFolder + '/' + ENV_PROT.configFilePREFIX + '-' + req.params.formId + '.js';
                // var fConfigName = ENV_PROT.configUserFolder + '/' + ENV_PROT.configFilePREFIX + '-' + user.userCompany + '.js';
                log.info('loadingDefault : load default data : ' + fConfigName);
         
                try {
                    ENV_FORM_CONFIG = require(fConfigName);
                    ENV_FORM_CONFIG.reqId = reqId;
                    ID_ISTANZA = '[' + ENV_FORM_CONFIG.idIstanza + ']';
                    log.info(ID_ISTANZA);
                    callback(null, 'UPLOAD: ASYNC loadingDefault success!');
                }
                catch (e) {
                    log.error(e);
                    ErrorMsg = {
                        title: 'Errore loadingDefault messaggio',
                        msg: 'Errore loadingDefault messaggio di risposta. '  + supportMsg,
                        code : 459
                    }
                    callback(ErrorMsg, null);
                }
                
            }

           
        },

        // ##### recaptchaVerifier ------------------------------------------------ 
        
        function(callback){
            log.info(ID_ISTANZA+'UPLOAD: ASYNC recaptchaVerifier:');

            log.info(req.header('RECAPTCHA-TOKEN'));

            if(ENV_FORM_CONFIG.NORECAPTCHA) { 
            
                log.info('@@ RECAPTCHA DISABLED!---------------- @@@@@@');
                callback(null, 'recaptchaVerifier DISABLED!');
            
            } else {

                uM.verifyReCaptcha(req.header('RECAPTCHA-TOKEN'))
                .then( function (result) {
                    log.info(result.body);
                    callback(null, 'recaptchaVerifier ... ok');
                })
                .catch(function (err) {
                    // console.log(err);
                    log.error('ASYNC recaptchaVerifier ERROR!');
                    log.error(err);
                    ErrorMsg = {
                        title: 'Errore di recaptchaVerifier',
                        msg: 'Errore nella recaptchaVerifier della richiesta.' + supportMsg,
                        code : 458
                    };
                    callback(ErrorMsg, null);
                });

            }
        },

        // ##### PARSING ------------------------------------------------
        function(callback) {
            log.info(ID_ISTANZA +' UPLOAD: ASYNC form parsing');
        
            var options = {  
                maxFilesSize: ENV_PROT.upload_size,
                autoFiles: true,
                uploadDir: ENV_PROT.upload_dir
            };
        
            log.info(options);  
            var form = new multiparty.Form(options);

            //log.info(ID_ISTANZA +'---------------------------------------------------------');  
            //log.info(req.body);  
            //log.info(ID_ISTANZA +'---------------------------------------------------------');  

            form.parse(req, 
                function(err, fields, files) {
                    if(err){
                        log.error(err);
                        ErrorMsg = {
                            title: 'Errore nella validazione dei parametri di input',
                            msg: 'Errore nella decodifica dei dati ricevuti. ' + supportMsg,
                            reqId: reqId,
                            code: 455
                        };
                        callback(ErrorMsg, null);
                    } else {
                        objFieldList = fields;
                        objFilesList = files;
                        log.info(ID_ISTANZA+'---- FieldList ----------------------------');
                        log.info(objFieldList);
                        log.info(ID_ISTANZA+'---- FilesList ----------------------------');
                        log.info(objFilesList);
                        callback(null, 'UPLOAD: ASYNC form parsing success!');
                    }
                });
        },
        // ##### Input sanitizer & validator------------------------------------------------------------------------

        function(callback){
            log.info(ID_ISTANZA+' UPLOAD: ASYNC sanitizeInput:');

            if(ENV_FORM_CONFIG.NO_INPUT_DATA_SANITIZE) { 
                log.info(ID_ISTANZA+' @SANITIZE_INPUT_DATA_DISABLED@');
                callback(null, '@SANITIZE_INPUT_DATA_DISABLED@');
            } else {

                if (pM.sanitizeInputDinamic(objFieldList, objFieldSanitized, ENV_FORM_CONFIG)){
                    log.info(ID_ISTANZA+' UPLOAD: ASYNC sanitizeInput: ok');
                    log.info(objFieldSanitized);
                    callback(null, 'UPLOAD: ASYNC sanitizeInput: success!');
                } else {
                    ErrorMsg = {
                        title: 'Check input error',
                        msg:   'Errore nei dati di input. ' + supportMsg,
                        code : 456
                    }
                    log.error(reqId);
                    log.error(ErrorMsg);
                    callback(ErrorMsg, null);
                }
            } 
        },

        // ##### FILE Input sanitizer & validator------------------------------------------------------------------------

        function(callback){
            log.info(ID_ISTANZA+' UPLOAD: ASYNC sanitizefile:');

            if(ENV_FORM_CONFIG.NO_FILE_DATA_SANITIZE) { 
                log.info(ID_ISTANZA+' @SANITIZE_FILE_DATA_DISABLED@');
                callback(null, '@SANITIZE_FILE_DATA_DISABLED@');
            } else {

                if (pM.sanitizeFile(objFilesList, ENV_FORM_CONFIG)){
                    log.info(ID_ISTANZA+' UPLOAD: ASYNC sanitizeFile: ok');
                    callback(null, 'UPLOAD: ASYNC sanitizefile: success!');
                } else {
                    ErrorMsg = {
                        title: 'Check input error',
                        msg:   'Errore nei dati di input. ' + supportMsg,
                        code : 456
                    }
                    log.error(reqId);
                    log.error(ErrorMsg);
                    callback(ErrorMsg, null);
                }
            }
        },

        // ##### Saving files to DISK ------------------------------------------------------------------------

        function(callback){
            log.info(ID_ISTANZA+'UPLOAD: ASYNC savingFiles:');

            if (pM.savingFiles(objFilesList, objFieldSanitized, ENV_FORM_CONFIG )){
                log.info(ID_ISTANZA+'UPLOAD: ASYNC savingFiles: ok');
                callback(null, 'UPLOAD: ASYNC:savingFiles ... ok');
            } else {
                ErrorMsg = {
                    title: 'saving file error',
                    msg: 'Errore nella memorizzazione remota dei files.' + supportMsg,
                    code : 457
                }
                log.error(reqId);
                log.error(ErrorMsg);
                callback(ErrorMsg, null);
            }
        },

        // ###### Build oggetto from template --------------------------------------------------------

        function(callback){
            log.info(ID_ISTANZA+'UPLOAD:ASYNC build oggetto:');
            var oggetto = pM.buildOggetto(objFieldSanitized, ENV_FORM_CONFIG)
            if (oggetto){
                ENV_FORM_CONFIG.wsJiride.oggettoDocumento = oggetto;
                callback(null, 'UPLOAD: ASYNC:oggetto genererato correttamente ... ok');
            }else {
                ErrorMsg = {
                    title: 'saving file error',
                    msg: 'Errore nella creazione oggetto',
                    code : 457
                }
                log.error(reqId);
                log.error(ErrorMsg);
                callback(ErrorMsg, null);
            }
        },

        // ##### Protocollazione ------------------------------------------------------------------------

        function(callback){

            log.info(ID_ISTANZA+'ASYNC protocolloWS:GO!');
                objDatiProtocollo = {};
    
                if(ENV_FORM_CONFIG.NOPROTOCOLLO){ // test

                    objDatiProtocollo = { InserisciProtocolloEAnagraficheResult:
                    { 
                        IdDocumento: 6658846,
                        AnnoProtocollo: '2018',
                        NumeroProtocollo: 3,
                        DataProtocollo: '2018-02-07T11:35:54.333Z',
                        Messaggio: 'Inserimento Protocollo eseguito con successo, senza Avvio Iter',
                        Allegati: { Allegato: {} } 
                    } 
                    };

                    objFieldSanitized.idProtocollo =  objDatiProtocollo.InserisciProtocolloEAnagraficheResult.IdDocumento;
                    objFieldSanitized.annoProtocollo = objDatiProtocollo.InserisciProtocolloEAnagraficheResult.AnnoProtocollo;
                    objFieldSanitized.numeroProtocollo = objDatiProtocollo.InserisciProtocolloEAnagraficheResult.NumeroProtocollo;
                    objFieldSanitized.dataProtocollo = objDatiProtocollo.InserisciProtocolloEAnagraficheResult.DataProtocollo;

                    callback(null, 'protocolloWS ... FAKE!!!!');
                } else {
                    
                        pM.protocolloWS(objFieldSanitized, reqId, ENV_FORM_CONFIG, ENV_PROT)
                        .then( function (result) {
                            log.info(result);
                            objDatiProtocollo = result;
                            objFieldSanitized.idProtocollo =  objDatiProtocollo.InserisciProtocolloEAnagraficheResult.IdDocumento;
                            objFieldSanitized.annoProtocollo = objDatiProtocollo.InserisciProtocolloEAnagraficheResult.AnnoProtocollo;
                            objFieldSanitized.numeroProtocollo = objDatiProtocollo.InserisciProtocolloEAnagraficheResult.NumeroProtocollo;
                            objFieldSanitized.dataProtocollo = objDatiProtocollo.InserisciProtocolloEAnagraficheResult.DataProtocollo;
                            callback(null, 'protocolloWS ... ok');
                        })
                        .catch(function (err) {
                            // console.log(err);
                            log.error('ASYNC protocolloWS:');
                            log.error(reqId);
                            log.error(err);
                            ErrorMsg = {
                                title: 'Errore di protocollo',
                                msg: 'Errore nella protocollazione della richiesta.' + supportMsg,
                                code : 458
                            };
                            callback(ErrorMsg, null);
                        });

                }
                    
        },

          // ###### SALVA DATI CON PROTOCOLLO ----------------------------------------------------------------

        function(callback){
            log.info(ID_ISTANZA+'UPLOAD:salvaDatiConProtocollo build response message:');
            var oggetto = pM.salvaDatiConProtocollo(objFieldSanitized, ENV_FORM_CONFIG);
            if (oggetto){
                callback(null, 'UPLOAD: salvaDatiConProtocollo:messaggio risposta genererato correttamente ... ok');
            } else {
                ErrorMsg = {
                    title: 'saving file error',
                    msg: 'Errore nel salvataggio dati con protocollo',
                    code : 457
                }
                log.error(reqId);
                log.error(ErrorMsg);
                callback(ErrorMsg, null);
            }
        },


        // ###### BUILD Response Message ----------------------------------------------------------------

        function(callback){
            log.info(ID_ISTANZA+'UPLOAD:ASYNC build response message:');
            var oggetto = pM.buildMessaggioRisposta(objFieldSanitized, ENV_FORM_CONFIG);
            if (oggetto){
                ENV_FORM_CONFIG.messaggioRisposta = oggetto;
                callback(null, 'UPLOAD: ASYNC:messaggio risposta genererato correttamente ... ok');
            }else {
                ErrorMsg = {
                    title: 'saving file error',
                    msg: 'Errore nella creazione del messagggio risposta',
                    code : 457
                }
                log.error(reqId);
                log.error(ErrorMsg);
                callback(ErrorMsg, null);
            }
        },

        // ###### BUILD invio mail di conferma ----------------------------------------------------------------
    
        function(callback){
            
            log.info(ID_ISTANZA+'UPLOAD:ASYNC invio mail cortesia');
            if(ENV_FORM_CONFIG.sendEmail) {

                log.info(ID_ISTANZA+'UPLOAD:ASYNC invio mail a ' + objFieldSanitized.emailRichiedente);

                var subjectEmail = pM.buildTemplate(objFieldSanitized,ENV_FORM_CONFIG.templateEmail);

                var options = {
                    text:    subjectEmail,
                    from:    ENV_FORM_CONFIG.noreply, 
                    to:      objFieldSanitized.emailRichiedente,
                    //cc:      "else <else@your-email.com>",
                    subject: ENV_FORM_CONFIG.messaggioMailTesto
                }

                if (ENV_FORM_CONFIG.bccDebug) {
                    options.bcc = ENV_FORM_CONFIG.bccDebug;
                }

                serverEmail.send(options, function(err, message) 
                {
                    if(err) {
                        log.error(ID_ISTANZA+'UPLOAD:ASYNC ERRORE invio mail ');
                        log.error(err);  
                    }
                    log.info(ID_ISTANZA+'UPLOAD:ASYNC invio mail OK');
                    callback(null, 'Invio mail preparato ok');
                });
                
            } else {
                log.info(ID_ISTANZA+'UPLOAD:ASYNC invio mail NON ABILITATO');
                callback(null, 'Invio mail canceled!');
            }
        },

        // ###### OUTPUT dati verso CSV EXCEL-----------------------------------------    

        function(callback){
            log.info(ID_ISTANZA+'UPLOAD:OUTPUT verso file o db');
            if(ENV_FORM_CONFIG.NO_OUTPUT_FILE_DB) {
                log.info(ID_ISTANZA+' @NO_OUTPUT_FILE_DB@');
                callback(null, '@NO_OUTPUT_FILE_DB@');
            } else {
                var ritorno = pM.output2FileDatabase(objFieldSanitized, ENV_FORM_CONFIG);
                if (ritorno){
                    callback(null, 'UPLOAD: OUTPUT  dati corretti ... ok');
                }else {
                    ErrorMsg = {
                        title: 'saving file error',
                        msg: 'Errore nell output dei dati',
                        code : 457
                    }
                    log.error(reqId);
                    log.error(ErrorMsg);
                    callback(ErrorMsg, null);
                }
            }
        }

    ],function(err, results) {
        // results is now equal to: {one: 1, two: 2}
        log.info(ID_ISTANZA+'UPLOAD: ASYNC FINAL!:');
        if(err){
            log.error(err);
            res.status(ErrorMsg.code).send(ErrorMsg);
        } else {
            log.info(ID_ISTANZA+'UPLOAD: ALL OK!!!!');
            // results.msg = htmlResponseMsg;
            log.info(htmlResponseMsg);
        
            var Msg = {
                    "documentId" : ENV_FORM_CONFIG.idIstanza,
                    "actionId": "ISTANZA_INVIATA",
                    "title": "Istanza ricevuta con successo!",
                    "idIstanza": ENV_FORM_CONFIG.idIstanza,
                    "msg": objFieldSanitized,
                    "txtMsg": ENV_FORM_CONFIG.messaggioRisposta,
                    "htmlMsg": htmlResponseMsg,
                    "reqId": reqId,
                    code : 200
            }
            
            logEmail.info(Msg);
            logElastic.info(Msg);
            
            res.status(200).send(Msg);
        }
    });

 

});


/* UPLOAD ROUTE  --------------------------------------------------------------------------------------------------------- */

//router.post('/upload', multipartMiddleware, function(req, res) {
router.post('/upload/:formId', 
    // uM.ensureAuthenticated,
    // uM.recaptchaVerifier,
    uM.checkIfTokenInList,
    function(req, res) {


    log.info('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ UPLOAD: after authorization ...');
    log.info(req.params.formId);
    var bRaisedError = false;
    var ErrorMsg = {};
    var ENV_FORM_CONFIG = {};
    var ID_ISTANZA = '';
    

    // richiesta di identificatore unico di transazione
    var reqId = uM.getTimestampPlusRandom();

    log.info('UPLOAD: reqId ...' + reqId);

    ErrorMsg.reqId = reqId;

    // aggiunge reqId all'utente identificato
    /*
    if(req.user) {
        req.user.reqId = reqId;
    } else {
        req.user = {};
        req.user.reqId = reqId;
    }
    */


    var objFilesList = {};
    var objFieldList = {};
    var objFieldSanitized = {};
    var objDatiProtocollo = {};
    var htmlResponseMsg = '';
    var supportMsg = ENV_PROT.supportMsg;
   
   
    // limite upload
    // https://github.com/expressjs/node-multiparty

    async.series([

        // ##### LOADING default ---------------------------------------
        function(callback){
            log.info('UPLOAD: ASYNC loadingDefault:');

            if(!req.params.formId){
                log.error('loadingDefault:userCompany property not found');
                log.error(reqId);
                ErrorMsg = {
                    title: 'Errore loadingDefault messaggio',
                    msg: 'Errore loadingDefault messaggio di risposta. ',
                    code : 459
                }
                callback(ErrorMsg, null);
            } else {
                var fConfigName = ENV_PROT.baseFolder + '/' + ENV_PROT.configUserFolder + '/' + ENV_PROT.configFilePREFIX + '-' + req.params.formId + '.js';
                // var fConfigName = ENV_PROT.configUserFolder + '/' + ENV_PROT.configFilePREFIX + '-' + user.userCompany + '.js';
                log.info('loadingDefault : load default data : ' + fConfigName);
         
                try {
                    ENV_FORM_CONFIG = require(fConfigName);
                    ENV_FORM_CONFIG.reqId = reqId;
                    ID_ISTANZA = '[' + ENV_FORM_CONFIG.idIstanza + ']';
                    log.info(ID_ISTANZA);
                    callback(null, 'UPLOAD: ASYNC loadingDefault success!');
                }
                catch (e) {
                    log.error(e);
                    ErrorMsg = {
                        title: 'Errore loadingDefault messaggio',
                        msg: 'Errore loadingDefault messaggio di risposta. '  + supportMsg,
                        code : 459
                    }
                    callback(ErrorMsg, null);
                }
                
            }

           
        },

        // ##### recaptchaVerifier ------------------------------------------------ 
        
        function(callback){
            log.info(ID_ISTANZA+'UPLOAD: ASYNC recaptchaVerifier:');

            log.info(req.header('RECAPTCHA-TOKEN'));

            if(ENV_FORM_CONFIG.NORECAPTCHA) { 
            
                log.info('@@ RECAPTCHA DISABLED!---------------- @@@@@@');
                callback(null, 'recaptchaVerifier DISABLED!');
            
            } else {

                uM.verifyReCaptcha(req.header('RECAPTCHA-TOKEN'))
                .then( function (result) {
                    log.info(result.body);
                    callback(null, 'recaptchaVerifier ... ok');
                })
                .catch(function (err) {
                    // console.log(err);
                    log.error('ASYNC recaptchaVerifier ERROR!');
                    log.error(err);
                    ErrorMsg = {
                        title: 'Errore di recaptchaVerifier',
                        msg: 'Errore nella recaptchaVerifier della richiesta.' + supportMsg,
                        code : 458
                    };
                    callback(ErrorMsg, null);
                });

            }
        },

        // ##### PARSING ------------------------------------------------
        function(callback) {
            log.info(ID_ISTANZA +' UPLOAD: ASYNC form parsing');
        
            var options = {  
                maxFilesSize: ENV_PROT.upload_size,
                autoFiles: true,
                uploadDir: ENV_PROT.upload_dir
            };
        
            log.info(options);  
            var form = new multiparty.Form(options);

            log.info(ID_ISTANZA +'---------------------------------------------------------');  
            log.info(req.body);  
            log.info(ID_ISTANZA +'---------------------------------------------------------');  

            form.parse(req, 
                function(err, fields, files) {
                    if(err){
                        log.error(err);
                        ErrorMsg = {
                            title: 'Errore nella validazione dei parametri di input',
                            msg: 'Errore nella decodifica dei dati ricevuti. ' + supportMsg,
                            reqId: reqId,
                            code: 455
                        };
                        callback(ErrorMsg, null);
                    } else {
                        objFieldList = fields;
                        objFilesList = files;
                        log.info(ID_ISTANZA+'---- FieldList ----------------------------');
                        log.info(objFieldList);
                        log.info(ID_ISTANZA+'---- FilesList ----------------------------');
                        log.info(objFilesList);
                        callback(null, 'UPLOAD: ASYNC form parsing success!');
                    }
                });
        },
        // ##### Input sanitizer & validator------------------------------------------------------------------------

        function(callback){
            log.info(ID_ISTANZA+' UPLOAD: ASYNC sanitizeInput:');

            if (pM.sanitizeInput(objFieldList, objFieldSanitized, ENV_FORM_CONFIG)){
                log.info(ID_ISTANZA+' UPLOAD: ASYNC sanitizeInput: ok');
                log.info(objFieldSanitized);
                callback(null, 'UPLOAD: ASYNC sanitizeInput: success!');
            } else {
                ErrorMsg = {
                    title: 'Check input error',
                    msg:   'Errore nei dati di input. ' + supportMsg,
                    code : 456
                }
                log.error(reqId);
                log.error(ErrorMsg);
                 callback(ErrorMsg, null);
            }
        },

        // ##### FILE Input sanitizer & validator------------------------------------------------------------------------

        function(callback){
            log.info(ID_ISTANZA+' UPLOAD: ASYNC sanitizefile:');

            if (pM.sanitizeFile(objFilesList, ENV_FORM_CONFIG)){
                log.info(ID_ISTANZA+' UPLOAD: ASYNC sanitizeFile: ok');
                callback(null, 'UPLOAD: ASYNC sanitizefile: success!');
            } else {
                ErrorMsg = {
                    title: 'Check input error',
                    msg:   'Errore nei dati di input. ' + supportMsg,
                    code : 456
                }
                log.error(reqId);
                log.error(ErrorMsg);
                callback(ErrorMsg, null);
            }
        },

        // ##### Saving files to DISK ------------------------------------------------------------------------

        function(callback){
            log.info(ID_ISTANZA+'UPLOAD: ASYNC savingFiles:');

            if (pM.savingFiles(objFilesList, objFieldSanitized, ENV_FORM_CONFIG )){
                log.info(ID_ISTANZA+'UPLOAD: ASYNC savingFiles: ok');
                callback(null, 'UPLOAD: ASYNC:savingFiles ... ok');
            } else {
                ErrorMsg = {
                    title: 'saving file error',
                    msg: 'Errore nella memorizzazione remota dei files.' + supportMsg,
                    code : 457
                }
                log.error(reqId);
                log.error(ErrorMsg);
                callback(ErrorMsg, null);
            }
        },

        // ###### Build oggetto from template --------------------------------------------------------

        function(callback){
            log.info(ID_ISTANZA+'UPLOAD:ASYNC build oggetto:');
            var oggetto = pM.buildOggetto(objFieldSanitized, ENV_FORM_CONFIG)
            if (oggetto){
                ENV_FORM_CONFIG.wsJiride.oggettoDocumento = oggetto;
                callback(null, 'UPLOAD: ASYNC:oggetto genererato correttamente ... ok');
            }else {
                ErrorMsg = {
                    title: 'saving file error',
                    msg: 'Errore nella creazione oggetto',
                    code : 457
                }
                log.error(reqId);
                log.error(ErrorMsg);
                callback(ErrorMsg, null);
            }
        },

        // ##### Protocollazione ------------------------------------------------------------------------

            function(callback){

                log.info(ID_ISTANZA+'ASYNC protocolloWS:GO!');
                    objDatiProtocollo = {};
     
                    if(ENV_FORM_CONFIG.NOPROTOCOLLO){ // test

                        objDatiProtocollo = { InserisciProtocolloEAnagraficheResult:
                        { 
                            IdDocumento: 6658846,
                            AnnoProtocollo: '2018',
                            NumeroProtocollo: 3,
                            DataProtocollo: '2018-02-07T11:35:54.333Z',
                            Messaggio: 'Inserimento Protocollo eseguito con successo, senza Avvio Iter',
                            Allegati: { Allegato: {} } 
                        } 
                        };

                        objFieldSanitized.idProtocollo =  objDatiProtocollo.InserisciProtocolloEAnagraficheResult.IdDocumento;
                        objFieldSanitized.annoProtocollo = objDatiProtocollo.InserisciProtocolloEAnagraficheResult.AnnoProtocollo;
                        objFieldSanitized.numeroProtocollo = objDatiProtocollo.InserisciProtocolloEAnagraficheResult.NumeroProtocollo;
                        objFieldSanitized.dataProtocollo = objDatiProtocollo.InserisciProtocolloEAnagraficheResult.DataProtocollo;

                        callback(null, 'protocolloWS ... FAKE!!!!');
                    } else {
                        
                            pM.protocolloWS(objFieldSanitized, reqId, ENV_FORM_CONFIG, ENV_PROT)
                            .then( function (result) {
                                log.info(result);
                                objDatiProtocollo = result;
                                objFieldSanitized.idProtocollo =  objDatiProtocollo.InserisciProtocolloEAnagraficheResult.IdDocumento;
                                objFieldSanitized.annoProtocollo = objDatiProtocollo.InserisciProtocolloEAnagraficheResult.AnnoProtocollo;
                                objFieldSanitized.numeroProtocollo = objDatiProtocollo.InserisciProtocolloEAnagraficheResult.NumeroProtocollo;
                                objFieldSanitized.dataProtocollo = objDatiProtocollo.InserisciProtocolloEAnagraficheResult.DataProtocollo;
                                callback(null, 'protocolloWS ... ok');
                            })
                            .catch(function (err) {
                                // console.log(err);
                                log.error('ASYNC protocolloWS:');
                                log.error(reqId);
                                log.error(err);
                                ErrorMsg = {
                                    title: 'Errore di protocollo',
                                    msg: 'Errore nella protocollazione della richiesta.' + supportMsg,
                                    code : 458
                                };
                                callback(ErrorMsg, null);
                            });

                    }
                     
            },

            // ###### BUILD Response Message ----------------------------------------------------------------

            function(callback){
                log.info(ID_ISTANZA+'UPLOAD:ASYNC build response message:');
                var oggetto = pM.buildMessaggioRisposta(objFieldSanitized, ENV_FORM_CONFIG);
                if (oggetto){
                    ENV_FORM_CONFIG.messaggioRisposta = oggetto;
                    callback(null, 'UPLOAD: ASYNC:messaggio risposta genererato correttamente ... ok');
                }else {
                    ErrorMsg = {
                        title: 'saving file error',
                        msg: 'Errore nella creazione del messagggio risposta',
                        code : 457
                    }
                    log.error(reqId);
                    log.error(ErrorMsg);
                    callback(ErrorMsg, null);
                }
            },

            // ###### BUILD invio mail di conferma ----------------------------------------------------------------
      
            function(callback){
                
                log.info(ID_ISTANZA+'UPLOAD:ASYNC invio mail cortesia');
                if(ENV_FORM_CONFIG.sendEmail) {

                    log.info(ID_ISTANZA+'UPLOAD:ASYNC invio mail a ' + objFieldSanitized.emailRichiedente);

                    var subjectEmail = pM.buildTemplate(objFieldSanitized,ENV_FORM_CONFIG.templateEmail);

                    var options = {
                        text:    subjectEmail,
                        from:    ENV_FORM_CONFIG.noreply, 
                        to:      objFieldSanitized.emailRichiedente,
                        //cc:      "else <else@your-email.com>",
                        subject: ENV_FORM_CONFIG.messaggioMailTesto
                    }

                    if (ENV_FORM_CONFIG.bccDebug) {
                        options.bcc = ENV_FORM_CONFIG.bccDebug;
                    }

                    serverEmail.send(options, function(err, message) 
                    {
                        if(err) {
                            log.error(ID_ISTANZA+'UPLOAD:ASYNC ERRORE invio mail ');
                            log.error(err);  
                        }
                        log.info(ID_ISTANZA+'UPLOAD:ASYNC invio mail OK');
                        callback(null, 'Invio mail preparato ok');
                    });
                    
                } else {
                    log.info(ID_ISTANZA+'UPLOAD:ASYNC invio mail NON ABILITATO');
                    callback(null, 'Invio mail canceled!');
                }

                
 
            }

    ],function(err, results) {
        // results is now equal to: {one: 1, two: 2}
        log.info(ID_ISTANZA+'UPLOAD: ASYNC FINAL!:');
        if(err){
            log.error(err);
            res.status(ErrorMsg.code).send(ErrorMsg);
        } else {
            log.info(ID_ISTANZA+'UPLOAD: ALL OK!!!!');
            // results.msg = htmlResponseMsg;
            log.info(htmlResponseMsg);
        
            var Msg = {
                    "documentId" : ENV_FORM_CONFIG.idIstanza,
                    "actionId": "ISTANZA_INVIATA",
                    "title": "Istanza ricevuta con successo!",
                    "idIstanza": ENV_FORM_CONFIG.idIstanza,
                    "msg": objFieldSanitized,
                    "txtMsg": ENV_FORM_CONFIG.messaggioRisposta,
                    "htmlMsg": htmlResponseMsg,
                    "reqId": reqId,
                    code : 200
            }
            
            logEmail.info(Msg);
            logElastic.info(Msg);
            
            res.status(200).send(Msg);
        }
    });

 

});
  return router;
}
