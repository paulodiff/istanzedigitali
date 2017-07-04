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

// GET recupera i dati inseriti della posta
//  Necessita di alcuni filtri da sistemare
// 
router.get('/posta', utilityModule.ensureAuthenticated, function(req, res) {
    log.log2console('PostaMgr get /me : ');
    log.log2console(req.user);

    var key = req.user;  

    var options = {
      userid: req.user.userid,
      today : moment().format('YYYYMMDD')
    };

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

   databaseModule.updatePosta(req.body).then(function (response) {
      console.log('PostaMgr posta saved!');
      return res.status(200).send('ok');
    }).catch(function (err) {
      console.log(err)
      return res.status(500).send(err);
    });
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

  console.log('root post /login/callback');

  //req.user.uuidV4 = uuidV4();
    databaseModule.savePosta(req.body).then(function (response) {
      console.log('PostaMgr posta saved!');
      return res.status(200).send('ok');
    }).catch(function (err) {
      console.log(err)
      return res.status(500).send(err);
    });
});


// DELETE elimina righe inserite
router.delete(  '/posta/:posta_id', 
                utilityModule.ensureAuthenticated, 
                function(req, res) {
  log.log2console('PostaMgr DELETE !');
  log.log2console(req.user);
  log.log2console(req.params.posta_id);

  databaseModule.deletePosta(req.params.posta_id).then(function (response) {
      console.log('PostaMgr posta saved!');
      return res.status(200).send('ok');
    }).catch(function (err) {
      console.log(err)
      return res.status(500).send(err);
    });
});


/*
//PUT /api/me
router.put('/me', utilityModule.ensureAuthenticated, function(req, res) {
  User.findById(req.user, function(err, user) {
  	console.log('PostaMgr /me');
  	if(err) console.log(err);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    user.displayName = req.body.displayName || user.displayName;
    user.email = req.body.email || user.email;
    user.description = req.body.description || user.description;
    user.toDelete = req.body.toDelete || user.toDelete;
    user.save(function(err) {
      if(err) {
      	console.log(err);
      	return res.status(500).json({ message: 'Error updating user' });		
      } else {
      	return res.status(200).json({ message: 'User updated!' });
      }
    });
  });
});
*/


	return router;
}