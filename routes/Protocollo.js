// Route for Protocollo

// Note sicurezza:
// - controllo CaptCha
// - limite UPLOAD
// - limite ORARIO uffici con NOTIFICA
// - controllo parametri SANITIZE 
// - controllo hash file
// - generazione PDF
// - invio mail di risposta

  // protocollazione
  

  // risposta

  // invio mail di conferma con pdf

  // res.status(200).send('Operazioni terminate ....'); 


var express = require('express');
var router = express.Router();
// var request = require('request');
var os = require('os');
var fs = require('fs');
var path = require('path');
var util = require('util');
var soap = require('soap');

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var multiparty = require('multiparty');

var jwt = require('jwt-simple');
var ENV   = require('../config.js'); // load configuration data
var ENV_PROT   = require('../tmp/configPROTOCOLLO.js'); // load user configuration data
// var mongocli = require('../models/mongocli');
var spark = require('spark-md5');
var md5File = require('md5-file');
var _ = require('lodash');
var Report = require('fluentreports').Report;
var nodemailer = require('nodemailer');
var request = require('request');
var moment = require('moment');
var mime = require('mime');
var async = require('async');
var handlebars = require('handlebars');
var validator = require('validator');
// var Segnalazione  = require('../models/segnalazione.js'); // load configuration data
// var flow = require('../models/flow-node.js')('tmp'); // load configuration data
var utilityModule  = require('../models/utilityModule.js'); 

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
    }
  ]
});

var logger = log4js.getLogger();
// init logging
var logConsole  = log4js.getLogger();
// var loggerDB = log4js.getLogger('mongodb');

var log2file = log4js.getLogger('error-file-logger-protocollo');
log2file.setLevel(ENV_PROT.log_level);

var log2fileAccess = log4js.getLogger('access-file-logger-protocollo');


