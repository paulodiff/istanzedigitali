/*

  Modulo gestione della posta
  Permette di aggiungere aggiornare i dai della posta/raccomandate

*/ 

var express = require('express');
var moment = require('moment');
var router = express.Router();
var jwt = require('jwt-simple');
var fs = require('fs');
var ENV   = require('../config/config.js'); // load configuration data
// var User  = require('../models/user.js'); // load configuration data
var utilityModule  = require('../models/utilityModule.js'); // load configuration data
var log = require('../models/loggerModule.js');
var async = require('async');
var databaseModule = require("../models/databaseModule.js");


module.exports = function(){


router.get('/cdc', utilityModule.ensureAuthenticated, function(req, res) {
    log.log2console('PostaMgr get /cdc : ');

    console.log(req.query);

    databaseModule.getPostaCDC()
    .then( function (result) {
      // log.log2console(result);
      return res.status(200).send(result);
    })
    .catch(function (err) {
      log.log2console(err);
      return res.status(200).send(err);
    });
});


// GET recupera i dati inseriti della posta
//  Necessita di alcuni filtri da sistemare
// 
router.get('/posta', utilityModule.ensureAuthenticated, function(req, res) {
    log.log2console('PostaMgr get /posta : ');
    log.log2console(req.user);

    var key = req.user;  

    var options = {
      userid: req.user.userid,
      dataStampaTxt : req.query.dataStampaTxt ? req.query.dataStampaTxt : '',
      matricolaStampa : req.query.matricolaStampa ? req.query.matricolaStampa : '' ,
      tipo_spedizione : req.query.tipoPostaStampaTxt == 'P00 - TUTTI TIPI POSTA' ? '' : req.query.tipoPostaStampaTxt,
      dataStampaTxt:  req.query.dataStampaTxt,
      cdc: req.query.cdcStampaTxt == '0000' ? '' : req.query.cdcStampaTxt,
    };


    console.log(req.query);

    databaseModule.getPostaList(options)
         .then( function (result) {
                  // log.log2console(result);
                  return res.status(200).send(result);
               })
         .catch(function (err) {
                  log.log2console(err);
                  return res.status(200).send(err);
                });


    /*
    async.series([
      function(callback) { 
          databaseModule.getAuthList(req.user.userid)
         .then( function (result) {
                  // log.log2console(result);
                  key.AuthEvents = result;
                  callback(null, result);
               })
         .catch(function (err) {
                  log.log2console(err);
                  callback(err, null);
                });
      },
      function(callback) { 
          databaseModule.getIstanzeList(req.user.userid)
         .then( function (result) {
                  // log.log2console(result);
                  key.Istanze = result;
                  callback(null, result);
               })
         .catch(function (err) {
                  log.log2console(err);
                  callback(err, null);
                });
      },
    ],function(err, results) {
        // results is now equal to: {one: 1, two: 2}
        log.log2console('ASYNC -- FINAL!:');
        if(err){
            log.log2console(err);
            res.status(500).send(err);
        } else {
            //log.log2console(results);
            return res.status(200).send(key);
        }
    });
    */
     
});

// PUT aggiorna una riga già inserita

router.put('/posta', 
            utilityModule.ensureAuthenticated, 
            function(req, res) {

  log.log2console('PostaMgr PUT /posta UPDATE data');
  log.log2console(req.user);
  log.log2console(req.body);

  // verifica se il dato è storico 
  var d1 = (req.body.posta_id).split("@")[0];
  //console.log(d1);
  if (d1 == moment().format('YYYYMMDD') ){
    databaseModule.updatePosta(req.body).then(function (response) {
      console.log('PostaMgr posta saved!');
      return res.status(200).send('ok');
    }).catch(function (err) {
      console.log(err)
      return res.status(500).send(err);
    });
  } else {
    console.log('errore autorizzazione aggiornamento dati...');
    return res.status(420)
      .send({
              success: false,
              title: 'Azione non possibile',
              message: 'Non è possibile aggiornare i dati storici.',
      });
  }

});

// POST inserisce una nuova riga
router.post('/posta', 
            utilityModule.ensureAuthenticated, 
            function(req, res) {
              
  log.log2console('PostaMgr POST /posta');
  log.log2console(req.user);
  log.log2console(req.body);

  // assegna il campo id utente da autenticazione
  req.body.userid = req.user.userid;
  req.body.userEmail = req.user.userEmail;
  req.body.userDisplayName = req.user.displayName;

  log.log2console(moment().format('YYYYMMDD'));
  var d1 = (req.body.posta_id).split("@")[0];
  console.log(d1);

  if (d1 == moment().format('YYYYMMDD') ){
    
    console.log('root post /login/callback');

    //req.user.uuidV4 = uuidV4();
    databaseModule.savePosta(req.body).then(function (response) {
      console.log('PostaMgr posta saved!');
      return res.status(200).send('ok');
    }).catch(function (err) {
      console.log(err)
      return res.status(500).send(err);
    });
  } else {

    console.log('errore...');
    return res.status(420).send({
                          success: false,
                          title: 'Azione non possibile',
                          message: 'Non è possibile aggiungere elementi con data diversa da quella odierna.',
                      });
  }

});


// DELETE elimina righe inserite
router.delete(  '/posta/:posta_id', 
                utilityModule.ensureAuthenticated, 
                utilityModule.checkAppVersion,
                function(req, res) {
  log.log2console('PostaMgr DELETE !');
  log.log2console(req.user);
  log.log2console(req.params.posta_id);

  // cancellazione di un record solo del giorno corrente
  // log.log2console(moment().format('YYYYMMDD'));

  var d1 = (req.params.posta_id).split("@")[0];
  console.log(d1);

  var check1 = d1 == moment().format('YYYYMMDD');
  var check2 = req.user.isAdmin;

  if (check1 || check2) {
    console.log('procedo alla cancellazione');
    databaseModule.deletePosta(req.params.posta_id).then(function (response) {
      console.log('PostaMgr posta saved!');
      return res.status(200).send({
          success: true,
          id: req.params.posta_id,
          check1: check1,
          check2: check2
      });
    }).catch(function (err) {
      console.log(err)
      return res.status(500).send(err);
    });
  } else {
    console.log('cancellazione non consentita');
    return res.status(420)
      .send({
          success: false,
          title: 'Azione non possibile',
          message: 'Non è possibile eliminare i dati storici.',
      });
  }


});

// ritorna le statistiche
router.get('/stats', utilityModule.ensureAuthenticated, function(req, res) {
    log.log2console('PostaMgr get /stats : ');

    console.log(req.query);

    
    var key = {};
    async.series([
      function(callback) { 
          databaseModule.getPostaStatsCountItem(req.query)
         .then( function (result) {
                  // log.log2console(result);
                  key.StatsCountItem = result;
                  callback(null, result);
               })
         .catch(function (err) {
                  log.log2console(err);
                  callback(err, null);
                });
      },
      function(callback) { 
          databaseModule.getPostaStatsCountCdc(req.query)
         .then( function (result) {
                  // log.log2console(result);
                  key.StatsCountCdc = result;
                  callback(null, result);
               })
         .catch(function (err) {
                  log.log2console(err);
                  callback(err, null);
                });
      },
    ],function(err, results) {
        // results is now equal to: {one: 1, two: 2}
        log.log2console('Stats async -- FINAL!:');
        if(err){
            log.log2console(err);
            res.status(500).send(err);
        } else {
            //log.log2console(results);

            return res.status(200).send(key);
        }
    });

});



	return router;
}