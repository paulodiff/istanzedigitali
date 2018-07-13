/*
  Modulo gestione dei profili
*/ 

var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var fs = require('fs');
var ENV   = require('../config/config.js'); // load configuration data
// var User  = require('../models/user.js'); // load configuration data
var utilityModule  = require('../models/utilityModule.js'); // load configuration data

// var log = require('../models/loggerModule.js');

var log4js = require('log4js');
log4js.configure(ENV.log4jsConfig);
var log = log4js.getLogger("app");

var async = require('async');
var databaseModule = require("../models/databaseModule.js");


module.exports = function(){

// GET /api/me
router.get('/me', utilityModule.ensureAuthenticated, function(req, res) {
    log.info('ProfileMgr get /me : ');
    log.info(req.user);

    var key = req.user;  


    async.series([
      function(callback) { 
          databaseModule.getAuthList(req.user.userid)
         .then( function (result) {
                  // log.info(result);
                  key.AuthEvents = result;
                  callback(null, result);
               })
         .catch(function (err) {
                  log.info(err);
                  callback(err, null);
                });
      },
      function(callback) { 
          databaseModule.getIstanzeList(req.user.userid)
         .then( function (result) {
                  // log.info(result);
                  key.Istanze = result;
                  callback(null, result);
               })
         .catch(function (err) {
                  log.info(err);
                  callback(err, null);
                });
      },
    ],function(err, results) {
        // results is now equal to: {one: 1, two: 2}
        log.info('ASYNC -- FINAL!:');
        if(err){
            log.info(err);
            res.status(500).send(err);
        } else {
            //log.info(results);

            if(req.user.isAdmin){
              key.dbInfo = {
                 MYSQLdatabase : ENV.mysql_sequelize.MYSQLdatabase,
                 MYSQLhost : ENV.mysql_sequelize.MYSQLhost,
              }
            } else {
              key.dbInfo = 'no info for non admin user'
            }

            return res.status(200).send(key);
        }
    });
  
    
 

    // caricamento delle istanze presentate


    // var jsonFile = './data/profiles/profiles.json';
    // var data = JSON.parse(fs.readFileSync(jsonFile)); 

    // log.info(data);

    // if (data[key]) {
    //  return res.status(200).send(data[key]);
    // } else {
    //   return res.status(200).send(data['default']);
    // }
    
});


router.put('/me', utilityModule.ensureAuthenticated, function(req, res) {
  log.info('ProfileMgr PUT /me');
  log.info(req.user);
  log.info(req.data);
  try {
    log.info('ProfileMgr PUT /me SAVED!');
  } catch (err){
    console.log(err);
  }
  return res.status(200).send('ok');
});

router.post('/me', utilityModule.ensureAuthenticated, function(req, res) {
  log.info('ProfileMgr POST /me');
  try {
    log.info('ProfileMgr POST /me SAVED!');
  } catch (err){
    console.log(err);
  }
  return res.status(200).send('ok');
});


/*
//PUT /api/me
router.put('/me', utilityModule.ensureAuthenticated, function(req, res) {
  User.findById(req.user, function(err, user) {
  	console.log('ProfileMgr /me');
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