module.exports = function(){

var WS_IRIDE =  "";
var MODO_OPERATIVO = "TEST";

/* Chiamata di TEST /ping */

router.get('/ping', function (req, res) {
    var p = {};

    logConsole.info('ASYNC preparazione messaggio risposta:');
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

    res.send(xmlBuilded);




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



/* Funzione di verifica per Captch di Google */
    function verifyReCaptcha(ReCaptcha) {
        console.log('verifyReCaptcha');
        return new Promise(function (resolve, reject) {
       
            var data = {
                secret: ENV_PROT.recaptcha_secret, 
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



router.get('/mail',  function (req, res) {



    // create reusable transporter object using the default SMTP transport
    var smtpConfig = {
        host: 'srv-mail.comune.rimini.it',
        port: 25,
        secure: false//, // use SSL
        //auth: {
        //    user: 'user@gmail.com',
        //    pass: 'pass'
        //}
    };

    var transporter = nodemailer.createTransport(smtpConfig);


    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: '"Comune di Rimini - Portale Istanze Digitali" <ruggero.ruggeri@comune.rimini.it>', // sender address
        to: 'ruggero.ruggeri@comune.rimini.it, paulo.difficiliora@gmail.com', // list of receivers
        subject: 'Ricevuta ricevimento istanza', // Subject line
        text: 'Hello world ?' // plaintext body
        // attachments: [ {  path: './storage/pdf/Report.pdf' }]
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });



    res.status(200).send('Mail ok');

});

router.get('/testCaptcha',  function (req, res) {
    req.body = {};
    req.body.fields = {};
    req.body.fields.RecaptchaResponse = 'fsdfsdfsdfsdf';
     console.log(ENV_PROT.recaptcha_secret);
      console.log(req.body.fields.RecaptchaResponse);

      var data = {
            secret: ENV_PROT.recaptcha_secret, 
            response: req.body.fields.RecaptchaResponse
      }

      var url = 'https://www.google.com/recaptcha/api/siteverify';

        var options = {
                // url : url,
                uri: url,
                method: 'POST',
                proxy: ENV_PROT.proxy_url,
                json: true,
                qs: data
            };


            request(options, function (error, response, body) {
                if (error) {
                    console.log('Errore invio richiesta ...');
                    console.log(error);
                     res.send(error);
                    //reject(error);
                }
                if (!error && response.statusCode == 201) {
                    console.log('OK...', response);
                    res.send(response);
                    //resolve(response);
                } else {
                    console.log('Errore invio richiesta ...', response);
                    res.send(response);
                    // reject(response);
                }
            });
       
});

router.get('/pdf',  function (req, res) {

    var rptFileName = "./storage/pdf/Report.pdf";

    var data = [
          {item: 'NOME', count: 5, unit: 'loaf'},
          {item: 'COGNOME', count: 3, unit: 'dozen'},
          {item: 'Sugar', count: 32, unit: 'gram'},
          {item: 'Carrot', count: 2, unit: 'kilo'},
          {item: 'Apple', count: 3, unit: 'kilo'},
          {item: 'Peanut Butter', count: 1, unit: 'jar'}
      ];

    var headerFunction = function(Report) {
        Report.print("Rapporto - Promemoria", {fontSize: 22, bold: true, underline:true, align: "center"});
        Report.newLine(2);
    };

    var footerFunction = function(Report) {
        Report.line(Report.currentX(), Report.maxY()-18, Report.maxX(), Report.maxY()-18);
        Report.pageNumber({text: "Page {0} of {1}", footer: true, align: "right"});
        Report.print("Stampato il: "+(new Date().toLocaleDateString()) + ' ' + new Date(), {y: Report.maxY()-14, align: "left"});
    };

    var rpt = new Report(rptFileName)
        .margins(20)                                 // Change the Margins to 20 pixels
        .data(data)                                  // Add our Data
        .pageHeader(headerFunction)                  // Add a header
        .pageFooter(footerFunction)                  // Add a footer
        .detail("{{count}} {{unit}} of {{item}}")    // Put how we want to print out the data line.
        .render(); 

    // rpt.printStructure(true);
    
    
    res.download(rptFileName); // Set disposition and send it.

    /*
    var file = fs.createReadStream(rptFileName);
    var stat = fs.statSync(rptFileName);
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=quote.pdf');
    file.pipe(res);
    */
});

router.get('/getTestToken', function (req, res) {
    var demoData = {
        companyName: "Comune_di_Rimini",
        app: "protocollo"
    };
    res.send(utilityModule.createJWT(demoData));
});



/* SAVING FILES  --------------------------------------------------------------------------------------------------------- */
function savingFiles(fileList, fieldsObj, reqId) {
    logConsole.info('savingFiles');
    logConsole.info(ENV_PROT.storageFolder);
    // var transactionId = req.body.fields.transactionId;
    var DW_PATH = ENV_PROT.storageFolder;
    var dir = DW_PATH + "/" + reqId;

    fieldsObj.files = [];

    try{
        // throw "TEST - File NOT FOUND Exception";

        if (!fs.existsSync(dir)){fs.mkdirSync(dir);}
        logConsole.info(dir);
        Object.keys(fileList).forEach(function(name) {
            logConsole.info('savingFiles:save: ' + name);

            var originalFilename = fileList[name][0].originalFilename;
            var destFile = dir + "/" + fileList[name][0].originalFilename;
            var sourceFile = fileList[name][0].path;
            logConsole.info(destFile);
            fs.renameSync(sourceFile, destFile);
            var hash2 = md5File.sync(destFile);
            logConsole.info(destFile);
            logConsole.info(hash2);

            fieldsObj.files.push({ 'name' : originalFilename});
        });

        // save metadata
        fieldsObj.reqId = reqId;
        var jsonFile = dir + "/" + reqId + ".txt";
        logConsole.info(jsonFile);
        fs.writeFileSync(jsonFile, JSON.stringify(fieldsObj));
        
        logConsole.info(fieldsObj);

        return true;

    } catch (e){
        logConsole.info('savingFiles: ', e);
        logConsole.info('savingFiles:' + reqId);
        log2file.error('savingFiles:');
        log2file.error(reqId);
        log2file.error(e);
        return false;
    }
}

/* SANITIZE --------------------------------------------------------------------------------------------------------- */

function sanitizeInput(fieldList, fieldsObj,  reqId) {
    logConsole.info('sanitizeInput');
    // var transactionId = req.body.fields.transactionId;
    var DW_PATH = ENV_PROT.storageFolder;
    // var dir = DW_PATH + "/" +  transactionId;
    var dir = DW_PATH + "/" + reqId;
    // var fieldsObj = {};

    Object.keys(fieldList).forEach(function(name) {
        logConsole.info('got field named ' + name);

        switch(name) {
            case 'fields[nomeRichiedente]':
                fieldsObj.nomeRichiedente = fieldList[name][0];
                break;
            case 'fields[cognomeRichiedente]':
                fieldsObj.cognomeRichiedente = fieldList[name][0];
                break;
            case 'fields[emailRichiedente]':
                fieldsObj.emailRichiedente = fieldList[name][0];
                break;
            case 'fields[codiceFiscaleRichiedente]':
                fieldsObj.codiceFiscaleRichiedente = fieldList[name][0];
                break;
            case 'fields[cellulareRichiedente]':
                fieldsObj.cellulareRichiedente = fieldList[name][0];
                break;
            case 'fields[dataNascitaRichiedente]':
                fieldsObj.dataNascitaRichiedente = fieldList[name][0];
                break;                
            case 'fields[indirizzoRichiedente]':
                fieldsObj.indirizzoRichiedente = fieldList[name][0];
                break;
            case 'fields[cittaRichiedente]':
                fieldsObj.cittaRichiedente = fieldList[name][0];
                break;
            case 'fields[capRichiedente]':
                fieldsObj.capRichiedente = fieldList[name][0];
                break;
            case 'fields[oggettoRichiedente]':
                fieldsObj.oggettoRichiedente = fieldList[name][0];
                break;
            default:
                break;
        }

    });

    // validate object
    // https://www.npmjs.com/package/validator

    logConsole.info(fieldsObj);
    logConsole.info('validate obj');
    var bValid = true;
    var msgValidator = '';
    
 
    // test lunghezze

    if( fieldsObj.codiceFiscaleRichiedente.length != 16 ){
        console.log(fieldsObj.codiceFiscaleRichiedente.length);
        bValid = false;
        msgValidator = 'Codice fiscale non valido';
    }


    if( fieldsObj.oggettoRichiedente.length > 300 ){
        bValid = false;
        msgValidator = 'Oggetto troppo lungo';
    }


    // test 

    if( !validator.isEmail(fieldsObj.emailRichiedente) ){
        bValid = false;
        msgValidator = 'Email non valida';
    }

    if( !validator.isDecimal(fieldsObj.cellulareRichiedente) ){
        bValid = false;
        msgValidator = 'Cellulare non valido';
    }

    if( !validator.isDecimal(fieldsObj.capRichiedente) ){
        bValid = false;
        msgValidator = 'Cap non valido';
    }

    console.log(fieldsObj.dataNascitaRichiedente);
    if( !validator.isDate(fieldsObj.dataNascitaRichiedente) ){
        bValid = false;
        msgValidator = 'Data di Nascita non valida';
    } 


    // sanitize oggettoRichiedente
    fieldsObj.oggettoRichiedente = validator.escape(fieldsObj.oggettoRichiedente);
    logConsole.info(fieldsObj.oggettoRichiedente);


    if ( bValid ) {
        return true;
    } else {
        log2file.error(msgValidator);
        logConsole.error(msgValidator);
        return false;
    }
     
}

/* PROTOCOLLO  --------------------------------------------------------------------------------------------------------- */

function protocolloWS(objFilesList,  reqId) {

    logConsole.info('protocolloWS');

    WS_IRIDE = ENV_PROT.wsJiride.url;
    WS_IRIDE_ENDPOINT = ENV_PROT.wsJiride.endpoint;

    logConsole.info(WS_IRIDE);
    logConsole.info(WS_IRIDE_ENDPOINT);

    // formattazione data per il WS
    logConsole.info(objFilesList.dataNascitaRichiedente);


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
    logConsole.info(args);

    var DW_PATH = ENV_PROT.storageFolder;
    var dir = DW_PATH + "/" + reqId;
    
    objFilesList.files.forEach(function(obj){
        logConsole.info('adding:', dir + '/' + obj.name);
        ext = obj.name.substring(obj.name.length - 3);
        logConsole.info(ext);

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
    
    // var p7m1 = utilityModule.base64_encode('./test.pdf.p7m');
    // var pdf1 = utilityModule.base64_encode('./test.pdf');

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
router.post('/upload', function(req, res) {

    var bRaisedError = false;
    var ErrorMsg = {};

    // richiesta di identificatore unico di transazione
    var reqId = utilityModule.getTimestampPlusRandom();

    ErrorMsg.reqId = reqId;
    var supportMsg = 'Riprovare più tardi o inviare una mail di segnalazione a ruggero.ruggeri@comune.rimini.it o telefonare allo 0541/704607 o 0541/704612 utilizzando il seguente identificativo di richiesta: ' + reqId + '. Grazie.';

    var objFilesList = {};
    var objFieldList = {};
    var objFieldSanitized = {};
    var objDatiProtocollo = {};
    var htmlResponseMsg = '';

    logConsole.info('start upload: ' + reqId);


    //                 var p = {"nomeRichiedente":"MARIO","cognomeRichiedente":"ROSSI","emailRichiedente":"ruggero.ruggeri@comune.rimini.it","codiceFiscaleRichiedente":"RGGRGR70E25H294T","cellulareRichiedente":"3355703086","dataNascitaRichiedente":"11/12/1912","indirizzoRichiedente":"VIA ROMA, 1","cittaRichiedente":"RIMINI","capRichiedente":"47921","oggettoRichiedente":"Invio richiesta generica Sig. MARIO ROSSI, cortesemente ....","files":[],"reqId":"20161209@112659@342@52188","idProtocollo":139364,"annoProtocollo":"2016","numeroProtocollo":100144};
    //

    var fakeConfig = {
        captCha : 0, // 1 abilitata 0 disabilitata/fake 2 errore
        parsingValues: 1, // 1 sempre decodifica  i parametri dei form
        savingToDisk: 1,
        protocollazione: 0,
        emailsend: 1
    }


    // limite upload
    // https://github.com/expressjs/node-multiparty

    async.series([

            // #####  CAPTCHA ------------------------------------------------
            function(callback){
                logConsole.info('ASYNC Gmail Recaptcha ...:');
                ErrorMsg = {
                                            title: 'Errore controllo ReCaptcha',
                                            msg: 'Si è verificato un errore nel controllo del codice antifrode ReCaptcha. ' + supportMsg,
                                            reqId: reqId,
                                            code : 480
                            };
    

                if(fakeConfig.captCha == 1) {

                  verifyReCaptcha(req.body.fields.RecaptchaResponse).then(function (result) {
                        if (result.statusCode == 200) {
                            logConsole.info('Gmail Recaptcha OK!');
                            // console.log(result.response);
                            callback(null, 'Gmail Recaptcha OK!');
                        } else {
                            //console.log(result);
                           logConsole.error('Gmail Recaptcha ERROR! code:' + result.statusCode);
                           callback(ErrorMsg, null);
                        }
                    }).catch(function (err) {
                        // console.log(err);
                        logConsole.error('Gmail Recaptcha ERRORE GENERICO!');
                        logConsole.error(err);
                        log2file.error('Gmail Recaptcha ERRORE GENERICO!');
                        log2file.error(err);
                        callback(ErrorMsg, null);
                    });

                } 
            
                if(fakeConfig.captCha == 0) {
                    logConsole.info('ASYNC Gmail Recaptcha DISABLED!!! - OK:');
                    callback(null, 'Gmail Recaptcha ... DISABLED ok');
                }

                if(fakeConfig.captCha == 2) {
                    logConsole.info('ASYNC Gmail Recaptcha TEST ERROR !!! - OK:');
                    callback(ErrorMsg, null);
                }

            },

            // ##### PARSING ------------------------------------------------
            
            function(callback) {
                logConsole.info('ASYNC form parsing');
    
                if(fakeConfig.parsingValues == 1) {

                    var options = {  maxFilesSize: ENV_PROT.upload_size  };
                    var form = new multiparty.Form(options);
                    form.parse(req, 
                        function(err, fields, files) {
                            if(err){
                                logConsole.error(err);
                                log2file.error(err);                                        
                                ErrorMsg = {
                                            title: 'Parsing values input error',
                                            msg: 'Errore nella decodifica dei dati ricevuti. ' + supportMsg,
                                            reqId: reqId,
                                            code : 455
                                };
                                callback(ErrorMsg, null);
                            } else {
                                objFieldList = fields;
                                objFilesList = files;
                                logConsole.info(objFieldList);
                                logConsole.info(objFilesList);
                                callback(null, 'Form ... ok');
                            }
                    });
                }
            },

            // ##### Input sanitizer ------------------------------------------------------------------------

            function(callback){
                logConsole.info('ASYNC sanitizeInput:');

                if (sanitizeInput(objFieldList, objFieldSanitized, reqId)){
                    logConsole.info('sanitizeInput: ok');
                    logConsole.info(objFieldSanitized);
                    callback(null, 'sanitizeInput ... ok');
                } else {
                    ErrorMsg = {
                        title: 'Check input error',
                        msg: 'Errore nei dati di input. ' + supportMsg,
                        code : 456
                    }
                    log2file.error(reqId);
                    log2file.error(ErrorMsg);
                    logConsole.error(ErrorMsg);
                    callback(ErrorMsg, null);
                }
            },

            // ##### Saving files ------------------------------------------------------------------------

            function(callback){
                logConsole.info('ASYNC savingFiles:');

                if (savingFiles(objFilesList, objFieldSanitized, reqId )){
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

            // ##### Protocollazione ------------------------------------------------------------------------

            function(callback){

                logConsole.info('ASYNC protocolloWS:');
                if(fakeConfig.protocollazione == 1) {
                    protocolloWS(objFieldSanitized, reqId)
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

                if(fakeConfig.protocollazione == 0) {
                    logConsole.info('ASYNC protocolloWS: DISABLED!');
                    objDatiProtocollo = {};
                    objDatiProtocollo.InserisciProtocolloEAnagraficheResult = {};
                    objDatiProtocollo.InserisciProtocolloEAnagraficheResult.IdDocumento = 12345678;
                    objDatiProtocollo.InserisciProtocolloEAnagraficheResult.AnnoProtocollo = 2099;
                    objDatiProtocollo.InserisciProtocolloEAnagraficheResult.NumeroProtocollo = 2100;
                    objDatiProtocollo.InserisciProtocolloEAnagraficheResult.DataProtocollo = 'GG/MM/AAAA';
                    objDatiProtocollo.InserisciProtocolloEAnagraficheResult.Messaggio = 'Inserimento Protocollo eseguito con successo, senza Avvio Iter';
                    callback(null, 'protocolloWS ... FAKE!!!! ok');
                }


            },

            // ##### SAVING TO DISK ------------------------------------------------------------------------

            function(callback){

                if (fakeConfig.savingToDisk == 1){

                    logConsole.info('ASYNC salvataggio dati protocollo nella cartella:');
                    // save protocollo
                    var DW_PATH = ENV_PROT.storageFolder;
                    var dir = DW_PATH + "/" + reqId;
                    var jsonFile = dir + "/PROTOCOLLO.txt";
                    logConsole.info(jsonFile);
                    logConsole.info(objDatiProtocollo);
                    fs.writeFileSync(jsonFile, JSON.stringify(objDatiProtocollo));
                    callback(null, 'salvataggio dati protocollo nella cartella ... ok');
                }

                if (fakeConfig.savingToDisk == 0){
                    logConsole.info('ASYNC salvataggio dati FAKE FAKE protocollo nella cartella:');
                    callback(null, 'salvataggio dati protocollo nella cartella ... FAKE ok');
                }

                if (fakeConfig.savingToDisk == 2){
                    logConsole.info('ASYNC salvataggio dati FAKE FAKE protocollo nella cartella:');
                    ErrorMsg = {
                        title: 'saving file error',
                        msg: 'Errore nella memorizzazione remota dei files.' + supportMsg,
                        code : 457
                    };
                    callback(ErrorMsg, 'salvataggio dati protocollo nella cartella ... FAKE ERROR');
                }
                

            },

            // ###### BUILD Response Message ----------------------------------------------------------------

            function(callback){
                logConsole.info('ASYNC preparazione messaggio risposta:');
 
                var fileContents = '';
                var templateFileName = ENV_PROT.templateFileName;

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
                objFieldSanitized.dataProtocollo = objDatiProtocollo.InserisciProtocolloEAnagraficheResult.DataProtocollo;
            
                var template = handlebars.compile(fileContents);
                htmlResponseMsg = template(objFieldSanitized);
                callback(null, 'Messaggio di risposta preparato ok');

            },

            // ##### Mail Send ------------------------------------------------------------------------

            function(callback){

                if(fakeConfig.emailsend == 1){

                    logConsole.info('ASYNC invio mail:');

                    logConsole.info(objDatiProtocollo.InserisciProtocolloEAnagraficheResult.IdDocumento);
                    logConsole.info(objDatiProtocollo.InserisciProtocolloEAnagraficheResult.AnnoProtocollo);
                    logConsole.info(objDatiProtocollo.InserisciProtocolloEAnagraficheResult.NumeroProtocollo);

                // var msg = "Comune di Rimini - Protocollo " +  objDatiProtocollo.InserisciProtocolloEAnagraficheResult.AnnoProtocollo + "/" + objDatiProtocollo.InserisciProtocolloEAnagraficheResult.NumeroProtocollo;
                // create reusable transporter object using the default SMTP transport

                    var smtpConfig = {
                        host: 'srv-mail.comune.rimini.it',
                        port: 25,
                        secure: false  //, // use SSL
                        //auth: {
                        //    user: 'user@gmail.com',
                        //    pass: 'pass'
                        //}
                    };
                    var transporter = nodemailer.createTransport(smtpConfig);
                    var mailOptions = {
                        from: '"Comune di Rimini - Istanze Digitali" <ruggero.ruggeri@comune.rimini.it>', // sender address
                        to: objFieldSanitized.emailRichiedente, // list of receivers
                        subject: 'Promemoria presentazione istanza digitale', 
                        // text: msg, // plaintext body
                        html: htmlResponseMsg // html body
                    };
                    transporter.sendMail(mailOptions, function(error, info){
                        if(error){
                            log2file.error(reqId);
                            log2file.error(err);
                            ErrorMsg = {
                            title: 'Errore di protocollo',
                                msg: 'Errore durante invio mail. ' + supportMsg,
                                code : 459
                            }
                            callback(ErrorMsg, null);
                        } else {
                            logConsole.info('Email sent!');
                            callback(null, 'Invio mail ... ok');
                        }
                    });
                }

                 if(fakeConfig.emailsend == 0){
                      logConsole.info('ASYNC invio mail: DISABILITATO!');
                      callback(null, 'Invio mail .FAKE FAKE .. ok');
                 }

            },

              

    ],function(err, results) {
        // results is now equal to: {one: 1, two: 2}
        logConsole.info('ASYNC FINAL!:');
        if(err){
            log2file.error(err);
            logConsole.error(err);
            res.status(ErrorMsg.code).send(ErrorMsg);
        } else {
            logConsole.info('ALL OK!!!!');
            // results.msg = htmlResponseMsg;
            logConsole.info(htmlResponseMsg);
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



/*
    var form = new multiparty.Form(options);

    // parsind data
    form.parse(req, function(err, fields, files) {
        
    
        logConsole.info('parsing ... data:', reqId);

        if(err){
            bRaisedError = true;
            logConsole.error('PARSE ERROR');
            logConsole.error(err);
            log2file.error('PARSE ERROR');
            log2file.error(err);
            res.status(500).json({  msg : 'parse error',  message : err  });
        } else {


 
            if(!bRaisedError){
                if (sanitizeInput(fields, objFilesList, reqId)){
                    logConsole.info('ok');
                } else {
                       bRaisedError = true;
                    ErrorMsg = {
                        title: 'Check input error',
                        msg: 'Errore nei dati di input. Riprovare con altri dati o inviare una mail di segnalazione a ruggero.ruggeri@comune.rimini.it utilizzando il seguente identificativo di richiesta:<br><b>' + reqId + '</b><br>Grazie.',
                        code : 451
                    }
                    log2file.error(reqId);
                    log2file.error(ErrorMsg);
                    logConsole.error(ErrorMsg);
                }
            }  

            // salvataggio file allegati e metadati
            if(!bRaisedError){
                if (savingFiles(files, objFilesList, reqId )){
                    logConsole.info('ok');
                } else {
                    bRaisedError = true;
                    ErrorMsg = {
                        title: 'saving file error',
                        msg: 'Errore nella memorizzazione remota dei files. Riprovare più tardi o inviare una mail di segnalazione a ruggero.ruggeri@comune.rimini.it utilizzando il seguente identificativo di richiesta:<br><b>' + reqId + '</b><br>Grazie.',
                        code : 450
                    }
                    log2file.error(reqId);
                    log2file.error(ErrorMsg);
                    logConsole.error(ErrorMsg);
                }
            }

            // salvataggio file allegati e metadati
            if(!bRaisedError){
                protocolloWS(files, objFilesList, reqId )
                .then( function (result) {
                    logConsole.info(result);
                    // save to file
                })
                .catch(function (err) {
                    // console.log(err);
                    log2file.error(reqId);
                    log2file.error(err);
                    
                    console.log('verifyReCaptcha:ERROR2:', err.body);
                    res.status(500).send(err);
                });
            }

            //google recapcha

            // hashFilesCheck(files)

            // protocollo()

            // reportEmail() 

        
            if (bRaisedError){
                res.status(ErrorMsg.code).send(ErrorMsg);
            } else {                    
                ErrorMsg = {
                        title: 'saving file error',
                        msg: 'Ecco i dati della sua richiesta<br>Identificativo:<b>' + reqId + '</b><br>Protocollo:<b>2016/1505455</b><br>Le è stata inviata una mail a titolo di promemoria all\' indirizzo mail@adsajsd.com.<br> In caso di ....<br>Grazie.',                        
                        code : 200
                    }

                res.status(ErrorMsg.code).send(ErrorMsg);
            }
        }

    });
*/

  // console.log(req.body.fields.hash);
  
  

  // verifyReCaptcha



  // SANITIZE

  /*
  if (!fs.existsSync(dir)){fs.mkdirSync(dir);}

  if(req.files) console.log('1');
  if(req.files.files) console.log('2');
  console.log(req.files.files.length);
  if(req.files.files.length) console.log(req.files.files.length);

  if (req.files && req.files.files && req.files.files.length) {

    console.log('Saving files ...');
    
    for (var i = 0; i < req.files.files.length; i++) {
      
      console.log(req.files.files[i].path);
      console.log(req.files.files[i].originalFilename);
      console.log(req.files.files[i].size);

      var destFile = dir + "/" + req.files.files[i].originalFilename;

      fs.renameSync(req.files.files[i].path, destFile);


      var hash2 = md5File.sync(destFile);
      console.log(destFile, hash2);




    }
  } else {
      console.log('No files. ...');
  }
  */

  // controllo recapcha
  /*
  if (req.body.fields.RecaptchaResponse) {
      console.log('Recaptcha trovato ... verifica.');

      verifyReCaptcha(req.body.fields.RecaptchaResponse).then(function (result) {
                if (result.statusCode == 200) {
                    console.log('verifyReCaptcha:sendXML statusCode:', result.statusCode);
                    // console.log(result.response);
                    res.status(200).send(result);
                } else {
                    //console.log(result);
                    console.log('verifyReCaptcha:ERROR1:', result.statusCode);
                    res.status(401).send('ERRORE GRAVE verifyReCaptcha - VEDERE LOG.');
                }
            }).catch(function (err) {
                    // console.log(err);
                    console.log('verifyReCaptcha:ERROR2:', err.body);
                    res.status(500).send(err);
            });


  } else {
      msg = {
          'title' : 'errore',
          'obj' : 'Recaptcha non trovato!'
      };
      res.status(500).json({'msg' : msg});
  }
  */


/*
//Lets configure and request
request({
    url: 'https://modulus.io/contact/demo', //URL to hit
    qs: {from: 'blog example', time: +new Date()}, //Query string data
    method: 'POST',
    headers: {
        'Content-Type': 'MyContentType',
        'Custom-Header': 'Custom Value'
    },
    body: 'Hello Hello! String body!' //Set the body as a string
}, function(error, response, body){
    if(error) {
        console.log(error);
    } else {
        console.log(response.statusCode, body);
    }
});
*/


  // controllo hash file


  // protocollazione
  

  // risposta

  // invio mail di conferma con pdf

  

});


router.post('/inserisciProtocollo',  utilityModule.ensureAuthenticated, function(req, res){

    log2fileAccess.info('# user ---------------');
    log2fileAccess.info(req.user);
    log2fileAccess.info('# body ---------------');
    log2fileAccess.info(req.body);

    // WS_IRIDE = ENV_BRAV.wsiride.url_test;
    WS_IRIDE = ENV_PROT.wsJiride.url_test;
    log2fileAccess.info(WS_IRIDE);

    /*
    if(req.body.produzione) {
        console.log('[##PRODUZIONE##]');
        WS_IRIDE = ENV_BRAV.wsiride.url_produzione;
        MODO_OPERATIVO = "PRODUZIONE";
    } 
    */

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



router.get('/i',function(req, res) {

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


// route per la protocollazione
router.post('/protocollo', multipartMiddleware, /* utilityModule.ensureAuthenticated, */  function(req, res) {
      console.log('/protocollo .... ');
      
      console.log(req.body);
      console.log(req.query);
      console.log(req.user);

      // var pagesize = parseInt(req.query.pageSize); 
      // var n =  parseInt(req.query.currentPage);
      // var collection = mongocli.get().collection('helpdesk');
      // var rand = Math.floor(Math.random()*100000000).toString();
      // db.users.find().skip(pagesize*(n-1)).limit(pagesize)
      // var searchCriteria = { "userData.userProvider": req.user.userProvider, $and: [ { "userData.userId": req.user.userId } ] };

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
