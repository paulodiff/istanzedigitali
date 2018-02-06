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
var nodemailer = require('nodemailer');
var request = require('request');
// http://embed.plnkr.co/iwZplV/
var moment = require('moment');
var mime = require('mime');
var async = require('async');
var handlebars = require('handlebars');
var validator = require('validator');
// var Segnalazione  = require('../models/segnalazione.js'); // load configuration data
// var flow = require('../models/flow-node.js')('tmp'); // load configuration data

var utilityModule  = require('../models/utilityModule.js'); 
var databaseModule = require("../models/databaseModule.js");

var log = require('log4js').getLogger("app");

var ReCaptcha = require("../models/recaptchaModule.js");
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


router.get('/getInfoIstanza/:formId', function (req, res) {

    log.info('/getInfoIstanza/');

    if(!req.params.formId){
        log.error('getInfoIstanza:NOT FOUND');
        log.error(reqId);
        res.status(500).send('getInfoIstanza:NOT FOUND');
        return;
    } else {
        var fConfigName = ENV_PROT.baseFolder + '/' + ENV_PROT.configUserFolder + '/' + ENV_PROT.configFilePREFIX + '-' + req.params.formId + '.js';
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
                msg: 'Errore loadingDefault messaggio di risposta. '  + supportMsg,
                code : 459
            }
        }
        var objRet = {};
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

        res.status(200).send(objRet);
        return;
    }

});



/* Chiamata di TEST /ping */



router.get('/ping', function (req, res) {
    var p = {};

    log.info('ASYNC preparazione messaggio risposta:');
    var fileContents = '';
    var templateFileName = ENV_PROT.templateFileName;



    // var data = dataSAMPLE; // dati di esempio
    var model = {};
    
    model.reqId = 'AAAAAAAAAAAAAA@MARIO';
    model.annoProtocollo = '2016';
    model.numeroProtocollo = '12345678';
    model.dataProtocollo = '01/01/2017';
    model.nomeRichiedente = 'MARIO';
    model.cognomeRichiedente = 'ROSSI';
    model.emailRichiedente = 'ruggero.ruggeri@comune.rimini.it';
    model.emailRichiedenteConferma = 'ruggero.ruggeri@comune.rimini.it';
    model.codiceFiscaleRichiedente = 'RGGRGR70E25H294T';
    model.cellulareRichiedente = '3355703086';
    model.dataNascitaRichiedente = '11/12/1912';
    model.indirizzoRichiedente = 'VIA ROMA, 1';
    model.cittaRichiedente = 'RIMINI';
    model.capRichiedente = '47921';
    model.emailRichiedenteConferma = 'ruggero.ruggeri@comune.rimini.it';
    model.oggettoRichiedente = 'Invio richiesta generica Sig. MARIO ROSSI, cortesemente ....';
    var template = handlebars.compile(fileContents);
    var xmlBuilded = template(model);

    res.send(xmlBuilded);
});


/* PROTOCOLLO  --------------------------------------------------------------------------------------------------------- */

