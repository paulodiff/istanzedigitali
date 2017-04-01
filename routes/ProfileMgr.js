var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var fs = require('fs');
var ENV   = require('../config.js'); // load configuration data
// var User  = require('../models/user.js'); // load configuration data
var utilityModule  = require('../models/utilityModule.js'); // load configuration data
var log = require('../models/loggerModule.js');
var models = require("../modelsSequelize");


module.exports = function(){

// GET /api/me
router.get('/me', utilityModule.ensureAuthenticated, function(req, res) {
    log.log2console('ProfileMgr get /me : ');
    log.log2console(req.user);

    var key = req.user;  

    // caricamento lista eventi di autenticazione
    models.SpidLog.findAll({
      where: {
        userid : req.user.userid
      }
    }).then(function(taskList) {
        key.AuthEvents = taskList;
        log.log2console(key);

        return res.status(200).send(key);
    });



    // var jsonFile = './data/profiles/profiles.json';
    // var data = JSON.parse(fs.readFileSync(jsonFile)); 

    // log.log2console(data);

    // if (data[key]) {
    //  return res.status(200).send(data[key]);
    // } else {
    //   return res.status(200).send(data['default']);
    // }
    
});


router.put('/me', utilityModule.ensureAuthenticated, function(req, res) {
  log.log2console('ProfileMgr PUT /me');
  log.log2console(req.user);
  log.log2console(req.data);
  try {
    log.log2console('ProfileMgr PUT /me SAVED!');
  } catch (err){
    console.log(err);
  }
  return res.status(200).send('ok');
});

router.post('/me', utilityModule.ensureAuthenticated, function(req, res) {
  log.log2console('ProfileMgr POST /me');
  try {
    log.log2console('ProfileMgr POST /me SAVED!');
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