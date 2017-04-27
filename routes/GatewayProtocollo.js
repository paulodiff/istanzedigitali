// GatewayProtocollo
// fornisce le funzioni per realizzare un GatewayProtocollo
// Funzionalità

// Controllo validità Json
// Verifica token company name e recupero file di configurazione
// Protocollazione
// Salvataggio dati
// Ritorno


// modifiche proposte
// Mancano indicazioni sul fasciolo Anno/Numero + Città richiedente + OGGETTO
// Mancano informazioni sul tipo allegato (pdf doc ecc.)
// Modificare la descrizione del file allegato

// Possibilità di semplificazione: lista attributi obbligatori e lista non obbligatori

var fakeConfig = {
        parsingValues: 1, // 1 sempre decodifica  i parametri dei form
        captCha : 1, // 1 abilitata 0 disabilitata/fake 2 errore
        savingToDisk: 1,
        protocollazione: 1,
        emailsend: 1
};

// -------------------------------------------------------------------------------------------------

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
var ENV   = require('../tmp/config.js'); // load configuration data
var ENV_PROT   = require('../tmp/configPROTOCOLLO.js'); // load user configuration data
var ENV_DEFAULT_USER = {};
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
var Ajv = require('ajv');
  

var ACCESS_CONTROLL_ALLOW_ORIGIN = false;
// var DW_PATH = (path.join(__dirname, './storage'));
// var DW_PATH = './storage';
// var DW_PATH = ENV.storagePath;

var log4js  = require('log4js');
log4js.configure({
  appenders: [
    { type: 'console' },
    { type: 'file', 
      filename: 'log/error-' + ENV_PROT.log_filename, 
      category: 'error-file-logger-protocollo',
      maxLogSize: 120480,
      backups: 10 
    },
    { type: 'file', 
      filename: 'log/access-' + ENV_PROT.log_filename, 
      category: 'access-file-logger-protocollo',
      maxLogSize: 120480,
      backups: 10 
    },
    {
     type: 'smtp',
     recipients: 'ruggero.ruggeri@comune.rimini.it',
     sender: 'ruggero.ruggeri@comune.rimini.it',
     category: 'email-log',
     subject : '[ISTANZE DIGITALI]',
     sendInterval: 60,
     'SMTP': {
            "host": "srv-mail.comune.rimini.it",
            "secure": false,
            "port": 25
            // , "auth": { "user": "foo@bar.com", "pass": "bar_foo"  }
        }
    }
  ]
});

var logger = log4js.getLogger();
// init logging
var logConsole  = log4js.getLogger();
// var loggerDB = log4js.getLogger('mongodb');
var log2Email = log4js.getLogger('email-log');

var log2file = log4js.getLogger('error-file-logger-protocollo');
log2file.setLevel(ENV_PROT.log_level);

var log2fileAccess = log4js.getLogger('access-file-logger-protocollo');

module.exports = function(){

var WS_IRIDE =  "";
var MODO_OPERATIVO = "TEST";

/* 
    
    Chiamata di TEST /ping per controllo stato 
    
    (se passo parametro con dati ritorno token e verifica token)

*/

router.get('/ping', function (req, res) {
    var p = {};

    logConsole.info('PING :');
    var fileContents = '';
    var templateFileName = ENV_PROT.templateFileName;

    try {
        fileContents = fs.readFileSync(templateFileName).toString();
    } catch (err) {
        logConsole.error('WSCALL:templateFileName: ' + templateFileName + ' NON TROVATA in configurazione');
        res.status(500).send('WSCALL:templateFileName: ' + templateFileName + ' NON TROVATA in configurazione');
        return;
    }

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

    // res.send(xmlBuilded);
    
    var user = {
        "userCompany": "BRAVSRL",
        "userId": "utente",
        "userEmail": "info@brav.it",
        "userDescription": "Via del Portello 4/B 41058 Vignola (MO)",
        "userPassword": "password"
    };
    
    res.status(200).send(utilityModule.createJWT(user,700,'d'));
    //res.status(200).send({msg:'ok'});

    log2Email.info('Ciao');


    async.series([
    function(callback) {
        console.log('one:');
        p.one = 1;
        callback(null, 'one');
    },
    function(callback){
        console.log('two:');
        p.two = 'ok - two';
        callback(null, 'two');
        //setTimeout(function() {         callback(null, 'two');      }, 1);
    },
    function(callback){
        console.log('tre:');
        p.three = 'three';
        callback(null, 'tre');
        // setTimeout(function() {   callback(null, 3);    }, 1);
    }
   ], function(err, results) {
    // results is now equal to: {one: 1, two: 2}
    if(err){
        console.log(p);
        // res.send('ERRORE:' + err);
    } else {
        console.log('completed!');
        // res.send(p);
    }
});
});


/*

    CHECK Json Schema


*/

function checkJsonSchema(req){
    logConsole.info('checkJsonSchema');
    var appRoot = process.cwd();
    console.log(appRoot);

    var fConfigName = appRoot + '/' + ENV_PROT.schemaFolder + '/' + ENV_DEFAULT_USER.user_json_schema;
    logConsole.info(fConfigName);
    var ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
    var schema = JSON.parse(fs.readFileSync(fConfigName));
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
        return false;
    } else {
        return true;
    }

}