function protocolloWS(objFilesList,  reqId) {

    log.info('protocolloWS');

    WS_IRIDE = ENV_PROT.wsJiride.url;
    WS_IRIDE_ENDPOINT = ENV_PROT.wsJiride.endpoint;

    log.info(WS_IRIDE);
    log.info(WS_IRIDE_ENDPOINT);

    // formattazione data per il WS
    log.info(objFilesList.dataNascitaRichiedente);


    // preparazione dati

    var args = { 
           ProtoIn : {
                Data: moment().format('DD/MM/YYYY'),
                Classifica: ENV_PROT.wsJiride.classifica,
                TipoDocumento: ENV_PROT.wsJiride.tipoDocumento,
                Oggetto: objFilesList.oggettoRichiedente,
                Origine: ENV_PROT.wsJiride.origine,
                MittenteInterno: ENV_PROT.wsJiride.mittenteInterno,
                //MittenteInterno_Descrizione": "",
                AnnoPratica: ENV_PROT.wsJiride.annoPratica,
                NumeroPratica: ENV_PROT.wsJiride.numeroPratica,

                 
               MittentiDestinatari: {
                MittenteDestinatario: [
                  {
                    CodiceFiscale : objFilesList.codiceFiscaleRichiedente,
                    CognomeNome: objFilesList.cognomeRichiedente + ' ' + objFilesList.nomeRichiedente,
                    DataNascita : objFilesList.dataNascitaRichiedente,
                    Indirizzo : objFilesList.indirizzoRichiedente,
                    Localita : objFilesList.cittaRichiedente,
                    // Spese_NProt : 0,
                    // TipoSogg: 'S',
                    TipoPersona: ENV_PROT.wsJiride.tipoPersona,
                    Recapiti: {
                        Recapito: [
                            {
                                TipoRecapito: 'EMAIL',
                                ValoreRecapito: objFilesList.emailRichiedente
                            }
                        ]
                    }
                  }
                ]
              },
              
              AggiornaAnagrafiche : ENV_PROT.wsJiride.aggiornaAnagrafiche,
              InCaricoA : ENV_PROT.wsJiride.inCaricoA,
              Utente : ENV_PROT.wsJiride.utente,
              Ruolo : ENV_PROT.wsJiride.ruolo,              
              Allegati: {  Allegato: []  }
            }
        };

    // build attachements array
    log.info(args);

    var DW_PATH = ENV_PROT.storageFolder;
    var dir = DW_PATH + "/" + reqId;
    
    objFilesList.files.forEach(function(obj){
        log.info('adding:', dir + '/' + obj.name);
        ext = obj.name.substring(obj.name.length - 3);
        log.info(ext);

        // allegato principale
        args.ProtoIn.Allegati.Allegato.push(
            {
                TipoFile : ext,
                ContentType : mime.lookup(dir + '/' + obj.name),
                Image: utilityModule.base64_encode(dir + '/' + obj.name),
                NomeAllegato: obj.name,
                Commento : ''
            }
        );
    });

    // AGGIUNGE I metadati
    var fMetadati = reqId + '.txt';
    log.info('aggiunta metadati', fMetadati);
    args.ProtoIn.Allegati.Allegato.push(
        {
            TipoFile : 'txt',
            ContentType : mime.lookup(dir + '/' + fMetadati),
            Image: utilityModule.base64_encode(dir + '/' + fMetadati),
            NomeAllegato: fMetadati,
            Commento : ''
        }
    );
    
    // var p7m1 = utilityModule.base64_encode('./test.pdf.p7m');
    // var pdf1 = utilityModule.base64_encode('./test.pdf');

    var soapResult = { result : '....'};
 
    var soapOptions = {
        endpoint: WS_IRIDE_ENDPOINT
    };

    log.info('create client');


    return new Promise(function (resolve, reject) {



        soap.createClient(WS_IRIDE, soapOptions, function(err, client){
            
            if (err) {
                var msg = 'Errore nella creazione del client soap';
                log2file.error(msg); log2file.error(err); log.error(err);
                reject(err);
            } else {

                client.InserisciProtocolloEAnagrafiche(args,  function(err, result) {
                //client.InserisciProtocollo(args,  function(err, result) {
                
                    if (err) {
                        var msg = 'Errore nella chiamata ad InserisciProtocollo';
                        log2file.error(msg);  log2file.error(err);  log.error(msg);
                        console.log(args);
                        reject(err);
                    } else {
                        resolve(result);
                    }

                });
            }

            }); //client.InserisciProtocollo
     }); //soap.createClient

}

/* UPLOAD ROUTE  --------------------------------------------------------------------------------------------------------- */
/* UPLOAD ROUTE  --------------------------------------------------------------------------------------------------------- */
/* UPLOAD ROUTE  --------------------------------------------------------------------------------------------------------- */
/* UPLOAD ROUTE  --------------------------------------------------------------------------------------------------------- */

