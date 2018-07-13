/* protocollo module*/
/* contiene tutte le funzioni di utilitù per il route protocollo.js*/
var ENV = require('../config/configPROTOCOLLO.js'); // load configuration data
var validator = require('validator');
var fs = require('fs');
var fsExtra = require('fs-extra');
var spark = require('spark-md5');
var md5File = require('md5-file');
var moment = require('moment');
var mime = require('mime');
var utilityModule  = require('../models/utilityModule.js'); 
var soap = require('soap');
var handlebars = require('handlebars');


var log = require('log4js').getLogger("app");
log.info('START protocolloModule.js');

exports.verificaReCaptcha = function(fieldsObj, envData){
    log.info('[' + envData.idIstanza + '] protocolloModule.js:buildOggetto');
    var fileContents = '';
    var templateFileName = envData.templateOggetto;

    try {
        fileContents = fs.readFileSync(templateFileName).toString();
    } 
    catch (err) 
    {
        log.error('[' + envData.idIstanza + '] protocolloModule.js:buildOggetto');
        log.error(err);
        return false;
    }
    var template = handlebars.compile(fileContents);
    htmlResponseMsg = template(fieldsObj);
    log.info(htmlResponseMsg);
    return htmlResponseMsg;
}



exports.buildTemplate = function(fieldsObj, templateFileName){
    log.info('protocolloModule.js:buildTemplate');
    var fileContents = '';
    
    try {
        fileContents = fs.readFileSync(templateFileName).toString();
    } 
    catch (err) 
    {
        log.error('protocolloModule.js:buildTemplate');
        log.error(err);
        return false;
    }
    var template = handlebars.compile(fileContents);
    htmlResponseMsg = template(fieldsObj);
    log.info(htmlResponseMsg);
    return htmlResponseMsg;
}


exports.buildOggetto = function(fieldsObj, envData){
    log.info('[' + envData.idIstanza + '] protocolloModule.js:buildOggetto');
    var fileContents = '';
    var templateFileName = envData.templateOggetto;

    try {
        fileContents = fs.readFileSync(templateFileName).toString();
    } 
    catch (err) 
    {
        log.error('[' + envData.idIstanza + '] protocolloModule.js:buildOggetto');
        log.error(err);
        return false;
    }
    var template = handlebars.compile(fileContents);
    htmlResponseMsg = template(fieldsObj);
    log.info(htmlResponseMsg);
    return htmlResponseMsg;
}

exports.buildMessaggioRisposta = function(fieldsObj, envData){
    log.info('[' + envData.idIstanza + '] protocolloModule.js:buildMessaggioRisposta');
    var fileContents = '';
    var templateFileName = envData.templateRisposta;

    try {
        fileContents = fs.readFileSync(templateFileName).toString();
    } 
    catch (err) 
    {
        log.error('[' + envData.idIstanza + '] protocolloModule.js:buildOggetto');
        log.error(err);
        return false;
    }
    var template = handlebars.compile(fileContents);
    htmlResponseMsg = template(fieldsObj);
    log.info(htmlResponseMsg);
    return htmlResponseMsg;
}

exports.sanitizeFile = function (fileList, envData) {
    log.info('[' + envData.idIstanza + '] protocolloModule:sanitizeFile');
    var bValid = true;
    var msgValidator = '';


    log.info('---------- fileList -----------------------------------------------------------');
    log.info(fileList);
    log.info(Object.keys(fileList).length);
    log.info(envData.numeroAllegati);


    if ( Object.keys(fileList).length != envData.numeroAllegati ){
        log.error('[' + envData.idIstanza + '] protocolloModule:sanitizeFile:numero allegati non corretto!');
        bValid = false;  msgValidator = 'numero allegati non previsto';
    }

    Object.keys(fileList).forEach(function(name) {
        log.info('protocolloModule:sanitizeFile:');
        // log.info(name);
        log.info(fileList[name][0].size,envData.maxFileSize) ;
        if (parseInt(fileList[name][0].size) > parseInt(envData.maxFileSize)) {
            log.error('[' + envData.idIstanza + '] protocolloModule:sanitizeFile:numero allegati non corretto!');
            bValid = false;  msgValidator = 'dimensione degli allegati supera il limite';
        }
    });

    if ( bValid ) {
        return true;
    } else {
        log.error('[' + envData.idIstanza + '] protocolloModule:sanitizeFile');
        log.error(msgValidator);
        return false;
    }
}


