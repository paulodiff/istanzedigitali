/*
  Modulo gestione delle raccomandate e degli atti 
  Permette di aggiungere aggiornare i dai della raccomandate/atti
*/ 

var express = require('express');
var moment = require('moment');
var router = express.Router();
var jwt = require('jwt-simple');
var fs = require('fs');
var ENV   = require('../config/config-RACCOMANDATE.js'); // load configuration data
// var User  = require('../models/user.js'); // load configuration data
var utilityModule  = require('../models/utilityModule.js'); // load configuration data

var log4js = require('log4js');
log4js.configure(ENV.log4jsConfig);
var log = log4js.getLogger("RaccomandateMgr");

var async = require('async');
var databaseModule = require("../models/databaseModuleRaccomandate.js");
var emitterBus = require("../models/emitterModule.js");


module.exports = function(){


router.get('/info', 
  //utilityModule.ensureAuthenticated, 
  function(req, res) {
    console.log('RaccomandateMgr info : ');
    log.info('Info request!');
    emitterBus.eventBus.sendEvent('logMessage', { sseId: 'INFO', msg: 'INFO'});
    return res.status(200).send({msg:'info'});
});

router.get('/atticonsegnatari', 
  //utilityModule.ensureAuthenticated, 
  function(req, res) {
    console.log('RaccomandateMgr get /atticonsegnatari : ');

    console.log(req.query);

    databaseModule.getAttiConsegnatari()
    .then( function (result) {
      // log.log2console(result);
      return res.status(200).send(result);
    })
    .catch(function (err) {
      console.log(err);
      return res.status(500).send(err);
    });
});

router.get('/infolog', 
  utilityModule.ensureAuthenticated, 
  function(req, res) {
    log.info('RaccomandateMgr get /atti : ');

    console.log(req.query);

    databaseModule.getInfoLog(req.query)
    .then( function (result) {
      // log.log2console(result);
      return res.status(200).send(result);
    })
    .catch(function (err) {
      console.log(err);
      return res.status(200).send(err);
    });
});


// GET recupera i dati inseriti con alcuni filtri da sistemare
// 
router.get('/atti', 
    // utilityModule.ensureAuthenticated, 
    function(req, res) {
    log.info('RaccomandateMgr get /atti : ');

    /*
    log.info(req.user);

    var key = req.user;  

    var options = {
      userid: req.user.userid,
      dataStampaTxt : req.query.dataStampaTxt ? req.query.dataStampaTxt : '',
      matricolaStampa : req.query.matricolaStampa ? req.query.matricolaStampa : '' ,
      tipo_spedizione : req.query.tipoPostaStampaTxt == 'P00 - TUTTI TIPI POSTA' ? '' : req.query.tipoPostaStampaTxt,
      dataStampaTxt:  req.query.dataStampaTxt,
      cdc: req.query.cdcStampaTxt == '0000' ? '' : req.query.cdcStampaTxt,
    };
    */

    console.log(req.query);
    var options = req.query;
    databaseModule.getAttiList(options)
         .then( function (result) {
                  // log.log2console(result);
                  return res.status(200).send(result);
               })
         .catch(function (err) {
                  log.info(err);
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

// PUT aggiorna i dati di consegna degli atti o i dati dell'atto a seconda del parametro

router.put('/atti', 
            // utilityModule.ensureAuthenticated, 
            function(req, res) {

    log.info('RaccomandateMgr PUT /atti UPDATE data');
    log.info(req.user);
    log.info(req.body);
      
    if(req.body.action == 'updateConsegna') {
      log.info('updateConsegna');
      databaseModule.updateConsegnaAtti(req.body).then(function (response) {
        console.log('RaccomandateMgr atti consegna updated!');
        // emitterBus.eventBus.sendEvent('updateMessage', { sseId: 'MYSSEDID', msg: response});
        return res.status(200).send({action: 'updateConsegna', status: 'ok', data: response});
      }).catch(function (err) {
        console.log('##ERRORE## RaccomandateMgr updateConsegna');
        console.log(err);
        return res.status(405).send(err);
      });
    };

    if(req.body.action == 'updateAtto') {
      log.info('updateAtto');
      databaseModule.updateAtto(req.body).then(function (response) {
        console.log('RaccomandateMgr atti updatedd!');
        emitterBus.eventBus.sendEvent('updateItemMessage', { msg: 'updateItem', newId: response.id});
        return res.status(200).send({action: 'updateAtto', status: 'ok'});
      }).catch(function (err) {
        console.log('##ERRORE## RaccomandateMgr updateAtto');
        console.log(err);
        return res.status(500).send(err);
      });
    };
    
    // return res.status(500).send({msg: 'action NOT found!'});

});

// POST inserisce una nuovo atto
router.post('/atti', 
            // utilityModule.ensureAuthenticated, 
            function(req, res) {
              
              console.log('RaccomandateMgr POST /atti');

  req.user = {userid: 'USER_TEST', userEmail: 'USER_EMAIL_TEST', displayName: 'USER_DISPLAY_NAME_TEST'};

  console.log(req.user);
  console.log(req.body);

  // assegna il campo id utente da autenticazione
  req.body.userid = req.user.userid;
  req.body.userEmail = req.user.userEmail;
  req.body.userDisplayName = req.user.displayName;
  req.body.operatore = req.user.userid;

  // console.log(moment().format('YYYYMMDD'));
  // var d1 = (req.body.posta_id).split("@")[0];
  // console.log(d1);

//  if (d1 == moment().format('YYYYMMDD') ){
    
    // console.log('root post /login/callback');



    //req.user.uuidV4 = uuidV4();
    databaseModule.saveAtti(req.body).then(function (response) {
      console.log('RaccomandateMgr posta saved!');
      console.log(response.id);
      console.log(response.dataValues.id);
      emitterBus.eventBus.sendEvent('newItemMessage', { msg: 'newItem', newId: response.id});
      //newItemMessage
      return res.status(200).send({msg:'ok:atti:saved!', newId: response.id, data: response});
    }).catch(function (err) {
      console.log(err)
      return res.status(500).send(err);
    });
/*
  } else {

    console.log('errore...');
    return res.status(420).send({
                          success: false,
                          title: 'Azione non possibile',
                          message: 'Non è possibile aggiungere elementi con data diversa da quella odierna.',
                      });
  }
*/
});


// Consegna POST inserisce 
router.post('/consegna', 
            // utilityModule.ensureAuthenticated, 
            function(req, res) {
              
              console.log('RaccomandateMgr POST /consegna');

  req.user = {userid: 'USER_TEST', userEmail: 'USER_EMAIL_TEST', displayName: 'USER_DISPLAY_NAME_TEST'};

  console.log(req.user);
  console.log(req.body);

  // assegna il campo id utente da autenticazione
  req.body.userid = req.user.userid;
  req.body.userEmail = req.user.userEmail;
  req.body.userDisplayName = req.user.displayName;
  req.body.operatore = req.user.userid;
    //req.user.uuidV4 = uuidV4();
  databaseModule.saveConsegna(req.body).then(function (response) {
      console.log('RaccomandateMgr consegna saved!');
      console.log(response.id);
      console.log(response.dataValues.id);
      emitterBus.eventBus.sendEvent('newConsegnaMessage', { msg: 'newConsegna', newId: response.id});
      //newItemMessage
      return res.status(200).send({msg:'ok:consegna:saved!', newId: response.id, data: response});
    }).catch(function (err) {
      console.log(err)
      return res.status(500).send(err);
  });
});


// GET recupera i dati inseriti con alcuni filtri da sistemare
// 
router.get('/consegna', 
    // utilityModule.ensureAuthenticated, 
    function(req, res) {
    log.info('RaccomandateMgr get /consegna : ');

    console.log(req.query);
    var options = req.query;
    databaseModule.getConsegna(options)
         .then( function (result) {
                  // log.log2console(result);
                  return res.status(200).send(result);
               })
         .catch(function (err) {
                  log.info(err);
                  return res.status(200).send(err);
                });
     
});


// RACCOMANDATE ------------------------------------------------------------------------------------


router.get('/destinatariraccomandate', 
  utilityModule.ensureAuthenticated, 
  function(req, res) {
    console.log('RaccomandateMgr get /destinatariraccomandate : ');

    console.log(req.query);

    databaseModule.getDestinatariRaccomandate()
    .then( function (result) {
      // log.log2console(result);
      return res.status(200).send(result);
    })
    .catch(function (err) {
      console.log(err);
      return res.status(500).send(err);
    });
});

// GET recupera i dati inseriti con alcuni filtri da sistemare
// 
router.get('/raccomandate', 
    utilityModule.ensureAuthenticated, 
    function(req, res) {
    log.info('RaccomandateMgr get /raccomandate : ');
   
    console.log(req.query);
    var options = req.query;
    databaseModule.getRaccomandate(options)
         .then( function (result) {
                  // log.log2console(result);
                  return res.status(200).send(result);
               })
         .catch(function (err) {
                  log.info(err);
                  return res.status(200).send(err);
                });
    
});

// POST inserisce una nuova raccomandata
router.post('/raccomandate', 
            utilityModule.ensureAuthenticated, 
            function(req, res) {
              
  console.log('RaccomandateMgr POST /raccomandate');

  req.user = {userid: 'USER_TEST', userEmail: 'USER_EMAIL_TEST', displayName: 'USER_DISPLAY_NAME_TEST'};

  console.log(req.user);
  console.log(req.body);

  // assegna il campo id utente da autenticazione
  req.body.userid = req.user.userid;
  req.body.userEmail = req.user.userEmail;
  req.body.userDisplayName = req.user.displayName;
  req.body.operatore = req.user.userid;

    //req.user.uuidV4 = uuidV4();
    databaseModule.saveRaccomandata(req.body).then(function (response) {
      console.log('RaccomandateMgr raccomandata saved!');
      console.log(response.id);
      console.log(response.dataValues.id);
      emitterBus.eventBus.sendEvent('newItemMessage', { msg: 'newItem', newId: response.id});
      //newItemMessage
      return res.status(200).send({msg:'ok:raccomandata:saved!', newId: response.id, data: response});
    }).catch(function (err) {
      console.log(err)
      return res.status(500).send(err);
    });
});


// PUT aggiorna i dati di una raccomandata

router.put('/raccomandate', 
            utilityModule.ensureAuthenticated, 
            function(req, res) {

    log.info('RaccomandateMgr PUT /raccomandate UPDATE data');
    log.info(req.user);
    log.info(req.body);
      
    /*
    if(req.body.action == 'updateConsegna') {
      log.info('updateConsegna');
      databaseModule.updateConsegnaAtti(req.body).then(function (response) {
        console.log('RaccomandateMgr atti consegna updated!');
        // emitterBus.eventBus.sendEvent('updateMessage', { sseId: 'MYSSEDID', msg: response});
        return res.status(200).send({action: 'updateConsegna', status: 'ok', data: response});
      }).catch(function (err) {
        console.log('##ERRORE## RaccomandateMgr updateConsegna');
        console.log(err);
        return res.status(405).send(err);
      });
    };
    */

    if(req.body.action == 'updateRaccomandata') {
      log.info('updateRaccomandata');
      databaseModule.updateRaccomandata(req.body).then(function (response) {
        console.log('RaccomandateMgr updateRaccomandata success!');
        emitterBus.eventBus.sendEvent('updateItemMessage', { msg: 'updateItem', newId: response.id});
        return res.status(200).send({action: 'updateRaccomandata', status: 'ok'});
      }).catch(function (err) {
        console.log('##ERRORE## RaccomandateMgr updateRaccomandata');
        console.log(err);
        return res.status(500).send(err);
      });
    };
    
    // return res.status(500).send({msg: 'action NOT found!'});

});



// ########################################################################################

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

    console.log(req.query.aDataPosta);
    console.log(moment(req.query.aDataPosta).format());
    console.log(moment(req.query.aDataPosta).utc().format());


    console.log(req.query.daDataPosta);
    console.log(moment(req.query.daDataPosta).format());
    console.log(moment(req.query.daDataPosta).utc().format());
    
    var options = {};
    options.aDataPosta = moment(req.query.aDataPosta).format();
    options.daDataPosta = moment(req.query.daDataPosta).format();

    console.log(options); 

    var key = {};
    async.series([
      function(callback) { 
          databaseModule.getPostaStatsCountItem(options)
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
          databaseModule.getPostaStatsCountCdc(options)
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
      function(callback) { 
          databaseModule.getPostaStatsCountMatricole(options)
         .then( function (result) {
                  // log.log2console(result);
                  key.StatsCountMatricole = result;
                  callback(null, result);
               })
         .catch(function (err) {
                  log.log2console(err);
                  callback(err, null);
                });
      }, //getPostaStatsCountTipi
      function(callback) { 
          databaseModule.getPostaStatsCountTipi(options)
         .then( function (result) {
                  // log.log2console(result);
                  key.StatsCountTipi = result;
                  callback(null, result);
               })
         .catch(function (err) {
                  log.log2console(err);
                  callback(err, null);
                });
      }
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