/* 
    
    CHECK CompanyName 
    Verifica l'esistenze del TAG company name dell'utente e recupera le informazioni di configurazione

*/
function checkCompanyName(user){

    logConsole.info('checkCompanyName');
    logConsole.info(user);
    if(!user.userCompany){
        log2file.error('checkCompanyName:userCompany property not found');
        return false;
    } else {
        var fConfigName = ENV_PROT.configUserFolder + '/' + ENV_PROT.configFilePREFIX + '-' + user.userCompany + '.js';
        logConsole.info('checkCompanyName : load default data : ' + fConfigName);
 
        try {
            ENV_DEFAULT_USER = require(fConfigName);
        }
        catch (e) {
            log2file.error(e);
            return false;
        }
        logConsole.info(ENV_DEFAULT_USER);
        return true;
    }
}

/* 

    saveDataToFS  --------------------------------------------------------------------------------------------------------- 
    Salva su file system i dati di autenticazione chiamata e protocollo e allegati 
    
*/



function saveDataToFS(body , userObj, protocolloObj) {
    logConsole.info('saveDataToFS');
    logConsole.info(ENV_DEFAULT_USER.storageFolder);

    // var transactionId = req.body.fields.transactionId;
    var DW_PATH = ENV_DEFAULT_USER.storageFolder;
    var dir = DW_PATH + "/" + userObj.reqId;
    logConsole.info(dir);


    // salvataggio documento Principale

    // salvataggio eventuali allegati

    try{
        // throw "TEST - File NOT FOUND Exception";

        // crea la cartella
        if (!fs.existsSync(dir)){fs.mkdirSync(dir);}

        // salva i dati dell'autenticazione
        var jsonFile = dir + "/AUTH-" + userObj.reqId + ".txt";
        logConsole.info(jsonFile);
        fs.writeFileSync(jsonFile, JSON.stringify(userObj));
        logConsole.info(userObj);

        // salva i dati del protocollo
        var jsonFile = dir + "/PROTOCOLLO-" + userObj.reqId + ".txt";
        logConsole.info(jsonFile);
        fs.writeFileSync(jsonFile, JSON.stringify(protocolloObj));
        logConsole.info(protocolloObj);

        // salva i dati della chiamata
        var jsonFile = dir + "/REQ-" + userObj.reqId + ".txt";
        logConsole.info(jsonFile);
        fs.writeFileSync(jsonFile, JSON.stringify(body));
        
        /*esporta gli allegati */

        logConsole.info('Export allegati TODO .... :');
        /*
        Object.keys(fileList).forEach(function(name) {
            logConsole.info('SAVING FILE:save: ' + name);

            var originalFilename = fileList[name][0].originalFilename;
            var destFile = dir + "/" + fileList[name][0].originalFilename;
            var sourceFile = fileList[name][0].path;
            logConsole.info(sourceFile);
            logConsole.info(destFile);
            //fs.renameSync(sourceFile, destFile);
            // fs.createReadStream(sourceFile).pipe(fs.createWriteStream(destFile));
            //fs.copySync(path.resolve(__dirname,'./init/xxx.json'), 'xxx.json');
            fsExtra.copySync(sourceFile, destFile);
            var hash2 = md5File.sync(destFile);
            logConsole.info(destFile);
            logConsole.info(hash2);

            fieldsObj.files.push({ 'name' : originalFilename});
        });
        */


        return true;

    } catch (e){
        logConsole.info('savingFiles: ', e);
        logConsole.info('savingFiles:' + userObj.reqId);
        log2file.error('savingFiles:');
        log2file.error(userObj.reqId);
        log2file.error(e);
        return false;
    }
}