/*
    Esegue un controllo sulla esistenza e sul valore dei parametri passati
    e crea fieldsObj
*/

exports.sanitizeInput = function (fieldList, fieldsObj,  envData) {
    
    log.info('[' + envData.idIstanza + '] protocolloModule:sanitizeInput');
    log.info('---------- fieldList -----------------------------------------------------------');
    log.info(fieldList);

    fieldsObj.reqId = envData.reqId;

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

    log.info('---------- fieldsObj -----------------------------------------------------------');
    log.info(fieldsObj);
    log.info('protocolloModule:validate data ...');
    var bValid = true;
    var msgValidator = '';

    /* validazione esistenza */

    if( !fieldsObj.nomeRichiedente){    bValid = false;  msgValidator = 'nomeRichiedente richiesto'; }
    if( !fieldsObj.cognomeRichiedente){ bValid = false;  msgValidator = 'cognomeRichiedente richiesto'; }
    if( !fieldsObj.codiceFiscaleRichiedente){ bValid = false;  msgValidator = 'codiceFiscaleRichiedente richiesto'; }
    if( !fieldsObj.dataNascitaRichiedente) { bValid = false;  msgValidator = 'dataNascitaRichiedente richiesto'; }
    if( !fieldsObj.indirizzoRichiedente){ bValid = false;  msgValidator = 'indirizzoRichiedente richiesto'; }
    if( !fieldsObj.cittaRichiedente){ bValid = false;  msgValidator = 'cittaRichiedente richiesto'; }
    if( !fieldsObj.capRichiedente) { bValid = false;  msgValidator = 'capRichiedente richiesto'; }
    if( !fieldsObj.emailRichiedente){ bValid = false;  msgValidator = 'emailRichiedente richiesto'; }
    if( !fieldsObj.recapitoTelefonicoRichiedente){ bValid = false;  msgValidator = 'recapitoTelefonicoRichiedente richiesto'; }
    
    /* validazione dimensioni */

    if( fieldsObj.nomeRichiedente.length > 80 ){
        log.info(fieldsObj.nomeRichiedente.length);
        bValid = false;
        msgValidator = 'nomeRichiedente troppo lungo';
    }

    if( fieldsObj.cognomeRichiedente.length > 80 ){
        log.info(fieldsObj.cognomeRichiedente.length);
        bValid = false;
        msgValidator = 'cognomeRichiedente troppo lungo';
    }

    if( fieldsObj.codiceFiscaleRichiedente.length != 16){
        log.info(fieldsObj.codiceFiscaleRichiedente.length);
        bValid = false;
        msgValidator = 'Codice fiscale non valido';
    }

    if( fieldsObj.indirizzoRichiedente.length > 80 ){
        log.info(fieldsObj.indirizzoRichiedente.length);
        bValid = false;
        msgValidator = 'indirizzoRichiedente troppo lungo';
    }

    if( fieldsObj.cittaRichiedente.length > 80 ){
        log.info(fieldsObj.cittaRichiedente.length);
        bValid = false;
        msgValidator = 'cittaRichiedente troppo lungo';
    }

    if( fieldsObj.capRichiedente.length > 80 ){
        log.info(fieldsObj.capRichiedente.length);
        bValid = false;
        msgValidator = 'capRichiedente troppo lungo';
    }

    if( fieldsObj.emailRichiedente.length > 80 ){
        log.info(fieldsObj.emailRichiedente.length);
        bValid = false;
        msgValidator = 'emailRichiedente troppo lungo';
    }

    if( fieldsObj.recapitoTelefonicoRichiedente.length > 80 ){
        log.info(fieldsObj.recapitoTelefonicoRichiedente.length);
        bValid = false;
        msgValidator = 'recapitoTelefonicoRichiedente troppo lungo';
    }

    if(fieldsObj.noteRichiedente){
        if( fieldsObj.noteRichiedente.length > 80 ){
            log.info(fieldsObj.noteRichiedente.length);
            bValid = false;
            msgValidator = 'noteRichiedente troppo lungo';
        }
    }

    /*

    if( fieldsObj.oggettoRichiedente && (fieldsObj.oggettoRichiedente.length > 300) ){
        bValid = false;
        msgValidator = 'Oggetto troppo lungo';
    }

    */

    /* validazione di tipo */
    
    if( !validator.isEmail(fieldsObj.emailRichiedente) ){
        bValid = false;
        msgValidator = 'Email non valida';
    }
   
    if( !validator.isDecimal(fieldsObj.recapitoTelefonicoRichiedente)){
        bValid = false;
        msgValidator = 'recapitoTelefonicoRichiedente non valido';
    }

    if( !validator.isDecimal(fieldsObj.capRichiedente) ){
        bValid = false;
        msgValidator = 'capRichiedente non valido';
    }

    log.info(fieldsObj.dataNascitaRichiedente);
    if( !moment( fieldsObj.dataNascitaRichiedente, 'DD/MM/YYYY', true).isValid()){
        bValid = false;
        msgValidator = 'Data di Nascita non valida';
    } 

    if ( bValid ) {
        return true;
    } else {
        msgValidator = '[' + envData.idIstanza + '] '+ msgValidator;
        log.error('[' + envData.idIstanza + '] protocolloModule:sanitizeInput');
        log.error(msgValidator);
        return false;
    }
     
}

