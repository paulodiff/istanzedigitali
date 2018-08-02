/* modulo che gestisce le interazioni con il database attraverso Sequelize */

var jwt = require('jsonwebtoken');
var moment = require('moment');
var ENV   = require('../config/config-RACCOMANDATE.js'); // load configuration data
var fs = require('fs');
var utilityModule  = require('../models/utilityModule.js'); // load configuration data
var request = require('request');
var qs = require('querystring');
var path = require('path');
var models = require("../modelsSequelizeRaccomandate");
// var log = require('../models/loggerModule.js');
var uuidV4 = require('uuid/v4');
var Sequelize = require("sequelize");
var async = require('async');
var _ = require('underscore');




module.exports = {



// rende persistente su database i dati della transazione di autenticazione
saveAuthTransaction: function(user){

  return new Promise(function(resolve, reject) {

    console.log('saveAuthTransaction');
    console.log(user);
    models.SpidLog.build(
      { 
          ts: new Date(),
          issuer: user.issuer,
          nameID: user.nameID,
          nameIDFormat: user.nameIDFormat,
          nameQualifier: user.nameQualifier,
          spNameQualifier: user.spNameQualifier,        
          authenticationMethod: user.authenticationMethod,
          dataNascita: user.dataNascita,
          userid: user.userid,
          statoNascita: user.statoNascita,
          policyLevel: user.policyLevel,
          nome: user.nome,
          CodiceFiscale: user.CodiceFiscale,
          trustLevel: user.trustLevel,
          luogoNascita: user.luogoNascita,
          authenticatingAuthority: user.authenticatingAuthority,
          cognome: user.cognome,
          getAssertionXml: user.getAssertionXml,
          uuidV4:  user.uuidV4,
      })
    .save()
    .then(function(anotherTask) {
      resolve(anotherTask)
    }).catch(function(error) {
       reject(error);
    });
  });

},

// memorizza i dati di una istanza per consultazioni
saveIstanza: function(data){

    return new Promise(function(resolve, reject) {
        console.log('saveIstanza');
        console.log(data);
        models.Istanze.build({
            ts: new Date(),
            tipoIstanza: data.tipoIstanza,
            userid: data.userid,
            AuthUuidV4 : data.AuthUuidV4,
            statoIter : data.statoIter,
            emailNotifiche: data.emailNotifiche,
            fileSystemId : data.fileSystemId,
            protocolloIdDocumento : data.protocolloIdDocumento,
            protocolloAnno : data.protocolloAnno,
            protocolloNumero : data.protocolloNumero
        })
        .save()
        .then(function(anotherTask) {
            resolve(anotherTask)
        }).catch(function(error) {
            reject(error);
        });
    })
},

getAuthList: function(userid){

    return new Promise(function(resolve, reject) {

        console.log('getAuthList');
        console.log(userid);

        models.SpidLog.findAll({
          where: {
            userid : userid
        } 
        }).then(function(anotherTask) {
            resolve(anotherTask)
        }).catch(function(error) {
            reject(error);
        });
    })
},


getIstanzeList: function(userid){

    return new Promise(function(resolve, reject) {

        console.log('getIstanzeList');
        console.log(userid);

        models.Istanze.findAll({
          where: {
            userid : userid
        } 
        }).then(function(anotherTask) {
            resolve(anotherTask)
        }).catch(function(error) {
            reject(error);
        });
    })
},

getInfoLog: function(opts){

    return new Promise(function(resolve, reject) {

        console.log('databaseModule:getInfoLog');
        console.log(opts);

        models.logSequelize.findAll({
          where: {
             tblName : opts.tblName,
             tblId : opts.tblId
            },
          order : [ ['id', 'DESC'] ] 
        }).then(function(anotherTask) {
            resolve(anotherTask);
        }).catch(function(error) {
            reject(error);
        });
    })
},


getAttiList: function(opts){
    return new Promise(function(resolve, reject) {

        console.log('databaseModule:getAttiList');

        console.log(opts);

        var parametriFiltro = {};
        var maxNumRighe = 1000;

        if (opts.nominativo != 'undefined') {
            parametriFiltro.atti_nominativo = { $like: '%' + opts.nominativo + '%' };;
        }

        if (opts.cronologico != 'undefined') {
            parametriFiltro.atti_cronologico = { $like: '%' + opts.cronologico + '%' };;
        }

        if (opts.maxnumrighe != 'undefined') {
            maxnumrighe = parseInt(opts.maxnumrighe);
        }

        //if (opts.dataricerca != 'undefined' || opts.dataricerca != '') {
        var dataPosta = moment(opts.dataricerca, "DD/MM/YYYY").format();
        console.log(dataPosta);
        if(dataPosta != 'Invalid date') {
            console.log(opts.dataricerca);

            var daDataPosta = moment(opts.dataricerca, "DD/MM/YYYY").hours(0).minutes(0).seconds(0).milliseconds(0).format();
            var aDataPosta = moment(opts.dataricerca, "DD/MM/YYYY").hours(23).minutes(59).seconds(59).milliseconds(0).format();
            console.log(daDataPosta);
            console.log(aDataPosta);
            /*
            ts : {
                $between: [obj.daDataPosta, obj.aDataPosta]
            }
            */
            parametriFiltro.atti_data_registrazione = { $between: [daDataPosta, aDataPosta] };
        }


        console.log('---PAMETRI FILTRO FINALE-------------------------------------------------');
        console.log(parametriFiltro);
        console.log('---PAMETRI FILTRO FINALE-------------------------------------------------');

        
        models.Atti.findAll({
            include: [
                {   
                    model: models.Consegnatari,
                    as: 'atti_consegnatari'
                    // ,where: { state: Sequelize.col('project.state') }
                }
            ],
            where: parametriFiltro,
            order: [['id','ASC']],
            limit: maxNumRighe
        /*
        models.Posta.findAll({
          where: {
            userid : opts.userid,
            posta_id: {
                $like: opts.today + '%'
            }
        } 
        */
        }).then(function(anotherTask) {
            resolve(anotherTask)
        }).catch(function(error) {
            reject(error);
        });
    })
},

// memorizza i dati di una istanza per consultazioni
saveAtti: function(data){

    return new Promise(function(resolve, reject) {
        console.log('databaseModule:saveAtti');
        console.log(data);

        models.Atti.build({
            atti_data_registrazione: new Date(),
            atti_nominativo: data.nominativo,
            atti_consegnatario_id: data.consegnatario,
            atti_cronologico: data.cronologico,
            atti_consegna_flag: '0',
            atti_operatore_inserimento: data.__userid__
        })
        .save()
        .then(function(anotherTask) {
            resolve(anotherTask);
        }).catch(function(error) {
            reject(error);
        });
    })
},




// aggiorna i dati di consegna di uno o più atti atto
updateConsegnaAtti: function(data){

    return new Promise(function(resolve, reject) {
        console.log('databaseModuleRaccomandate:updateConsegnaAtti');
        console.log('update:', data);
        console.log('user:', data.user);

        var listIdArray = data.idList.split(',');
        console.log(listIdArray);


        async.waterfall([

            function(callback){
                console.log('uC:findAndCountAll');
                models.Atti.findAndCountAll({ 
                    where: {
                        id: {
                          $in: listIdArray
                        },
                        atti_flag_consegna: 0
                      }
                }).then(function(result) {
                    console.log(result.count);
                    // console.log(result.rows);
                    console.log(listIdArray.length);

                    if (result.count != listIdArray.length){
                        callback({msg: 'I dati da aggiornare non possono essere aggiornati'}, null);
                    } else {
                        callback(null, result.count);
                    }
                }).catch(function(error) { 
                    callback(error, null);
                    // reject(error); 
                });
            },

            function(item, callback){
                console.log('dC:updateConsegna');
                models.Atti.update(
                    {
                        atti_note: data.note,
                        atti_soggetto: data.nominativo,
                        atti_documento : data.estremidocumento,
                        atti_data_consegna : new Date(),
                        atti_data_consegna_ok : new Date(),
                        atti_flag_consegna : '1',
                        atti_operatore_consegna : data.__userid__
                    },
                    { 
                        where: {
                            id: {
                              $in: listIdArray
                            }
                          }
                    }
                ).then(function(anotherTask) {
                    callback(null, anotherTask);
                    //resolve(anotherTask);
                }).catch(function(error) {
                    //reject(error); 
                    callback(error, null);
                });
            }
            

        ],function(err, results) {
            // results is now equal to: {one: 1, two: 2}
            console.log('uC:Final!');
            if(err){
                console.log('uC:Final:ERROR!');
                console.log(err);
                reject(err); 
                // res.status(500).send(err);
            } else {
                console.log('uC:Final:SUCCESS!');
                // res.status(200).send();
                resolve({updateConsegna:'ok'});
            }
        });

    });
},


// aggiorna i dati di un atto
updateAtto: function(data){

    return new Promise(function(resolve, reject) {
        console.log('databaseModuleRaccomandate:updateAtto');
        console.log('atto update:' + data.id);
        console.log(data);

        var tmpValues = {};
        var MyUserId = '';

        async.waterfall([

            function(callback){
                console.log('dMR:getAtto');
                models.Atti.findOne({ where: {id: data.id} }).then(function(item) {
                    tmpValues = _.clone(item.dataValues);
                    MyUserId = data.__userid__;
                    console.log(item.dataValues);
                    callback(null, item);
                }).catch(function(error) { 
                    callback(error, null);
                    // reject(error); 
                });
            },

            function(item, callback){
                console.log('dMR:updateAtto');
                item.update({
                    atti_nominativo: data.nominativo,
                    atti_cronologico: data.cronologico,
                    atti_consegnatario_codice : data.consegnatario
                }).then(function(anotherTask) {
                    console.log('dMR:updateAtto:ok');
                    callback(null, item, anotherTask);
                }).catch(function(error){
                    console.log('dMR:updateAtto:error');
                    callback(error, null);
                });
            },

            function(oldData, newData, callback){
                console.log('dMR:updateLog');
                console.log(oldData.dataValues);
                console.log(newData);
                console.log(tmpValues);
                logArray = [];
                for (var key in newData._changed) {

                    logArray.push({
                        ts: new Date(),
                        tblName: 'Atti',
                        tblId: data.id,
                        fldName: key,
                        oldValue: tmpValues[key],
                        newValue: newData.dataValues[key],
                        userId: MyUserId
                    });
                    console.log(key);
                    console.log(tmpValues[key],newData.dataValues[key]);
                }

                console.log(logArray);

                models.logSequelize.bulkCreate(logArray)
                .then(function() {
                    console.log('dMR:updateLog:ok');
                    callback(null, 'logOk');
                }).catch(function(error){
                    console.log('dMR:updateLog:error');
                    callback(error, null);
                });
                
            }

        ],function(err, results) {
            // results is now equal to: {one: 1, two: 2}
            console.log('dMR:Final!');
            if(err){
                console.log('dMR:Final:ERROR!');
                console.log(err);
                reject(err); 
                // res.status(500).send(err);
            } else {
                console.log('dMR:Final:SUCCESS!');
                // res.status(200).send();
                resolve({updateAtto:'ok'});
            }
        });

    });
},

getAttiConsegnatari: function(){

    return new Promise(function(resolve, reject) {
        console.log('getAttiConsegnatari');

        models.Consegnatari.findAll()
        .then(function(anotherTask) {
            resolve(anotherTask)
        }).catch(function(error) {
            reject(error);
        });
    })
},

getConsegna: function(opts){

    return new Promise(function(resolve, reject) {

        console.log('databaseModule:getConsegna');
        console.log(opts);

        var includeObj = {
            // attributes: ['consegna_documento'],
            include: [ {
                model: models.Attiinconsegna,
                // attributes: ['attiinconsegna_note'],
                as: 'atti_in_consegna',
                include :[
                    {
                        model: models.Atti,
                        // attributes: ['atti_nominativo'],
                        as: 'codice_atto',
                        include: [ 
                            { 
                                model: models.Consegnatari,
                                as: 'atti_consegnatari'
                            } 
                        ]
                    }
                ],
            } ],
            order : [ ['id', 'DESC'] ]
        };
       

        if(opts.id && (opts.id != 'undefined')) {
            console.log('databaseModule:getConsegna:byId');
            includeObj.where = {id : opts.id };
        }

        console.log(includeObj);

        models.Consegne.findAll(includeObj)
        .then(function(anotherTask) {
            resolve(anotherTask);
        }).catch(function(error) {
            reject(error);
        });
    })
},

// memorizza i dati di una consegna
saveConsegna: function(data){

    return new Promise(function(resolve, reject) {
        console.log('databaseModule:saveConsegna');
        console.log(data);

        listId = data.idList.split(',');
        attiArray = [];
        listId.forEach( function(element) {
            attiArray.push({
                attiinconsegna_codice_atto : element,
                attiinconsegna_note: data.idList
            })
        });
        console.log(attiArray);

        models.Consegne.create({
            consegna_ts:        new Date(),
            consegna_data_reg:  new Date(), 
            consegna_documento:  data.estremidocumento,        
            consegna_soggetto:   data.nominativo,        
            consegna_note:       data.note,        
            consegna_stato: 'PREPARATA',        
            consegna_operatore: data.__userid__,
            consegna_ids_atti: data.idList,
            consegna_numero_atti: listId.length,
            atti_in_consegna: attiArray
        },{
            include: [{
              model: models.Attiinconsegna,
              as: 'atti_in_consegna'
            }]
        })
        // .save()
        .then(function(anotherTask) {
            resolve(anotherTask);
        }).catch(function(error) {
            console.log(error);
            reject(error);
        });
    })
},


// RACCOMANDATE --------------------------------------------------------

getDestinatariRaccomandate: function(){

    return new Promise(function(resolve, reject) {
        console.log('getDestinatariRaccomandate');

        models.Destinatari.findAll()
        .then(function(anotherTask) {
            resolve(anotherTask)
        }).catch(function(error) {
            reject(error);
        });
    })
},

getRaccomandate: function(opts){
    return new Promise(function(resolve, reject) {

        console.log('databaseModule:getRaccomandate');

        console.log(opts);

        var parametriFiltro = {};
        var maxNumRighe = 1000;

        if (opts.mittente != 'undefined') {
            parametriFiltro.raccomandate_mittente = { $like: '%' + opts.mittente + '%' };;
        }

        if (opts.numero != 'undefined') {
            parametriFiltro.raccomandate_numero = { $like: '%' + opts.numero + '%' };;
        }

        if (opts.maxnumrighe != 'undefined') {
            maxnumrighe = parseInt(opts.maxnumrighe);
        }

        //if (opts.dataricerca != 'undefined' || opts.dataricerca != '') {
        var dataPosta = moment(opts.dataricerca, "DD/MM/YYYY").format();
        console.log(dataPosta);
        if(dataPosta != 'Invalid date') {
            console.log(opts.dataricerca);

            var daDataPosta = moment(opts.dataricerca, "DD/MM/YYYY").hours(0).minutes(0).seconds(0).milliseconds(0).format();
            var aDataPosta = moment(opts.dataricerca, "DD/MM/YYYY").hours(23).minutes(59).seconds(59).milliseconds(0).format();
            console.log(daDataPosta);
            console.log(aDataPosta);
            /*
            ts : {
                $between: [obj.daDataPosta, obj.aDataPosta]
            }
            */
            parametriFiltro.raccomandate_data_reg = { $between: [daDataPosta, aDataPosta] };
        }


        console.log('---PAMETRI FILTRO FINALE-------------------------------------------------');
        console.log(parametriFiltro);
        console.log('---PAMETRI FILTRO FINALE-------------------------------------------------');

        
        models.Raccomandate.findAll({
            include: [
                {   
                    model: models.Destinatari,
                    as: 'raccomandate_destinatari'
                    // ,where: { state: Sequelize.col('project.state') }
                }
            ],
            where: parametriFiltro,
            order: [['raccomandate_destinatario_codice','ASC'],['id','ASC']],
            limit: maxNumRighe
        /*
        models.Posta.findAll({
          where: {
            userid : opts.userid,
            posta_id: {
                $like: opts.today + '%'
            }
        } 
        */
        }).then(function(anotherTask) {
            resolve(anotherTask)
        }).catch(function(error) {
            reject(error);
        });
    })
},

// memorizza i dati di una istanza per consultazioni
saveRaccomandata: function(data){

    return new Promise(function(resolve, reject) {
        console.log('databaseModule:saveRaccomandata');
        console.log(data);

        models.Raccomandate.build({
            raccomandate_data_reg: new Date(),
            raccomandate_numero: data.numero,
            raccomandate_destinatario_codice: data.destinatario,
            raccomandate_mittente: data.mittente,
            raccomandate_operatore: data.__userid__
        })
        .save()
        .then(function(anotherTask) {
            resolve(anotherTask);
        }).catch(function(error) {
            reject(error);
        });
    })
},

// aggiorna i dati di una raccomandata
updateRaccomandata: function(data){

    return new Promise(function(resolve, reject) {
        console.log('databaseModuleRaccomandate:updateRaccomandata');
        console.log('atto updateRaccomandata:' + data.id);

        var tmpValues = {};

        async.waterfall([

            function(callback){
                console.log('dMR:getRaccomandata');
                models.Raccomandate.findOne({ where: {id: data.id} }).then(function(item) {
                    tmpValues = _.clone(item.dataValues);
                    console.log(item.dataValues);
                    callback(null, item);
                }).catch(function(error) { 
                    callback(error, null);
                    // reject(error); 
                });
            },

            function(item, callback){
                console.log('dMR:updateRaccomandata');
                item.update({
                    raccomandate_numero: data.numero,
                    raccomandate_mittente: data.mittente,
                    raccomandate_destinatario_codice : data.consegnatario
                }).then(function(anotherTask) {
                    console.log('dMR:updateRaccomandata:ok');
                    callback(null, item, anotherTask);
                }).catch(function(error){
                    console.log('dMR:updateRaccomandata:error');
                    callback(error, null);
                });
            },

            function(oldData, newData, callback){
                console.log('dMR:updateLog');
                console.log(oldData.dataValues);
                console.log(newData);
                console.log(tmpValues);
                logArray = [];
                for (var key in newData._changed) {

                    logArray.push({
                        ts: new Date(),
                        tblName: 'Raccomandate',
                        tblId: data.id,
                        fldName: key,
                        oldValue: tmpValues[key],
                        newValue: newData.dataValues[key],
                        userId: data.__userid__
                    });
                    console.log(key);
                    console.log(tmpValues[key],newData.dataValues[key]);
                }

                console.log(logArray);

                models.logSequelize.bulkCreate(logArray)
                .then(function() {
                    console.log('dMR:updateLog:ok');
                    callback(null, 'logOk');
                }).catch(function(error){
                    console.log('dMR:updateLog:error');
                    callback(error, null);
                });
                
            }

        ],function(err, results) {
            // results is now equal to: {one: 1, two: 2}
            console.log('dMR:Final!');
            if(err){
                console.log('dMR:Final:ERROR!');
                console.log(err);
                reject(err); 
                // res.status(500).send(err);
            } else {
                console.log('dMR:Final:SUCCESS!');
                // res.status(200).send();
                resolve({updateAtto:'ok'});
            }
        });

    });
},

// Statistiche ---------------------------------------------------------------------------------

getStatsRaccomandateOperatore: function(obj){

    return new Promise(function(resolve, reject) {
        console.log('getStatsRaccomandateOperatore');
        console.log(obj);

        var dataInizio = obj.anno + '-01-01T00:00:00';
        var dataFine = obj.anno + '-12-31T00:00:00';

        // var daData = moment(dataInizio, 'DD/MM/YYYY").hours(0).minutes(0).seconds(0).milliseconds(0).format();
        // var aData = moment(dataFine, 'DD/MM/YYYY").hours(23).minutes(59).seconds(59).milliseconds(0).format();
        console.log(dataInizio);
        console.log(dataFine);

       models.Raccomandate.findAll({
            attributes: [   'raccomandate_operatore',
                            // [Sequelize.fn('LEFT', Sequelize.col('posta_id'), 8), 'posta_id_cut'],
                            [Sequelize.fn('COUNT', 'raccomandate_operatore'), 'raccomandate_count'],
                        ],
            where : { 
                raccomandate_data_reg : {
                        $between: [dataInizio, dataFine]
                    }
            },
            group: ['raccomandate_operatore'],
            order : [ 
                    [Sequelize.col('raccomandate_count'), 'DESC']
                    // , ['tipo_spedizione'] 
            ]
        })

        .then(function(anotherTask) {
            resolve(anotherTask)
        }).catch(function(error) {
            reject(error);
        });
    })
},

getStatsRaccomandateDestinatario: function(obj){

    return new Promise(function(resolve, reject) {
        console.log('getStatsRaccomandateDestinatario');
        console.log(obj);

        var dataInizio = obj.anno + '-01-01T00:00:00';
        var dataFine = obj.anno + '-12-31T00:00:00';

        // var daData = moment(dataInizio, 'DD/MM/YYYY").hours(0).minutes(0).seconds(0).milliseconds(0).format();
        // var aData = moment(dataFine, 'DD/MM/YYYY").hours(23).minutes(59).seconds(59).milliseconds(0).format();
        console.log(dataInizio);
        console.log(dataFine);

       models.Raccomandate.findAll({
            
            attributes: [   'raccomandate_destinatari.destinatario_descrizione',
                            // [Sequelize.fn('LEFT', Sequelize.col('posta_id'), 8), 'posta_id_cut'],
                            [Sequelize.fn('COUNT', 'raccomandate_destinatari.destinatario_descrizione'), 'raccomandate_count'],
                        ],
            
            include: [
                            {   
                                model: models.Destinatari,
                                as: 'raccomandate_destinatari'
                                // ,where: { state: Sequelize.col('project.state') }
                            }
                        ],
            where : { 
                raccomandate_data_reg : {
                        $between: [dataInizio, dataFine]
                    }
            },
            group: ['raccomandate_destinatari.destinatario_descrizione'],
            order : [ 
                    [Sequelize.col('raccomandate_count'), 'DESC']
                    // , ['tipo_spedizione'] 
            ]
        })

        .then(function(anotherTask) {
            resolve(anotherTask)
        }).catch(function(error) {
            reject(error);
        });
    })
},


getStatsAttiConsegnatario: function(obj){

    return new Promise(function(resolve, reject) {
        console.log('getAttiConsegnatario');
        console.log(obj);

        var dataInizio = obj.anno + '-01-01T00:00:00';
        var dataFine = obj.anno + '-12-31T00:00:00';

        // var daData = moment(dataInizio, 'DD/MM/YYYY").hours(0).minutes(0).seconds(0).milliseconds(0).format();
        // var aData = moment(dataFine, 'DD/MM/YYYY").hours(23).minutes(59).seconds(59).milliseconds(0).format();
        console.log(dataInizio);
        console.log(dataFine);

       models.Atti.findAll({
            
            attributes: [   'atti_consegnatari.consegnatario_descrizione',
                            // [Sequelize.fn('LEFT', Sequelize.col('posta_id'), 8), 'posta_id_cut'],
                            [Sequelize.fn('COUNT', 'atti_consegnatari.consegnatario_descrizione'), 'atti_count'],
                        ],
            
            include: [
                            {   
                                model: models.Consegnatari,
                                as: 'atti_consegnatari'
                                // ,where: { state: Sequelize.col('project.state') }
                            }
                        ],
            where : { 
                atti_data_registrazione : {
                        $between: [dataInizio, dataFine]
                    }
            },
            group: ['atti_consegnatari.consegnatario_descrizione'],
            order : [ 
                    [Sequelize.col('atti_count'), 'DESC']
                    // , ['tipo_spedizione'] 
            ]
        })

        .then(function(anotherTask) {
            resolve(anotherTask)
        }).catch(function(error) {
            reject(error);
        });
    })
},



getStatsAttiOperatore: function(obj){

    return new Promise(function(resolve, reject) {
        console.log('getStatsAttiOperatore');
        console.log(obj);

        var dataInizio = obj.anno + '-01-01T00:00:00';
        var dataFine = obj.anno + '-12-31T00:00:00';

        // var daData = moment(dataInizio, 'DD/MM/YYYY").hours(0).minutes(0).seconds(0).milliseconds(0).format();
        // var aData = moment(dataFine, 'DD/MM/YYYY").hours(23).minutes(59).seconds(59).milliseconds(0).format();
        console.log(dataInizio);
        console.log(dataFine);

       models.Atti.findAll({
            attributes: [   'atti_operatore_inserimento',
                            // [Sequelize.fn('LEFT', Sequelize.col('posta_id'), 8), 'posta_id_cut'],
                            [Sequelize.fn('COUNT', 'atti_operatore_inserimento'), 'atti_count'],
                        ],
            where : { 
                atti_data_registrazione : {
                        $between: [dataInizio, dataFine]
                    }
            },
            group: ['atti_operatore_inserimento'],
            order : [ 
                    [Sequelize.col('atti_count'), 'DESC']
                    // , ['tipo_spedizione'] 
            ]
        })

        .then(function(anotherTask) {
            resolve(anotherTask)
        }).catch(function(error) {
            reject(error);
        });
    })
},

getStatsAttiConsegnatiOperatore: function(obj){

    return new Promise(function(resolve, reject) {
        console.log('getStatsAttiConsegnatiOperatore');
        console.log(obj);

        var dataInizio = obj.anno + '-01-01T00:00:00';
        var dataFine = obj.anno + '-12-31T00:00:00';

        // var daData = moment(dataInizio, 'DD/MM/YYYY").hours(0).minutes(0).seconds(0).milliseconds(0).format();
        // var aData = moment(dataFine, 'DD/MM/YYYY").hours(23).minutes(59).seconds(59).milliseconds(0).format();
        console.log(dataInizio);
        console.log(dataFine);

       models.Atti.findAll({
            attributes: [   'atti_operatore_inserimento',
                            // [Sequelize.fn('LEFT', Sequelize.col('posta_id'), 8), 'posta_id_cut'],
                            [Sequelize.fn('COUNT', 'atti_operatore_inserimento'), 'atti_count'],
                        ],
            where : { 
                atti_data_registrazione : {
                        $between: [dataInizio, dataFine]
                    },
                atti_consegna_flag: 1
            },
            group: ['atti_operatore_inserimento'],
            order : [ 
                    [Sequelize.col('atti_count'), 'DESC']
                    // , ['tipo_spedizione'] 
            ]
        })

        .then(function(anotherTask) {
            resolve(anotherTask)
        }).catch(function(error) {
            reject(error);
        });
    })
},










// ###################################################################################################


// aggiorna i dati di una istanza per consultazioni
updatePosta: function(data){

    return new Promise(function(resolve, reject) {
        console.log('databaseModule:updatePosta');
        console.log('update:' + data.posta_id);

        models.Posta.findOne({ where: {posta_id: data.posta_id} }).then(item => {
            // project will be the first entry of the Projects table with the title 'aProject' || null
            item.update({
                protocollo: data.protocollo,
                tipo_spedizione: data.tipo_spedizione,
                destinatario_denominazione : data.destinatario_denominazione,
                destinatario_citta : data.destinatario_citta,
                destinatario_via: data.destinatario_via,
                destinatario_provincia : data.destinatario_provincia,
                destinatario_cap: data.destinatario_cap,
                barCode: data.barCode,
                verbale: data.verbale,
                note : data.note})
                .then(function(anotherTask) {resolve(anotherTask)})
                .catch(function(error) {reject(error)});
        });

    });
},

// elimina la riga selezionata
deletePosta: function(posta_id){

    return new Promise(function(resolve, reject) {
        console.log('databaseModule:deletePosta');
        console.log('deleteId:' + posta_id);

        models.Posta.findOne({ where: {posta_id: posta_id} }).then(item => {
            // project will be the first entry of the Projects table with the title 'aProject' || null
            item.destroy()
                .then(function(anotherTask) {resolve(anotherTask)})
                .catch(function(error) {reject(error)});
        });

    });
},

// get posta Item
getPostaById: function(posta_id){

    return new Promise(function(resolve, reject) {
        console.log('databaseModule:getPostaById');
        console.log('getd:' + posta_id);

        models.Posta.findOne({ where: {posta_id: posta_id} })
            .then(function(anotherTask) {resolve(anotherTask)})
            .catch(function(error) {reject(error)});
    });
},


getPostaCDC: function(){

    return new Promise(function(resolve, reject) {
        console.log('getPostaCDC');

        models.PostaCDC.findAll()
        .then(function(anotherTask) {
            resolve(anotherTask)
        }).catch(function(error) {
            reject(error);
        });
    })
},



getPostaStatsCountItem: function(obj){

    return new Promise(function(resolve, reject) {
        console.log('getPostaStats');

/*
        models.Posta.findAll({
            group: ['userid'],
            attributes: ['userid', [Sequelize.fn('COUNT', 'id'), 'Conteggio']],
        })
*/
       models.Posta.findAll({
            group: ['posta_id_cut','tipo_spedizione'],
            attributes: [   'posta_id', 'tipo_spedizione',
                            [Sequelize.fn('LEFT', Sequelize.col('posta_id'), 8), 'posta_id_cut'],
                            [Sequelize.fn('COUNT', 'posta_id_cut'), 'posta_id_count'],
                        ],
            where : { 
                ts : {
                        $between: [obj.daDataPosta, obj.aDataPosta]
                    }
            },
            order : [ [Sequelize.col('posta_id_cut'), 'ASC'], ['tipo_spedizione'] ]
        })



        .then(function(anotherTask) {
            resolve(anotherTask)
        }).catch(function(error) {
            reject(error);
        });
    })
},


getPostaStatsCountCdc: function(obj){

    return new Promise(function(resolve, reject) {
        console.log('getPostaStats');
       models.Posta.findAll({
            group: ['cdc'],
            attributes: [   'cdc', 
                            // [Sequelize.fn('LEFT', Sequelize.col('posta_id'), 8), 'posta_id_cut'],
                            [Sequelize.fn('COUNT', 'cdc'), 'cdc_count'],
                        ],
            where : { 
                ts : {
                        $between: [obj.daDataPosta, obj.aDataPosta]
                    }
            },                        
            order : ['cdc']
        })

        .then(function(anotherTask) {
            resolve(anotherTask)
        }).catch(function(error) {
            reject(error);
        });
    })
},


getPostaStatsCountMatricole: function(obj){

    return new Promise(function(resolve, reject) {
        console.log('getPostaStats');
       models.Posta.findAll({
            group: ['userid'],
            attributes: [   'userid', 
                            // [Sequelize.fn('LEFT', Sequelize.col('posta_id'), 8), 'posta_id_cut'],
                            [Sequelize.fn('COUNT', 'userid'), 'userid_count'],
                        ],
            where : { 
                ts : {
                        $between: [obj.daDataPosta, obj.aDataPosta]
                    }
            },                   
            order : [ [Sequelize.col('userid_count'), 'DESC'] ]
        })

        .then(function(anotherTask) {
            resolve(anotherTask)
        }).catch(function(error) {
            reject(error);
        });
    })
},

getPostaStatsCountTipi: function(obj){

    console.log('getPostaStatsCountTipi');

    return new Promise(function(resolve, reject) {
        
       models.Posta.findAll({
            group: ['tipo_spedizione'],
            attributes: [   'tipo_spedizione', 
                            // [Sequelize.fn('LEFT', Sequelize.col('posta_id'), 8), 'posta_id_cut'],
                            [Sequelize.fn('COUNT', 'tipo_spedizione'), 'tipo_spedizione_count'],
                        ],
            where : { 
                ts : {
                        $between: [obj.daDataPosta, obj.aDataPosta]
                    }
            }//, order : [ [Sequelize.col('userid_count'), 'DESC'] ]
        })

        .then(function(anotherTask) {
            resolve(anotherTask)
        }).catch(function(error) {
            reject(error);
        });
    })
}




/*
// search for attributes
Project.findOne({ where: {title: 'aProject'} }).then(project => {
  // project will be the first entry of the Projects table with the title 'aProject' || null
})
*/


    /*
        userid : {
        AuthUuidV4 : {
        statoIter : {
        emailNotifiche: {
        fileSystemId : {
        protocolloIdDocumento : {
        protocolloAnno : {
        protocolloNumero : {
    */


}