//router.post('/upload', multipartMiddleware, function(req, res) {
router.post('/upload/:formId', 
    // utilityModule.ensureAuthenticated,
    // utilityModule.recaptchaVerifier,
    function(req, res) {


    log.info('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ UPLOAD: after authorization ...');
    log.info(req.params.formId);
    var bRaisedError = false;
    var ErrorMsg = {};
    var ENV_FORM_CONFIG = {};

    // richiesta di identificatore unico di transazione
    var reqId = utilityModule.getTimestampPlusRandom();

    log.info('UPLOAD: reqId ...' + reqId);

    ErrorMsg.reqId = reqId;

    // aggiunge reqId all'utente identificato
    if(req.user) {
        req.user.reqId = reqId;
    } else {
        req.user = {};
        req.user.reqId = reqId;
    }


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
                    msg: 'Errore loadingDefault messaggio di risposta. '  + supportMsg,
                    code : 459
                }
                callback(ErrorMsg, null);
            } else {
                var fConfigName = ENV_PROT.baseFolder + '/' + ENV_PROT.configUserFolder + '/' + ENV_PROT.configFilePREFIX + '-' + req.params.formId + '.js';
                // var fConfigName = ENV_PROT.configUserFolder + '/' + ENV_PROT.configFilePREFIX + '-' + user.userCompany + '.js';
                log.info('loadingDefault : load default data : ' + fConfigName);
         
                try {
                    ENV_FORM_CONFIG = require(fConfigName);
                    // log.info(ENV_FORM_CONFIG);
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


        // ##### PARSING ------------------------------------------------
        function(callback) {
            log.info('UPLOAD: ASYNC form parsing');
        
            var options = {  
                maxFilesSize: ENV_PROT.upload_size,
                autoFiles: true,
                uploadDir: ENV_PROT.upload_dir
            };
        
            log.info(options);  
            var form = new multiparty.Form(options);

            log.info('---------------------------------------------------------');  
            log.info(req.body);  
            log.info('---------------------------------------------------------');  

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
                        log.info('---- FieldList ----------------------------');
                        log.info(objFieldList);
                        log.info('---- FilesList ----------------------------');
                        log.info(objFilesList);
                        callback(null, 'UPLOAD: ASYNC form parsing success!');
                    }
                });
        },
        // ##### Input sanitizer & validator------------------------------------------------------------------------

        function(callback){
            log.info('UPLOAD: ASYNC sanitizeInput:');

            if (pM.sanitizeInput(objFieldList, objFieldSanitized, reqId)){
                log.info('UPLOAD: ASYNC sanitizeInput: ok');
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

        // ##### Input sanitizer & validator------------------------------------------------------------------------

        function(callback){
            log.info('UPLOAD: ASYNC sanitizefile:');

            if (pM.sanitizeFile(objFilesList, ENV_FORM_CONFIG)){
                log.info('UPLOAD: ASYNC sanitizeFile: ok');
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


        // ##### Saving files ------------------------------------------------------------------------

        function(callback){
            log.info('UPLOAD: ASYNC savingFiles:');

            if (pM.savingFiles(objFilesList, objFieldSanitized, req.user )){
                log.info('UPLOAD: ASYNC savingFiles: ok');
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

        function(callback){
            log.info('ASYNC HASH file check:');
            callback(null, 'Hash file check ... ok');
        },

        // ##### Protocollazione ------------------------------------------------------------------------

            function(callback){

                log.info('ASYNC protocolloWS:GO!');
                    objDatiProtocollo = {};
                  
                    /*
                    objDatiProtocollo.InserisciProtocolloEAnagraficheResult = {};
                    objDatiProtocollo.InserisciProtocolloEAnagraficheResult.IdDocumento = 12345678;
                    objDatiProtocollo.InserisciProtocolloEAnagraficheResult.AnnoProtocollo = 2099;
                    objDatiProtocollo.InserisciProtocolloEAnagraficheResult.NumeroProtocollo = 2100;
                    objDatiProtocollo.InserisciProtocolloEAnagraficheResult.DataProtocollo = 'GG/MM/AAAA';
                    objDatiProtocollo.InserisciProtocolloEAnagraficheResult.Messaggio = 'Inserimento Protocollo eseguito con successo, senza Avvio Iter';
                    */


                pM.protocolloWS(objFieldSanitized, reqId, ENV_FORM_CONFIG, ENV_PROT)
                    .then( function (result) {
                        log.info(result);
                        objDatiProtocollo = result;
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
                
            },

            // ##### SAVING TO DISK ------------------------------------------------------------------------

            /*
            function(callback){

                if (fakeConfig.savingToDisk == 1){

                    log.info('ASYNC salvataggio dati protocollo nella cartella:');
                    // save protocollo
                    var DW_PATH = ENV_PROT.storageFolder;
                    var dir = DW_PATH + "/" + reqId;
                    var jsonFile = dir + "/PROTOCOLLO.txt";
                    log.info(jsonFile);
                    log.info(objDatiProtocollo);
                    fs.writeFileSync(jsonFile, JSON.stringify(objDatiProtocollo));
                    callback(null, 'salvataggio dati protocollo nella cartella ... ok');
                }

                if (fakeConfig.savingToDisk == 0){
                    log.info('ASYNC salvataggio dati FAKE FAKE protocollo nella cartella:');
                    callback(null, 'salvataggio dati protocollo nella cartella ... FAKE ok');
                }

                if (fakeConfig.savingToDisk == 2){
                    log.info('ASYNC salvataggio dati FAKE FAKE protocollo nella cartella:');
                    ErrorMsg = {
                        title: 'saving file error',
                        msg: 'Errore nella memorizzazione remota dei files.' + supportMsg,
                        code : 457
                    };
                    callback(ErrorMsg, 'salvataggio dati protocollo nella cartella ... FAKE ERROR');
                }
                

            },
            */

            /*

            // ###### SAVING ISTANZA TO DB ----------------------------------------------------------------------
            function(callback){
                log.info('ASYNC salvataggio istanza to DB:');

                var istanzaData = { 
                    ts : new Date(),
                    tipoIstanza: 0,
                    userid: req.user.userid,
                    AuthUuidV4 : req.user.uuidV4,
                    statoIter : 0,
                    emailNotifiche: objFieldSanitized.emailRichiedente,
                    fileSystemId : reqId,
                    protocolloIdDocumento : objDatiProtocollo.InserisciProtocolloEAnagraficheResult.IdDocumento,
                    protocolloAnno : objDatiProtocollo.InserisciProtocolloEAnagraficheResult.AnnoProtocollo,
                    protocolloNumero : objDatiProtocollo.InserisciProtocolloEAnagraficheResult.NumeroProtocollo
                };


                databaseModule.saveIstanza(istanzaData).then(function (response) {
                        log.info('ASYNC dati istanza salvati OK!');
                        callback(null, 'Dati istanza salvati su database');
                    }
                ).catch(function (err) {
                    log.error(reqId);
                    log.error(err);
                    ErrorMsg = {
                        title: 'Errore salvataggio istanza su DB',
                        msg: 'Errore salvataggio istanza su DB '  + supportMsg,
                        code : 459
                    }
                    callback(ErrorMsg, null);
                });

            },

            */

            // ###### BUILD Response Message ----------------------------------------------------------------

            function(callback){
                log.info('ASYNC preparazione messaggio risposta:');
 
                var fileContents = '';
                var templateFileName = ENV_PROT.templateFileName;

                try {
                    fileContents = fs.readFileSync(templateFileName).toString();
                } catch (err) {
                    log.error(reqId);
                    log.error(err);
                    ErrorMsg = {
                        title: 'Errore preparazione messaggio',
                        msg: 'Errore preparazione messaggio di risposta. '  + supportMsg,
                        code : 459
                    }
                    callback(ErrorMsg, null);
                }

                objFieldSanitized.idProtocollo =  objDatiProtocollo.InserisciProtocolloEAnagraficheResult.IdDocumento;
                objFieldSanitized.annoProtocollo = objDatiProtocollo.InserisciProtocolloEAnagraficheResult.AnnoProtocollo;
                objFieldSanitized.numeroProtocollo = objDatiProtocollo.InserisciProtocolloEAnagraficheResult.NumeroProtocollo;
                objFieldSanitized.dataProtocollo = objDatiProtocollo.InserisciProtocolloEAnagraficheResult.DataProtocollo;
            
                var template = handlebars.compile(fileContents);
                htmlResponseMsg = template(objFieldSanitized);
                callback(null, 'Messaggio di risposta preparato ok');

            },

            // ##### Mail Send ------------------------------------------------------------------------

            function(callback){

              
                    log.info('ASYNC invio mail:');

                    log.info(objDatiProtocollo.InserisciProtocolloEAnagraficheResult.IdDocumento);
                    log.info(objDatiProtocollo.InserisciProtocolloEAnagraficheResult.AnnoProtocollo);
                    log.info(objDatiProtocollo.InserisciProtocolloEAnagraficheResult.NumeroProtocollo);
                    callback(null, 'Invio mail preparato ok');

                // var msg = "Comune di Rimini - Protocollo " +  objDatiProtocollo.InserisciProtocolloEAnagraficheResult.AnnoProtocollo + "/" + objDatiProtocollo.InserisciProtocolloEAnagraficheResult.NumeroProtocollo;
                // create reusable transporter object using the default SMTP transport

            }
             

    ],function(err, results) {
        // results is now equal to: {one: 1, two: 2}
        log.info('UPLOAD: ASYNC FINAL!:');
        if(err){
            log.error(err);
            res.status(ErrorMsg.code).send(ErrorMsg);
        } else {
            log.info('UPLOAD: ALL OK!!!!');
            // results.msg = htmlResponseMsg;
            log.info(htmlResponseMsg);
            var Msg = {
                            title: 'Istanza ricevuta con successo!',
                            msg: objFieldSanitized,
                            htmlMsg: htmlResponseMsg,
                            reqId: reqId,
                            code : 200
                        }
            res.status(200).send(Msg);
        }
    });




  

});


router.post('/inserisciProtocollo',  utilityModule.ensureAuthenticated, function(req, res){

    log2fileAccess.info('# user ---------------');
    log2fileAccess.info(req.user);
    log2fileAccess.info('# body ---------------');
    log2fileAccess.info(req.body);

    // WS_IRIDE = ENV_BRAV.wsiride.url_test;
    WS_IRIDE = ENV_PROT.wsJiride.url_test;
    log2fileAccess.info(WS_IRIDE);

        
    log2fileAccess.info('MODO_OPERATIVO:', MODO_OPERATIVO);
    log2fileAccess.info('WS_IRIDE:',WS_IRIDE);
    // ## log info ip

    console.log('companyName:', req.user.companyName);

    // recupero dati di protocollazione
    if(req.user.companyName != "Comune_di_Rimini"){
        var msg = 'userCompany NO MATCH'
        console.error(msg);
        log2file.error(msg);
        res.status(401).json({message : msg});
        return;
    } else {
        log2fileAccess.error('non trovo companyName');
    }

    log2fileAccess.info('Log in:');
    log2fileAccess.info(req.user);


    var p7m1 = utilityModule.base64_encode('./test.pdf.p7m');
    var pdf1 = utilityModule.base64_encode('./test.pdf');

    /*
    // ## test Json Validation
    console.log('[*] Validation ...');
    // console.log(req.body);
    
    var Ajv = require('ajv');
    var ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
    
    var schema = JSON.parse(fs.readFileSync('./protocolloSchema.json'));
    // var j2validate = JSON.parse(fs.readFileSync('./pacchettoBRAV.json'));
 
    var validate = ajv.compile(schema);
    var valid = validate(req.body);
    // console.log(valid);
    if (!valid) {
        console.error(validate.errors);
        var msg = 'Json validation error';
        console.error(msg);
        log2file.error(msg);
        log2file.error(validate.errors);
        res.status(401).json({message : msg, jsonvalidation : validate.errors});
        return;
    }

    */

    //  ## Chiamata a protocollo ....

    /*
    console.log('// BODY ------------------------------------------------- ');
    console.log(req.body);
    console.log('// RICHIEDENTE ------------------------------------------------- ');
    console.log(req.body.richiedente);
    console.log('// RICHIEDENTE ------------------------------------------------- ');
    console.log(req.body.richiedente.nome);

    var DataProtocollo = "01/01/2000";
    var OggettoDescrizione = "BRAV PERMESSO N. " + req.body.numeroIdentificativoPermesso;
    var IdTipoDocumento = ENV_BRAV.wsiride.tipo_documento;
    var CodiceFiscale = req.body.richiedente.codiceFiscale;
    var CognomeNome = req.body.richiedente.cognome + ' ' + req.body.richiedente.nome;
    var DataDiNascita =  req.body.richiedente.dataDiNascita;
    var Note = "NOTE";
    var base64content = new Buffer(Note).toString('base64');

    */

    var args = { 
           ProtoIn : {
                Data: '30/11/2016',
                Classifica: '001 010 001',
                TipoDocumento: '44032',
                Oggetto: 'Protocollo del ' + new Date(),
                Origine: 'A',
                MittenteInterno: '404',
                //MittenteInterno_Descrizione": "",
                AnnoPratica: '2016',
                NumeroPratica: '2016-404-0003',

                 
               MittentiDestinatari: {
                MittenteDestinatario: [
                  {
                    CodiceFiscale : 'RGGRGR70E25H294T',
                    CognomeNome: 'RUGGERI RUGGERO',
                    DataNascita : '01/01/1970',
                    Indirizzo : 'via roma, 1 - RIMINI (RN)',
                    Localita : 'RIMINI',
                    // Spese_NProt : 0,
                    // TipoSogg: 'S',
                    TipoPersona: 'FI',
                    Recapiti: {
                        Recapito: [
                            {
                                TipoRecapito: 'EMAIL',
                                ValoreRecapito: 'ruggero.ruggeri@comune.rimini.it'
                            }
                        ]
                    }
                  }
                ]
              },
              
              AggiornaAnagrafiche : 'S',
              InCaricoA : '404',
              NumeroDocumento : 1,
              NumeroAllegati : 2,
              Utente : "wsalbo",
              Ruolo : "SETTORE SISTEMA INFORMATIVO",              
              Allegati: {  Allegato: []  }
            }
        };

// build attachements array

    
    
    // allegato principale
    args.ProtoIn.Allegati.Allegato.push(
        {
            TipoFile : 'pdf',
            ContentType : 'application/pdf',
            Image: pdf1,
            NomeAllegato: 'test.pdf',
            Commento : 'Allegato Principale PDF'
        }
    );

    

    // allegati secondari
    console.log(req.body.numeroAllegati);

    if (parseInt(req.body.numeroAllegati) > 0) {
        req.body.allegati.forEach( function(item){

            args.ProtoIn.Allegati.Allegato.push(
                {
                    TipoFile : 'p7m',
                    ContentType : 'application/pkcs7-mime',
                    NomeAllegato: 'test.pdf.p7m',
                    Image: p7m1,
                    Commento :  'Allegato Principale P7m'
                }
            );

        })
    }
    

    // console.log(util.inspect(args));
    // console.log(util.inspect(args.ProtoIn.MittentiDestinatari));
    // console.log(util.inspect(args.ProtoIn.Allegati));
    // console.log('wsurl:');

    // console.log(WS_IRIDE);

    var soapResult = { result : '....'};
    
    var soapOptions = {
        endpoint: 'http://10.10.129.111:58000/client/services/ProtocolloSoap?CID=COCATEST'
    };

    soap.createClient(WS_IRIDE, soapOptions, function(err, client){
        
        console.log('soap call.....');
        // log2file.debug(client.describe());
        // console.log(client.describe());

        if (err) {
            var msg = 'Errore nella creazione del client soap';
            console.log(err);
            log2file.error(msg);
            log2file.error(err);
           res.status(500).json({
                msg : msg,
                message : err
            });
            return;
        }



        //client.InserisciProtocollo(args,  function(err, result) {
        client.InserisciProtocolloEAnagrafiche(args,  function(err, result) {
           
            console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>c I PPPPPPP');

           // log2file.debug(result);
           // console.log(result);

           if (err) {
               var msg = 'Errore nella chiamata ad InserisciProtocollo';
                console.log(client.describe());
                console.log(err);
                log2file.error(msg);
                log2file.error(err);
                console.log(util.inspect(args.ProtoIn.MittentiDestinatari));
                console.log(util.inspect(args.ProtoIn.Allegati));
                // console.log(util.inspect(args.ProtoIn.Allegati2));
 
                res.status(500).json({msg : msg, message : err});
                return;
            };

            //soapResult = result;
            result.modoOperativo = MODO_OPERATIVO;
            log2fileAccess.debug(JSON.stringify(result));
            res.status(200).send(result);

        }); //client.InserisciProtocollo

        // res.status(200).send('ok');

	}); //soap.createClient


    // Memorizzazioni ulteriori

    console.log('Saving data to disk ...');

    // save to disk
   
    var dir = ENV.storagePath + "/" +  ENV_PROT.storage_folder;
    console.log(dir);
    
    try {
        if (!fs.existsSync(dir)){fs.mkdirSync(dir);}
        
        // var fileName = dir + '/' + utilityModule.getTimestampPlusRandom() + '-req.body.txt';
        // fs.writeFileSync(fileName, req.body);

        // var fileName = dir + '/' + utilityModule.getTimestampPlusRandom() + '-req.body.json.txt';
        // fs.writeFileSync(fileName, JSON.stringify(req.body), 'utf-8');

        var fileName = dir + '/' + utilityModule.getTimestampPlusRandom() + '-req.body.util.txt';
        fs.writeFileSync(fileName,util.inspect(req.body), 'utf-8');

        var fileName = dir + '/' + utilityModule.getTimestampPlusRandom() + '-args.txt';
        //str = JSON.stringify(obj, null, 4);
        fs.writeFileSync(fileName,JSON.stringify(args, null, 4), 'utf-8');

        log2fileAccess.debug('2disk!:' + fileName);

    } catch (err) {
        log2file.error('Errore save file!');
    }

});


router.get('/leggiProtocollo', function(req, res) {

       // WS_IRIDE = ENV_BRAV.wsiride.url_test;
        WS_IRIDE = ENV_BRAV.wsJiride.url_test;

        console.log(WS_IRIDE);
        console.log('create client....');

        var soapOptions = {
            endpoint: 'http://10.10.129.111:58000/client/services/ProtocolloSoap?CID=COCATEST'
        };

        soap.createClient(WS_IRIDE, soapOptions, function(err, client){
        
            console.log('soap call.....');
            // log2file.debug(client.describe());
            // console.log(client.describe());

            if (err) {
                var msg = 'Errore nella creazione del client soap';
                console.log(err);
                res.status(500).json({
                        msg : msg,
                        message : err
                    });
                return;
            }

            // console.log(client.describe());
    
            var pars = {
                AnnoProtocollo : 2016,
                NumeroProtocollo : 1,
                Utente : "wsalbo",
                Ruolo : "SETTORE SISTEMA INFORMATIVO"
            };

            client.LeggiProtocollo(pars, function(err, result) {
                // log2file.debug(result);
                // console.log(result);

                if (err) {
                    var msg = 'Errore nella chiamata a LeggiProtocollo';
                    //console.log(client.describe());
                    // console.log(err);
                    console.log('##', new Date(), "--------------------------------------");
                    console.log(err.response.request);
                    // log2file.error(msg);
                    // log2file.error(err);
                    res.status(500).json({"msg" : msg, "message" : err.response});
                    return;
                } else {
                    res.status(200).json(result);
                }
   
            }); 
 
        });

        // res.status(201).json('ok');
});


router.get('/j', function(req, res) {
    var Ajv = require('ajv');
    var ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
    var schema = JSON.parse(fs.readFileSync('./bravSchema.json'));
    var j2validate = JSON.parse(fs.readFileSync('./pacchettoBRAV.json'));


    log2file.debug('Saving data to disk');

    // save to disk
   
    var dir = ENV.storagePath + "/" +  ENV_BRAV.storage_folder;
    log2file.debug('Errore nella creazione del client soap...');
    
    console.log(dir);
    
    try {

        if (!fs.existsSync(dir)){fs.mkdirSync(dir);}

        var fileName = dir + '/' + utilityModule.getTimestampPlusRandom() + '.data';
        console.log(fileName);

        fs.writeFileSync(fileName, j2validate);

        log2file.debug('Data saved!');
        log2file.debug(fileName);
    } catch (err) {
        log2file.error('Errore save file!');
    }

    function base64_encode(file) {
        // read binary data
        var bitmap = fs.readFileSync(file);
        // convert binary data to base64 encoded string
        return new Buffer(bitmap).toString('base64');
    }


    fs.writeFileSync('./b64PDF.txt', base64_encode('./prova.min.pdf'));
    fs.writeFileSync('./b64JPG.txt', base64_encode('./prova.min.jpg'));
    fs.writeFileSync('./b64TIF.txt', base64_encode('./prova.min.tif'));

    console.log(schema);
    console.log(j2validate);

   
    var validate = ajv.compile(schema);
    var valid = validate(j2validate);
    console.log(valid);
    if (!valid) console.log(validate.errors);
    res.status(201).json(valid);
});



/*router.get('/i',function(req, res) {

    console.log('i--protocollazione---------------');
    
    var DataProtocollo = "01/01/2000";
    var OggettoDescrizione = "BRAV - TEST - OGGETTO";
    var IdTipoDocumento = ENV_BRAV.wsiride.tipo_documento;
    var CodiceFiscale = 'RGGRGR70E25H294T';
    var CognomeNome = "RUGGERI RUGGERO";
    var DataDiNascita =  "25/05/1970";
    var Note = "NOTE";
    var base64content = new Buffer(Note).toString('base64');


    var args = { 
           ProtoIn : {
                Data: DataProtocollo,
                Classifica: ENV_BRAV.wsiride.classifica,
                TipoDocumento: IdTipoDocumento,
                Oggetto: OggettoDescrizione,
                Origine: 'A',
                MittenteInterno: ENV_BRAV.wsiride.mittente_interno,
                //MittenteInterno_Descrizione": "",
                 
               MittentiDestinatari: {
                MittenteDestinatario: [
                  {
                    CodiceFiscale : CodiceFiscale,
                    CognomeNome: CognomeNome,
                    DataNascita : DataDiNascita,
                    // Nome : 'RUGGERO',
                    // Spese_NProt : 0,
                    // TipoSogg: 'S',
                    // TipoPersona : 'F'
                  }
                ]
              },
              
              AggiornaAnagrafiche : 'S',
              InCaricoA : ENV_BRAV.wsiride.inCaricoA,
              NumeroDocumento : 1,
              NumeroAllegati : 1,
              Utente: ENV_BRAV.wsiride.utente,
              Ruolo: ENV_BRAV.wsiride.ruolo,
               
                Allegati: {
                  Allegato: [
                    {
                      TipoFile : 'txt',
                      ContentType : 'text/plain',
                      Image: base64content,
                      Commento : 'txt'
                    },
                    {
                      TipoFile : 'pdf',
                      ContentType : 'application/pdf',
                      Image: fPDF,
                      Commento : 'PDF'
                    },
                    {
                      TipoFile : 'tiff',
                      ContentType : 'image/tiff',
                      Image: fTIF,
                      Commento : 'TIF'
                    },
                    {
                      TipoFile : 'jpeg',
                      ContentType : 'image/jpeg',
                      Image: fJPG,
                      Commento : 'JPG'
                    }
                  ]
                }
               
            }
        };

    console.log(args);
    console.log('wsurl:');
    console.log(ENV_BRAV.wsiride.url);

    soap.createClient(ENV_BRAV.wsiride.url, function(err, client){
        
        console.log('soap call.....');
        log2file.debug(client.describe());
        console.log(client.describe());

        if (err) {
            console.log(err);
            log2file.error('Errore nella creazione del client soap...');
            log2file.error(err);
            res.status(500).json({message : err});
            return;
        }
 
        client.InserisciProtocollo(args, function(err, result) {
           
           log2file.debug(result);

           if (err) {
                console.log(err);
                log2file.error('Errore nella chiamata ad InserisciProtocollo');
                log2file.error(err);
                res.status(500).json({message : err});
                return;
              // TODO: RISPOSTA CON ERRORI
            };

  
            res.status(200).json({   
                      description : 'Risultato chiamata a protocollo', 
                      message: result 
            });
            return;
        }); //client.InserisciProtocollo
	}); //soap.createClient


    console.log('fine soap!');

});

*/
// route per la protocollazione
router.post('/protocolloTEST', multipartMiddleware, /* utilityModule.ensureAuthenticated, */  function(req, res) {
      console.log('/protocollo .... ');
      
      console.log(req.body);
      console.log(req.query);
      console.log(req.user);

      var searchCriteria = {};

      // from button OR
      var filterObjArray = [];
      if (req.query.filterButton) {
        if(_.isArray(req.query.filterButton)) {
          _(req.query.filterButton).forEach(function(v){
              console.log(v);
              var regex = new RegExp(".*" + v + ".*", "i");
              var obj1 =  {  "formModel.segnalazione.softwareLista": v   };
              filterObjArray.push(obj1);
          });
        } else {
              var regex = new RegExp(".*" + req.query.filterButton + ".*", "i");
              var obj1 =  {  "formModel.segnalazione.softwareLista": req.query.filterButton   };
              filterObjArray.push(obj1);
        }
      }

      console.log(filterObjArray);      

      // from input text
      if(req.query.filterData){
        var filterData = JSON.parse(req.query.filterData);
        console.log(filterData);
      }

      if(filterData) {
        console.log('1');
        console.log(req.query.filterData);
        if(filterData.globalTxt){
          console.log('2');

          //var stringToGoIntoTheRegex = "abc";
          var regex = new RegExp(".*" + filterData.globalTxt + ".*", "i");
          // at this point, the line above is the same as: var regex = /#abc#/g;

          var filterDataSearchCriteria =  {  "formModel.segnalazione.utenteRichiedenteAssistenza": regex   };
          searchCriteria["formModel.segnalazione.utenteRichiedenteAssistenza"] = regex;
        };    
      }
       
      console.log('----------------searchCriteria----------------------');
      if (!_.isEmpty(filterObjArray)){
          searchCriteria['$or'] =  filterObjArray;
      }
      console.log(searchCriteria);

      collection.find( searchCriteria ).skip(pagesize*(n-1)).limit(pagesize).toArray(function(err, docs) {
        console.log("Found the following records ... ");
        //console.dir(err);
        console.log(err);
        if(err){
            res.status(500).json(err);
        }else{
            res.status(201).json(docs);
        }
      });      
});




  return router;
}