/*

    Controllo dei dati di input per il form dinamico

*/


exports.sanitizeInputDinamic = function (fieldList, fieldsObj,  envData) {
    
    log.info('[' + envData.idIstanza + '] protocolloModule:sanitizeInputDinamico');
    log.info('---------- fieldList -----------------------------------------------------------');
    log.info(fieldList);

    fieldsObj.reqId = envData.reqId;

    Object.keys(fieldList).forEach(function(name) {
        log.info('protocolloModule:sanitizeInput:got field named ' + name);

        var r = /\[(.*?)\]/;
        var rs = name.match(r);
        key = rs[1];
  
        log.info('protocolloModule:sanitizeInput:key ' + key);
      
        fieldsObj[key] = fieldList[name][0];

    });

    // validate object
    // https://www.npmjs.com/package/validator

    log.info('---------- fieldsObj -----------------------------------------------------------');
    log.info(fieldsObj);
    log.info('protocolloModule:validate data ...');
    var bValid = true;
    var msgValidator = '';

    /* validazione esistenza */

    // if( !fieldsObj.nomeRichiedente){    bValid = false;  msgValidator = 'nomeRichiedente richiesto'; }
    
    /* validazione dimensioni */

    if ( bValid ) {
        return true;
    } else {
        msgValidator = '[' + envData.idIstanza + '] '+ msgValidator;
        log.error('[' + envData.idIstanza + '] protocolloModule:sanitizeInput');
        log.error(msgValidator);
        return false;
    }
     
}


/* SALVA NELLA CARTELLA TEMPORANEA I DATI DI INPUT CON IL PROTOCOLLO */