/* EMAIL SENDER -------------------------------------------------------------------------------------------------------- */

function emailSend(mailOptions){
        var transporter = nodemailer.createTransport(ENV_PROT.smtpConfig);
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
}


/* PROTOCOLLO  --------------------------------------------------------------------------------------------------------- */

function protocolloWS(objFilesList,  reqId) {

    logConsole.info('-- protocolloWS --');

    WS_IRIDE = ENV_PROT.wsJiride.url;
    WS_IRIDE_ENDPOINT = ENV_PROT.wsJiride.endpoint;

    logConsole.info(WS_IRIDE);
    logConsole.info(WS_IRIDE_ENDPOINT);

    // formattazione data per il WS
    // logConsole.info(body);

    // preparazione dati

    var args = { 
           ProtoIn : {
                Data: moment().format('DD/MM/YYYY'),
                Classifica: ENV_DEFAULT_USER.wsJiride.classifica,
                TipoDocumento: ENV_DEFAULT_USER.wsJiride.tipoDocumento,
                Oggetto: (objFilesList.richiedente.oggetto || 'OGGETTO NON PRESENTE') + '  -  (' + reqId + ')',
                Origine: ENV_DEFAULT_USER.wsJiride.origine,
                MittenteInterno: ENV_DEFAULT_USER.wsJiride.mittenteInterno,
                //MittenteInterno_Descrizione": "",
                AnnoPratica: ENV_DEFAULT_USER.wsJiride.annoPratica,
                NumeroPratica: ENV_DEFAULT_USER.wsJiride.numeroPratica,
                 
               MittentiDestinatari: {
                MittenteDestinatario: [
                  {
                    CodiceFiscale : objFilesList.richiedente.codiceFiscale,
                    CognomeNome: objFilesList.richiedente.cognome + ' ' + objFilesList.richiedente.nome,
                    DataNascita : objFilesList.richiedente.dataDiNascita,
                    Indirizzo : objFilesList.richiedente.indirizzo,
                    Localita : objFilesList.richiedente.citta,
                    // Spese_NProt : 0,
                    // TipoSogg: 'S',
                    TipoPersona: ENV_DEFAULT_USER.wsJiride.tipoPersona,
                    Recapiti: {
                        Recapito: [
                            {
                                TipoRecapito: 'EMAIL',
                                ValoreRecapito: objFilesList.richiedente.mail
                            }
                        ]
                    }
                  }
                ]
              },
              
              AggiornaAnagrafiche : ENV_DEFAULT_USER.wsJiride.aggiornaAnagrafiche,
              InCaricoA : ENV_DEFAULT_USER.wsJiride.inCaricoA,
              Utente : ENV_DEFAULT_USER.wsJiride.utente,
              Ruolo : ENV_DEFAULT_USER.wsJiride.ruolo,              
              Allegati: {  Allegato: []  }
            }
        };

    logConsole.info(args);

    // costruzione degli allegati con i metadati

    // Aggiunta allegato principale

    var fname = objFilesList.domandaPermessoFormatoPDF.nomeFile;
    var ext = fname.substring(fname.length - 3);
    logConsole.info(fname);
    logConsole.info(ext);
    var mtype =  mime.lookup(ext);
    logConsole.info(mtype);

    args.ProtoIn.Allegati.Allegato.push(
            {
                TipoFile : ext,
                ContentType : mtype,
                Image: objFilesList.domandaPermessoFormatoPDF.base64,
                NomeAllegato: objFilesList.domandaPermessoFormatoPDF.nomeFile,
                Commento : objFilesList.domandaPermessoFormatoPDF.tipoDescrizione
            }
        );

    // Aggiunta allegati successivi al primo

    var DW_PATH = ENV_DEFAULT_USER.storageFolder;
    var dir = DW_PATH + "/" + reqId;
    
    objFilesList.allegati.forEach(function(obj){
        //logConsole.info('adding:', dir + '/' + obj.name);
        //ext = obj.name.substring(obj.name.length - 3);
        logConsole.info(obj);
        fname = obj.nomeFile;
        logConsole.info(fname);
        ext = fname.substring(fname.length - 3);
        logConsole.info(ext);
        mtype =  mime.lookup(ext);
        logConsole.info(mtype);

        // allegato principale
        args.ProtoIn.Allegati.Allegato.push(
            {
                TipoFile : ext,
                ContentType : mtype,
                Image: obj.base64,
                NomeAllegato: obj.nomeFile,
                Commento : obj.tipoDescrizione
            }
        );
    });

    // AGGIUNGE I metadati
    /*
    var fMetadati = reqId + '.txt';
    logConsole.info('aggiunta metadati', fMetadati);
    args.ProtoIn.Allegati.Allegato.push(
        {
            TipoFile : 'txt',
            ContentType : mime.lookup(dir + '/' + fMetadati),
            Image: utilityModule.base64_encode(dir + '/' + fMetadati),
            NomeAllegato: fMetadati,
            Commento : ''
        }
    );
    */


    var soapResult = { result : '....'};
 
    var soapOptions = {
        endpoint: WS_IRIDE_ENDPOINT
    };

    logConsole.info('create client');

    return new Promise(function (resolve, reject) {

        soap.createClient(WS_IRIDE, soapOptions, function(err, client){
            
            if (err) {
                var msg = 'Errore nella creazione del client soap';
                log2file.error(msg); log2file.error(err); logConsole.error(err);
                reject(err);
            } else {

                client.InserisciProtocolloEAnagrafiche(args,  function(err, result) {
                //client.InserisciProtocollo(args,  function(err, result) {
                
                    if (err) {
                        var msg = 'Errore nella chiamata ad InserisciProtocollo';
                        log2file.error(msg);  log2file.error(err);  logConsole.error(msg);
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


//router.post('/upload', multipartMiddleware, function(req, res) {
router.post('/protocollo', 
    utilityModule.ensureAuthenticated,
    function(req, res) {

    var bRaisedError = false;
    var ErrorMsg = {};

    // richiesta di identificatore unico di transazione
    var reqId = utilityModule.getTimestampPlusRandom();

    ErrorMsg.reqId = reqId;
    req.user.reqId = reqId;
    var supportMsg = 'Riprovare più tardi o inviare una mail di segnalazione a ruggero.ruggeri@comune.rimini.it o telefonare allo 0541/704607 o 0541/704612 utilizzando il seguente codice unico di transazione: ' + reqId + '. Grazie.';

    var objFilesList = {};
    var objFieldList = {};
    var objFieldSanitized = {};
    var objDatiProtocollo = {};
    var htmlResponseMsg = '';

    logConsole.info('start upload: ' + reqId);


    //                 var p = {"nomeRichiedente":"MARIO","cognomeRichiedente":"ROSSI","emailRichiedente":"ruggero.ruggeri@comune.rimini.it","codiceFiscaleRichiedente":"RGGRGR70E25H294T","cellulareRichiedente":"3355703086","dataNascitaRichiedente":"11/12/1912","indirizzoRichiedente":"VIA ROMA, 1","cittaRichiedente":"RIMINI","capRichiedente":"47921","oggettoRichiedente":"Invio richiesta generica Sig. MARIO ROSSI, cortesemente ....","files":[],"reqId":"20161209@112659@342@52188","idProtocollo":139364,"annoProtocollo":"2016","numeroProtocollo":100144};
    //

    
    // limite upload
    // https://github.com/expressjs/node-multiparty

    async.series([


            // ##### output dati ricevuti --- DEBUG ----
             function(callback) {
                logConsole.info('ASYNC output dati');
                console.log(req.body);
                callback(null, 'Output dati ricevuti ... ok');  
             },


            // ##### verifica token e caricamento parametri

             function(callback) {
                logConsole.info('ASYNC check token e caricamento parametri');

                if(checkCompanyName(req.user)){
                    callback(null, 'OK Output dati ricevuti ... ok');  
                } else {
                     ErrorMsg = {
                                title: 'checkCompanyName : ERROR ',
                                msg: 'Errore nel controllo e caricamento dati default',
                                reqId: reqId,
                                code : 455
                    };
                    callback(ErrorMsg, null);
                }
                
             },

           
            // ##### VALIDATION / PARSING ------------------------------------------------
            
            function(callback) {
                logConsole.info('ASYNC data parsing / validation');
                if(checkJsonSchema(req)){
                    logConsole.info('ASYNC data parsing OK');
                    callback(null, 'ASYNC data parsing OK');  
                } else {                
                    logConsole.error('ASYNC data parsing error');
                    ErrorMsg = {
                            title: 'Errore data parse',
                            msg: 'Errore nella decodifica dei dati ricevuti. ',
                            reqId: reqId,
                            code : 455
                    };
                    callback(ErrorMsg, null);
                }
            },

            
            // ##### ------------------------------------------------------------------------

            function(callback){   logConsole.info('ASYNC NOOP:');   callback(null, 'NOOP ... ok');    },


            // ##### Protocollazione ------------------------------------------------------------------------

            function(callback){

                logConsole.info('ASYNC protocolloWS:');
                if(fakeConfig.protocollazione == 1) {
                    protocolloWS(req.body, reqId)
                    .then( function (result) {
                        logConsole.info(result);
                        console.log(result);
                        console.log(result.InserisciProtocolloEAnagraficheResult.Allegati);
                        objDatiProtocollo = result;
                        callback(null, 'protocolloWS ... ok');
                    })
                    .catch(function (err) {
                        // console.log(err);
                        logConsole.error('ASYNC protocolloWS:');
                        log2file.error(reqId);
                        log2file.error(err);
                        ErrorMsg = {
                            title: 'Errore di protocollo',
                            msg: 'Errore nella protocollazione della richiesta.' + supportMsg,
                            code : 458
                        };
                        callback(ErrorMsg, null);
                    });
                }


            },

            // ##### Saving files ------------------------------------------------------------------------

            function(callback){
                logConsole.info('ASYNC savingFiles:');

                if (saveDataToFS(req.body, req.user, objDatiProtocollo )){

                    logConsole.info('savingFiles: ok');
                    logConsole.info(objFieldSanitized);
                    callback(null, 'savingFiles ... ok');

                } else {
                    
                    ErrorMsg = {
                        title: 'saving file error',
                        msg: 'Errore nella memorizzazione remota dei files.' + supportMsg,
                        code : 457
                    }

                    log2file.error(reqId);
                    log2file.error(ErrorMsg);
                    logConsole.error(ErrorMsg);
                    callback(ErrorMsg, null);
                }
            },

            function(callback){
                logConsole.info('ASYNC HASH file check:');
                callback(null, 'Hash file check ... ok');
            },


            // ###### SAVING ISTANZA TO DB ----------------------------------------------------------------------
            /*
            function(callback){
                logConsole.info('ASYNC salvataggio istanza to DB:');

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
                        logConsole.info('ASYNC dati istanza salvati OK!');
                        callback(null, 'Dati istanza salvati su database');
                    }
                ).catch(function (err) {
                    log2file.error(reqId);
                    log2file.error(err);
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
                logConsole.info('ASYNC preparazione messaggio risposta:');
 
                var fileContents = '';
                var templateFileName = ENV_DEFAULT_USER.templateFileName;

                try {
                    fileContents = fs.readFileSync(templateFileName).toString();
                } catch (err) {
                    log2file.error(reqId);
                    log2file.error(err);
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
                objFieldSanitized.dataProtocollo = objDatiProtocollo.InserisciProtocolloEAnagraficheResult.DataProtocollo.toString();
            
                var template = handlebars.compile(fileContents);
                htmlResponseMsg = template(objFieldSanitized);
                callback(null, 'Messaggio di risposta preparato ok');

            }

            //   function(callback){  },

              

    ],function(err, results) {
        // results is now equal to: {one: 1, two: 2}
        logConsole.info('ASYNC FINAL!:');
        if(err){
            log2file.error(err);
            logConsole.error(err);
            // log2Email.info(err);
            res.status(ErrorMsg.code).send(ErrorMsg);
        } else {
            logConsole.info('ALL OK!!!!');
            // results.msg = htmlResponseMsg;
            logConsole.info(htmlResponseMsg);
            var Msg = {
                            title: 'Istanza ricevuta con successo!',
                            msg: htmlResponseMsg,
                            reqId: reqId,
                            code : 200
                        }
            // log2Email.info(Msg);                        
            res.status(200).send(Msg);
        }
    });


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







  return router;
}
