/* protocollo module*/
/* contiene tutte le funzioni di utilitù per il route protocollo.js*/
var ENV = require('../config/configPROTOCOLLO.js'); // load configuration data
var log = require('../models/loggerModuleWinston.js');
var validator = require('validator');
var fs = require('fs');
var fsExtra = require('fs-extra');
var spark = require('spark-md5');
var md5File = require('md5-file');
var moment = require('moment');


log.info('START protocolloModule.js');



/*
    Esegue un controllo sulla esistenza e sul valore dei parametri passati
*/

exports.sanitizeInput = function (fieldList, fieldsObj,  reqId) {
    
    log.info('protocolloModule:sanitizeInput');

    fieldsObj.reqId = reqId;

    Object.keys(fieldList).forEach(function(name) {
        log.info('protocolloModule:sanitizeInput:got field named ' + name);

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
            case 'fields[recapitoTelefonicoRichiedente]':
                fieldsObj.recapitoTelefonicoRichiedente = fieldList[name][0];
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

    log.info(fieldsObj);
    log.info('protocolloModule:validate data ...');
    var bValid = true;
    var msgValidator = '';

    /* controllo esistenza */

    if( !fieldsObj.nomeRichiedente){    bValid = false;  msgValidator = 'nomeRichiedente richiesto'; }
    if( !fieldsObj.cognomeRichiedente){ bValid = false;  msgValidator = 'cognomeRichiedente richiesto'; }
    if( !fieldsObj.codiceFiscaleRichiedente){ bValid = false;  msgValidator = 'codiceFiscaleRichiedente richiesto'; }
    if( !fieldsObj.emailRichiedente){ bValid = false;  msgValidator = 'emailRichiedente richiesto'; }
    if( !fieldsObj.recapitoTelefonicoRichiedente){ bValid = false;  msgValidator = 'recapitoTelefonicoRichiedente richiesto'; }
    if( !fieldsObj.indirizzoRichiedente){ bValid = false;  msgValidator = 'indirizzoRichiedente richiesto'; }
    if( !fieldsObj.capRichiedente) { bValid = false;  msgValidator = 'capRichiedente richiesto'; }
    if( !fieldsObj.dataNascitaRichiedente) { bValid = false;  msgValidator = 'dataNascitaRichiedente richiesto'; }

    /* validazione */

    if( fieldsObj.codiceFiscaleRichiedente && (fieldsObj.codiceFiscaleRichiedente.length != 16) ){
        log.info(fieldsObj.codiceFiscaleRichiedente.length);
        bValid = false;
        msgValidator = 'Codice fiscale non valido';
    }

    /*

    if( fieldsObj.oggettoRichiedente && (fieldsObj.oggettoRichiedente.length > 300) ){
        bValid = false;
        msgValidator = 'Oggetto troppo lungo';
    }

    */

    
    if( fieldsObj.emailRichiedente && (!validator.isEmail(fieldsObj.emailRichiedente)) ){
        bValid = false;
        msgValidator = 'Email non valida';
    }
   

    if( fieldsObj.recapitoTelefonicoRichiedente && (!validator.isDecimal(fieldsObj.recapitoTelefonicoRichiedente)) ){
        bValid = false;
        msgValidator = 'recapitoTelefonicoRichiedente non valido';
    }

    /*
    if( fieldsObj.indirizzoRichiedente && (fieldsObj.indirizzoRichiedente.length > 1) ){
        bValid = false;
        msgValidator = 'indirizzoRichiedente non valido';
    }
    */


    if( fieldsObj.capRichiedente && (!validator.isDecimal(fieldsObj.capRichiedente)) ){
        bValid = false;
        msgValidator = 'Cap non valido';
    }

    log.info(fieldsObj.dataNascitaRichiedente);
    if( fieldsObj.dataNascitaRichiedente && (!moment( fieldsObj.dataNascitaRichiedente, 'DD/MM/YYYY', true).isValid()) ){
        bValid = false;
        msgValidator = 'Data di Nascita non valida';
    } 

/*
    // sanitize oggettoRichiedente
    if(fieldsObj.oggettoRichiedente){
        fieldsObj.oggettoRichiedente = validator.escape(fieldsObj.oggettoRichiedente);
        log.info(fieldsObj.oggettoRichiedente);
    } else{
        bValid = false;
        msgValidator = 'Oggetto non valido';
    }
*/
    

    if ( bValid ) {
        return true;
    } else {
        log.error(msgValidator);
        return false;
    }
     
}

/* SAVING FILES  

    salva i file dell'upload nella cartella temporanea

--------------------------------------------------------------------------------------------------------- */

exports.savingFiles = function (fileList, fieldsObj, userObj) {
    log.info('protocolloModule:savingFiles');
    log.info('protocolloModule:storageFolder:' +ENV.storageFolder);
    // var transactionId = req.body.fields.transactionId;
    var dir = ENV.storageFolder + "/" + userObj.reqId;;

    log.info('protocolloModule:storageFolder:' + dir);
    fieldsObj.files = [];

    try{
        // throw "TEST - File NOT FOUND Exception";
        if (!fs.existsSync(dir)){
            try
            { 
                fs.mkdirSync(dir);
                log.info('protocolloModule:Folder OK' + dir);
            }
            catch(e) {
                log.error('protocolloModule:storageFolder: create folder ERROR');
                log.error(e);
            }
        }
        log.info('protocolloModule:' + dir);
        log.info('protocolloModule:lenght:' + fileList.length);

        Object.keys(fileList).forEach(function(name) {
            log.info('protocolloModule:save: ' + name);

            var originalFilename = fileList[name][0].originalFilename;
            var destFile = dir + "/" + fileList[name][0].originalFilename;
            var sourceFile = fileList[name][0].path;
            log.info(sourceFile);
            log.info(destFile);
            //fs.renameSync(sourceFile, destFile);
            // fs.createReadStream(sourceFile).pipe(fs.createWriteStream(destFile));
            //fs.copySync(path.resolve(__dirname,'./init/xxx.json'), 'xxx.json');
            fsExtra.copySync(sourceFile, destFile);
            var hash2 = md5File.sync(destFile);
            log.info('protocolloModule:dest:' + destFile);
            log.info('protocolloModule:hash2:'+ hash2);

            fieldsObj.files.push({ 'name' : originalFilename});
        });

        // save metadata metadati
        fieldsObj.userObj = userObj;
        var jsonFile = dir + "/" + userObj.reqId + ".txt";
        log.info(jsonFile);
        fs.writeFileSync(jsonFile, JSON.stringify(fieldsObj));
        log.info(fieldsObj);

        return true;

    } catch (e){
        log.error('savingFiles: ERROR');
        log.error(e);
        log.error(userObj);
        return false;
    }
}


exports.info = function(data) {

    // console.log(typeof(data));
    // console.log(typeof(arguments));
    // console.log(arguments.length);
    if (arguments.length == 1) {
        //logger.log('info', arguments[0]);
        // console.log(typeof(arguments[0]))
        if (typeof(arguments[0]) == 'object')  {
            // console.log('object');
            logger.log('info', JSON.stringify(arguments[0], null, 4));
            //listArgs = listArgs + ' ' + JSON.stringify(arguments[0]);
        } else {
            // console.log('other');
            logger.log('info', arguments[0]);
        }
    
    } else {
        var listArgs = "";
        for (var i = 0; i < arguments.length; i++) {
            // console.log(typeof(arguments[i]));
            if (typeof(arguments[i] == 'object'))  {
                listArgs = listArgs + ' ' + JSON.stringify(arguments[i]);
            } else {
                listArgs = listArgs + ' ' + arguments[i];
            }
        }
        logger.log('info',listArgs);    
    }

    /*
    
    if (arguments.length == 1) {
        logger.log({ level: 'info', message: arguments[0] });    
    } else {
        logger.log({ level: 'info', message: listArgs });    
    }
    */
    
    // logger.log("info", "Starting up with config %j", listArgs);
}

exports.error = function(data) {
    if (arguments.length == 1) {
        if (typeof(arguments[0]) == 'object')  {
            logger.log('error', JSON.stringify(arguments[0], null, 4));
        } else {
            logger.log('error', arguments[0]);
        }
    
    } else {
        var listArgs = "";
        for (var i = 0; i < arguments.length; i++) {
            // console.log(typeof(arguments[i]));
            if (typeof(arguments[i] == 'object'))  {
                listArgs = listArgs + ' ' + JSON.stringify(arguments[i], null, 4);
            } else {
                listArgs = listArgs + ' ' + arguments[i];
            }
        }
        logger.log('error',listArgs);    
    }
}

exports.log2email = function(data){
    console.log('########## LOG 2 EMAIL TO TO TO TO ');
}


/* EMAIL

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



*/