exports.salvaDatiConProtocollo = function (fieldsObj, envData) {
    log.info('[' + envData.idIstanza + '] protocolloModule:salvaDatiConProtocollo');
    log.info('[' + envData.idIstanza + '] protocolloModule:storageFolder:' + envData.storageFolder);
    var dir = envData.storageFolder + "/" + envData.reqId;

    try{
        // throw "TEST - File NOT FOUND Exception";
        if (!fs.existsSync(dir)){
            try
            { 
                fs.mkdirSync(dir);
                log.info('protocolloModule:Folder OK' + dir);
            }
            catch(e) {
                log.error('[' + envData.idIstanza + '] protocolloModule:salvaDatiConProtocollo: create folder ERROR');
                log.error(e);
            }
        }
        log.info('protocolloModule:' + dir);
        
        // save metadata metadati
        var jsonFile = dir + "/PROTOCOLLO-" + envData.reqId + ".txt";
        log.info(jsonFile);
        fs.writeFileSync(jsonFile, JSON.stringify(fieldsObj));
        

        return true;

    } catch (e){
        log.error('[' + envData.idIstanza + '] savingFiles: ERROR');
        log.error(e);
        return false;
    }

}

/* OUTPUT VERSO UN CSV O DB dei dati protocollati */

exports.output2FileDatabase = function (fieldsObj, envData) {
    log.info('[' + envData.idIstanza + '] protocolloModule:output2FileDatabase');
    log.info('[' + envData.idIstanza + '] protocolloModule:storageFolder:' + envData.storageFolder);
    var dir = envData.storageFolder + "/" + envData.reqId;

    if (envData.outputData2CSV){
        try{
            log.info('[' + envData.idIstanza + '] write to: ', envData.outputData2CSV.filename);
            log.info('[' + envData.idIstanza + '] template to: ', envData.outputData2CSV.template);
            var templateFileName = envData.outputData2CSV.template;

            fileContents = fs.readFileSync(templateFileName).toString();
                        
            var template = handlebars.compile(fileContents);
            outputLine = template(fieldsObj) + "\n";
            log.info(outputLine);
            fs.appendFileSync(envData.outputData2CSV.filename, outputLine);
            return true;
        }
        catch (e){
            log.error('[' + envData.idIstanza + '] protocolloModule.js:output2FileDatabase:template: ERROR');
            log.error(e);
            return false;
        }
    }

}


/* SAVING FILES  

    salva i file dell'upload nella cartella temporanea

--------------------------------------------------------------------------------------------------------- */

