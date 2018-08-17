/* ESTENSIONE per Form DIN01*/
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
var pM = require("../models/protocolloModule.js");
var soap = require('soap');
var handlebars = require('handlebars');
var async = require('async');


var log = require('log4js').getLogger("app");
log.info('START DIN01.js');

// operazioni per il modulo

exports.execute = function(objField, reqId, ENV_FORM_CONFIG, ENV_PROT){
    log.info('DIN01 EXTENSIONS START!------------------');
    log.info(objField);
    log.info(reqId);
    log.info(ENV_FORM_CONFIG);
    log.info(ENV_PROT);
    
    return new Promise(function (resolve, reject) {
        
        async.series([

            function(callback){ 
                log.info(ENV_FORM_CONFIG);
                log.info(ENV_PROT);
                callback(null, 'DIN01 module parametri 1 stampati correttamente');
            },

            function(callback){ 
                log.info(objField);
                log.info(reqId);
                callback(null, 'DIN01 module parametri 2 stampati correttamente');
            },

            function(callback){ 
                log.info('>>>>>>>>>>>>>>>>>>>>>>>Protocollo in uscita');


                var options = {};
                options.reqId = reqId;
                options.idIstanza = ENV_FORM_CONFIG.idIstanza;
                options.ws_url = ENV_FORM_CONFIG.wsJiride.url;
                options.ws_endpoint = ENV_FORM_CONFIG.wsJiride.endpoint;
                options.storageFolder = ENV_FORM_CONFIG.storageFolder;
                
                options.classificaDocumento = ENV_FORM_CONFIG.wsJiride.classificaDocumento;
                options.tipoDocumento = ENV_FORM_CONFIG.wsJiride.tipoDocumento;
                options.oggettoDocumento = ' Documento in uscita ';
                options.origineDocumento = 'P';
                options.ufficioInternoMittenteDocumento = ENV_FORM_CONFIG.wsJiride.ufficioInternoMittenteDocumento;
                options.annoPratica = ENV_FORM_CONFIG.wsJiride.annoPratica;
                options.numeroPratica = ENV_FORM_CONFIG.wsJiride.numeroPratica;
                options.tipoPersona = ENV_FORM_CONFIG.wsJiride.tipoPersona; 

                options.cognomeRichiedente = ' IN USCITA ';
                options.nomeRichiedente = objField.nomeRichiedente;
                options.dataNascitaRichiedente = objField.dataNascitaRichiedente;
                options.indirizzoRichiedente = objField.indirizzoRichiedente;
                options.cittaRichiedente = objField.cittaRichiedente;
                options.emailRichiedente = objField.emailRichiedente;
                
                options.aggiornaAnagrafiche = ENV_FORM_CONFIG.wsJiride.aggiornaAnagrafiche;
                options.ufficioInternoDestinatarioDocumento = ENV_FORM_CONFIG.wsJiride.ufficioInternoDestinatarioDocumento;
                options.Utente = ENV_FORM_CONFIG.wsJiride.Utente;
                options.files = objField.files;
                options.metadata = false;


                // pM.protocolloWS(objFieldSanitized, reqId, ENV_FORM_CONFIG, ENV_PROT)
                pM.protocolloWS_V2(options)
                .then( function (result) {
                    log.info(result);
                    objDatiProtocollo = result;
                    var dataP = {};
                    dataP.idProtocollo =  objDatiProtocollo.InserisciProtocolloEAnagraficheResult.IdDocumento;
                    dataP.annoProtocollo = objDatiProtocollo.InserisciProtocolloEAnagraficheResult.AnnoProtocollo;
                    dataP.numeroProtocollo = objDatiProtocollo.InserisciProtocolloEAnagraficheResult.NumeroProtocollo;
                    dataP.dataProtocollo = objDatiProtocollo.InserisciProtocolloEAnagraficheResult.DataProtocollo;
                    callback(null, dataP);
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
            
            /*
            ,function(callback){ 
                log.info('INVIO VIA MAIL');
                log.info(reqId);


                var options = {};
                options.reqId = reqId;
                options.idIstanza = ENV_FORM_CONFIG.idIstanza;
                options.docId = 7007536;
                options.oggettoMail = 'MAIL DI PROVA';
                options.testoMail = 'TESTO DI PROVA';
                options.mittenteMail = 'protocollo.generale@comune.rimini.it';
                
                options.ws_posta = ENV_FORM_CONFIG.wsJiride.ws_posta;
                options.ws_posta_endpoint = ENV_FORM_CONFIG.wsJiride.ws_posta_endpoint;
                
                options.FormatoTesto = 0;
                options.Utente = 1;
                options.ruolo = 1;


                pM.mailWS(options)
                .then( function (result) {
                    log.info(result);
                    callback(null, result);
                })
                .catch(function (err) {
                    // console.log(err);
                    log.error('ERROR mailWS:');
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
            */

        ],function(err, results) {
            // results is now equal to: {one: 1, two: 2}
            log.info('DIN01 - EXTENSION ASYNC FINAL!:');
            if(err){
                log.error(err);
                reject(err);
            } else {
                log.info('DIN01 - EXTENSION ALL OK!!!!');
                resolve(results);
                // results.msg = htmlResponseMsg;
            }
        });
    });


}


