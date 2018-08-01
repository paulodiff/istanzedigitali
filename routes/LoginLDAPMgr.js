var express = require('express');
var router = express.Router();
// var ENV   = require('../config/config.js'); // load configuration data
var ENV   = require('../config/config-RACCOMANDATE.js'); // load configuration data
var utilityModule  = require('../models/utilityModule.js'); // load configuration data
var databaseModule = require("../models/databaseModuleRaccomandate.js");
var models = require("../modelsSequelizeRaccomandate");
var emitterBus = require("../models/emitterModule.js");
var fs = require('fs');
var LdapAuth = require('ldapauth-fork');
var async = require('async');
var _ = require('underscore');

var log4js = require('log4js');
log4js.configure(ENV.log4jsConfig);
var log = log4js.getLogger("LoginLDAPMgr");

module.exports = function(){


// Log in with LDAP

router.post('/LDAPlogin', function(req, res) {
  
  console.log('/LDAPlogin');
  console.log(req.body);

  var username = req.body.username;
  var password = req.body.password;
  var config = { ldap: ENV.ldap };
  var bindDn = "cn=" + username + "," + config.ldap.bindDn;

  //console.log(config);

  console.log(bindDn);

  var ldap = new LdapAuth({
    url: config.ldap.url,
    bindDn: bindDn,
    bindCredentials: password,
    searchBase: config.ldap.searchBase,
    searchFilter: config.ldap.searchFilter,
    //log4js: require('log4js'),
    cache: true
  });

  // percorso di autenticazione

  var userLogin = {};

  async.waterfall([

    function(callback){
        console.log('LdapAuth:ldap');

        ldap.authenticate(username, password, function (err, user) {
            console.log('LDAP:', username, password);
            if (err) {
              console.log('LDAP: authentication error:');
              console.log(err);
              log.info('LDAP: authentication error:', username, password);
              // log su database login error
              callback({msg: 'Utente o password non validi'}, null);
            } else {
                userLogin = { 
                    'issuer' : 'LDAP',
                    'userid' : user.name,
                    'name' : user.name,
                    'displayName' : user.displayName,
                    'userEmail' : user.mail,
                    'isAdmin': false
                };
                callback(null, userLogin);
            }
        });
    },

    function(item, callback){
        console.log('LdapAuth:ricerca profilo');
        console.log(item);
        models.Utenti.findAndCountAll({ 
            where: { 
                utente_matricola:  userLogin.name
            }
        }).then(function(result) {
            console.log(result.count);
            console.log(result.rows);
            if (result.count !== 1) {
                log.info('Utente senza profilo!');
                callback({msg: 'Utente senza profilo!'}, null);
            } else {
                callback(null, result.rows[0]);
            }
        }).catch(function(error) { 
            callback(error, null);
        });
    },

    function(item, callback) {
        console.log('LDAP: closing connection ..');  
        ldap.close(function(error) { 
            if(error){
                console.log(error);  
                log.info('Errore chisura connessione ldap');
            } else {
                console.log('LDAP: closed ok!');  
                callback(null, 'LDAP: closed ok!');
            }
        });

    }

    ],function(err, results) {
        // results is now equal to: {one: 1, two: 2}
        console.log('LdapAuth:Final');
        console.log(results);
     
        // res.status(401).json({success: false, data:err });

        // login to database

        if(err){
            console.log('LdapAuth:Final:ERROR!');
            console.log(err);
            ldap.close(function(error) { console.log('LdapAuth:ldap closed!');  if(error){  console.log(error);  }  });
            log.error(err);
            res.status(401).json({success: false, data:err });
            // reject(err); 
            // res.status(500).send(err);
        } else {
            var token = utilityModule.createJWT(userLogin);
            log.info('AuthOk',userLogin);
            console.log('LdapAuth:Final:SUCCESS!');
            res.status(200).json({
                success: true,
                id_utenti : username,
                nome_breve_utenti : username,
                isadmin_utenti : 0,
                userData: userLogin,
                token: token
            });
        }
    });
  
});


// LDAPlogout

router.get('/LDAPlogout', function(req,res){
	console.log('LDAPlogout');
  res.status(200).json({});
});


	return router;
}