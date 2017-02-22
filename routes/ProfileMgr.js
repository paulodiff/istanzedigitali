var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var ENV   = require('../config.js'); // load configuration data
var User  = require('../models/user.js'); // load configuration data
var utilityModule  = require('../models/utilityModule.js'); // load configuration data

module.exports = function(){

// GET /api/me
router.get('/me', utilityModule.ensureAuthenticated, function(req, res) {
  console.log('get /me');
  User.findById(req.user, function(err, user) {
  	if(err){
  		console.log(err);
      	return res.status(500).send({ message: 'Error retrieving user' });		
	}
    return res.status(200).send(user);
  });
});

//PUT /api/me
router.put('/me', utilityModule.ensureAuthenticated, function(req, res) {
  User.findById(req.user, function(err, user) {
  	console.log('put /me');
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



	return router;
}