exports.savingFiles = function (fileList, fieldsObj, envData) {
    log.info('[' + envData.idIstanza + '] protocolloModule:savingFiles');
    log.info('[' + envData.idIstanza + '] protocolloModule:storageFolder:' + envData.storageFolder);
    // var transactionId = req.body.fields.transactionId;
    var dir = envData.storageFolder + "/" + envData.reqId;

    log.info('protocolloModule:storageFolder:' + dir);
    fieldsObj.files = [];

    log.info('---------- fileList -----------------------------------------------------------');
    log.info(fileList);


    try{
        // throw "TEST - File NOT FOUND Exception";
        if (!fs.existsSync(dir)){
            try
            { 
                fs.mkdirSync(dir);
                log.info('protocolloModule:Folder OK' + dir);
            }
            catch(e) {
                log.error('[' + envData.idIstanza + '] protocolloModule:storageFolder: create folder ERROR');
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
        var jsonFile = dir + "/" + envData.reqId + ".txt";
        log.info(jsonFile);
        fs.writeFileSync(jsonFile, JSON.stringify(fieldsObj));
        log.info(fieldsObj);

        return true;

    } catch (e){
        log.error('[' + envData.idIstanza + '] savingFiles: ERROR');
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

exports.protocolloWS = function(objFilesList,  reqId, ENV_DATA, ENV_PROT) {

    log.info('[' + ENV_DATA.idIstanza + '] protocolloModule:protocolloWS:START');
    log.info(objFilesList);
    log.info(reqId);
    
    
    log.info(ENV_DATA.wsJiride);

    WS_IRIDE = ENV_DATA.wsJiride.url;
    WS_IRIDE_ENDPOINT = ENV_DATA.wsJiride.endpoint;

    log.info(WS_IRIDE);
    log.info(WS_IRIDE_ENDPOINT);

    // formattazione data per il WS
    // log.info(body);

    // preparazione dati

    var args = { 
           ProtoIn : {
                Data: moment().format('DD/MM/YYYY'),
                DataDocumento: moment().format('DD/MM/YYYY'),

                NumeroDocumento: 1,
                Classifica: ENV_DATA.wsJiride.classificaDocumento,
                TipoDocumento: ENV_DATA.wsJiride.tipoDocumento,
                Oggetto: (ENV_DATA.wsJiride.oggettoDocumento || 'OGGETTO NON PRESENTE') + '  -  (' + reqId + ')',
                Origine: ENV_DATA.wsJiride.origineDocumento,
                MittenteInterno: ENV_DATA.wsJiride.ufficioInternoMittenteDocumento,
                //MittenteInterno_Descrizione": "",
                AnnoPratica: ENV_DATA.wsJiride.annoPratica,
                NumeroPratica: ENV_DATA.wsJiride.numeroPratica,
                 
               MittentiDestinatari: {
                MittenteDestinatario: [
                  {
                    // PATCH per segnalazione Maggioli - Miriam Saladino  
                    // CodiceFiscale : objFilesList.codiceFiscaleRichiedente,
                    CodiceFiscale : '',
                    CognomeNome: objFilesList.cognomeRichiedente + ' ' + objFilesList.nomeRichiedente,
                    DataNascita : objFilesList.dataNascitaRichiedente,
                    Indirizzo : objFilesList.indirizzoRichiedente,
                    Localita : objFilesList.cittaRichiedente,
                    DataRicevimento: moment().format('DD/MM/YYYY'),
                    // Spese_NProt : 0,
                    // TipoSogg: 'S',
                    TipoPersona: ENV_DATA.wsJiride.tipoPersona,
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
              
              AggiornaAnagrafiche : ENV_DATA.wsJiride.aggiornaAnagrafiche,
              InCaricoA : ENV_DATA.wsJiride.ufficioInternoDestinatarioDocumento,
              Utente : ENV_DATA.wsJiride.Utente,
              // Ruolo : ENV_DEFAULT_USER.wsJiride.ruolo,              
              Allegati: {  Allegato: []  }
            }
        };

    log.info('---------WS ARGS ----------------------------');    
    log.info(args);

    // costruzione degli allegati con i metadati

    // Aggiunta allegato principale
    /*
    var fname = objFilesList.domandaPermessoFormatoPDF.nomeFile;
    var ext = fname.substring(fname.length - 3);
    log.info(fname);
    log.info(ext);
    var mtype =  mime.lookup(ext);
    log.info(mtype);

    args.ProtoIn.Allegati.Allegato.push(
            {
                TipoFile : ext,
                ContentType : mtype,
                Image: objFilesList.domandaPermessoFormatoPDF.base64,
                NomeAllegato: objFilesList.domandaPermessoFormatoPDF.nomeFile,
                Commento : objFilesList.domandaPermessoFormatoPDF.tipoDescrizione
            }
        );
    */    

    // Aggiunta allegati successivi al primo

    var DW_PATH = ENV_DATA.storageFolder;
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

    // AGGIUNGE I metadati
    /*
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
    */


    var soapResult = { result : '....'};
 
    var soapOptions = {
        endpoint: WS_IRIDE_ENDPOINT
    };

    log.info('create client');

    return new Promise(function (resolve, reject) {


        soap.createClient(WS_IRIDE, soapOptions, function(err, client){
            
            if (err) {
                var msg = 'Errore nella creazione del client soap';
                log.error('[' + ENV_DATA.idIstanza + ']' + msg);
                log.error(msg); 
                log.error(err); 
                reject(err);
            } else {

                client.InserisciProtocolloEAnagrafiche(args,  function(err, result) {
                //client.InserisciProtocollo(args,  function(err, result) {
                
                    if (err) {
                        var msg = 'Errore nella chiamata ad InserisciProtocollo';
                        log.error('[' + ENV_DATA.idIstanza + ']' + msg);
                        log.error(msg);  
                        log.error(err);  
                        log.info(args);
                        reject(err);
                    } else {
                        resolve(result);
                    }

                }); //client.InserisciProtocollo
            }

            });  //soap.createClient

     }); 
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

