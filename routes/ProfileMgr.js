var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var fs = require('fs');
var ENV   = require('../config.js'); // load configuration data
// var User  = require('../models/user.js'); // load configuration data
var utilityModule  = require('../models/utilityModule.js'); // load configuration data
var log = require('../models/loggerModule.js');


module.exports = function(){

// GET /api/me
router.get('/me/:id', utilityModule.ensureAuthenticated, function(req, res) {
    log.log2console('ProfileMgr get /me : '+ req.params.id);
    //console.log(profiles.data);

    if (req.params.id) {
      profileFileName = req.params.id;  
    } else {
      profileFileName = 'default';
    }

    //var DW_PATH = ENV_PROT.storageFolder;
    //var dir = DW_PATH + "/" + reqId;
    dir = './data/profiles/';
    var jsonFile = dir + profileFileName + '.json';
    var contents;

    if (fs.existsSync(jsonFile)) {
      log.log2console('ProfileMgr reading : '+ jsonFile);
      contents = fs.readFileSync(jsonFile);
    } else {
      log.log2console('ProfileMgr reading : default');
      contents = fs.readFileSync( dir + 'default.json');
    }

    var data =  JSON.parse(contents);
    log.log2console(data);
  
    return res.status(200).send(data);
});


router.put('/me', utilityModule.ensureAuthenticated, function(req, res) {
  log.log2console('ProfileMgr PUT /me');
  try {
    var profiles = db.addCollection('profiles');
    profiles.insert({id: 200, name:'Mario', age: 88});
    log.log2console('ProfileMgr POST /me SAVED!');
  } catch (err){
    console.log(err);
  }
  return res.status(200).send('ok');
});

router.post('/me', utilityModule.ensureAuthenticated, function(req, res) {
  log.log2console('ProfileMgr POST /me');
  try {
    var profiles = db.addCollection('profiles');
    profiles.insert({id: 200, name:'Mario', age: 88});
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