var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var utilityModule  = require('../models/utilityModule.js'); // load configuration data
var request = require('request');
var qs = require('querystring');
var path = require('path');
var passport = require('passport');
var fs = require('fs');
var saml2 = require('saml2-js');


// http://mherman.org/blog/2015/07/02/handling-user-authentication-with-the-mean-stack/#.WKxfkG_hBpg

LocalStrategy = require('passport-local').Strategy;
var SamlStrategy = require('passport-saml').Strategy;


var myCert = fs.readFileSync('./certs/saml.pem', 'utf-8');
var myCertStringFormat = fs.readFileSync('./certs/saml-string-format.crt', 'utf-8');
var myCertFull = fs.readFileSync('./certs/saml-full.pem', 'utf-8');

var samlStrategy = new SamlStrategy(
  {
    callbackUrl: 'https://pmlab.comune.rimini.it/simplesaml/module.php/saml/sp/saml2-acs.php/default-sp',
    entryPoint: 'https://federatest.lepida.it/gw/SSOProxy/SAML2',
    // entryPoint: 'https://idp.testshib.org/idp/profile/SAML2/POST/SSO',


    issuer: 'https://pmlab.comune.rimini.it/simplesaml',
    // Authentication requests sent by Passport-SAML can be signed using RSA-SHA1. To sign them you need to provide a private key in the PEM format via the privateCert configuration key. For example:
    privateCert: myCert,
    /* FEDERA
    cert: 'MIIDJDCCAgygAwIBAgIVAIq/MUgxPKO0cuX/GtD7YUvk87GtMA0GCSqGSIb3DQEBBQUAMBkxFzAVBgNVBAMTDmlkcC5tYWNoaW5lLml0MB4XDTA5MDMyNTEwNTM1OFoXDTI5MDMyNTA5NTM1OFowGTEXMBUGA1UEAxMOaWRwLm1hY2hpbmUuaXQwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQClXV18x0/yhZ+D3pHlmhrK4paA+xdJKAT7U7R9DeaTQygwtCjKmCrJbzdohckLz5pax7eaGeA53pPCY+JdiU0Uq4ES8nG2DCZgCtl4QGLUcTuUtJdPq+DbYD1cWBwEeeffsiClVyuhgLRPO1OQLl/TJp4slfoYTi0aONgQp03uG+ixL48myL7GrINHYXtDUDqo2BimyU0yrOe6ZmvxJchZ8nBuWKy0J8wsO/Mnasbvo79/c8gcn0HTst0QDlHXQlzwZ4Suq2os9qKjXAYOzA1VqmTyzJIge/ynHiJ0Fkw0HNxBaVFTJRNL8RvwJsMuBT7YZKRoNK7gjT5/6bGagYM/AgMBAAGjYzBhMEAGA1UdEQQ5MDeCDmlkcC5tYWNoaW5lLml0hiVodHRwczovL2lkcC5tYWNoaW5lLml0L2lkcC9zaGliYm9sZXRoMB0GA1UdDgQWBBSBOsPZiWZRXFqNINIguHfv7jnidDANBgkqhkiG9w0BAQUFAAOCAQEAeVLN9jczRINuPUvpXbgibL2c99dUReMcl47nSVtYeYEBkPPZrSz0h3AyVZyar2Vo+/fC3fRNmaOJvfiVSm+bo1069iROI1+dGGq2gAwWuQI1q0F7PNPX4zooY+LbZI0oUhuoyH81xed0WtMlpJ1aRSBMpR6oV3rguAkH6pdr725yv6m5WxKcOM/LzdD5Xt9fQRL7ino4HfiPPJNDG3UOKhoAWkVn/Y/CuMLcBPWh/3LxIv4A1bQbnkpdty+Qtwfp4QUKkisv7gufQP91aLqUvvRE6Uz8r51VH13e4mEJjJGxLKXWzlP50gp7b27AXCTKSS6fW6iBpfA14PGcWvDiPQ==',
    */

    cert: fs.readFileSync('./certs/federa-test.pem', 'utf-8'), 

    decryptionPvk: myCert,
    logoutCallbackUrl: 'https://pmlab.comune.rimini.it/simplesaml/logout',
    identifierFormat : 'urn:oasis:names:tc:SAML:2.0:nameid-format:transient',
    validateInResponseTo: true

    // additionalParams: {'RelayState' : 'passportSAML', 'myPar' : '1'}
    // skipRequestCompression: true

    /*
      authnContext: [
          'urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport',	// autenticazione tramite username e password
          // 'urn:oasis:names:tc:SAML:2.0:ac:classes:SecureRemotePassword',
          'urn:oasis:names:tc:SAML:2.0:ac:classes:Smartcard'			// autenticazione tramite smartcard
      ]
    */
    //privateCert: fs.readFileSync('./cert.pem', 'utf-8')
  },
  function(profile, done) {
      console.log("Authorization!!!! with", profile);
      return done(null, profile);
  });


passport.use(samlStrategy);
passport.serializeUser(function (user, done) {  done(null, user); });
passport.deserializeUser(function (user, done) {  done(null, user); });



//https://idp.ssocircle.com/sso/idpssoinit?metaAlias=%2Fpublicidp&spEntityID=PASSPORTSAMLSSOCIRCLE


// Passport authentication

module.exports = function(){


// PATCH compatibilità SimpleSaml chiamata dall'Idp al login callback
//router.post('/login/callback', function(req, res, next) { console.log('PassportAuth:/login/callback'); next(); },
router.post("/saml/sp/saml2-acs.php/default-sp", 
   function(req, res, next) { console.log('PassportAuth: PATCH /saml/sp/saml2-acs.php/default-sp'); next(); },
   passport.authenticate('saml', { failureRedirect: '/login/fail', failureFlash: true }),
  function(req, res) {
        console.log('root post /login/callback');
        console.log(req.user);
        console.log(req.body);
        console.log(req.body.RelayState);
        console.log('PassportAuth:/login/callback CREATE AUTH TOKEN');
        var token = utilityModule.createJWT(req.user);
        res.redirect('/simplesaml/cli/#!/landingSAML/' + token + '/' + req.body.RelayState);
  });


// login con SAML redirect verso la pagina Idp
router.get("/login/:RelayState", 
    function(req, res, next) {
      console.log('PassportAuth:/login');
      console.log(req.params);
      console.log('Setting RelayState');
      req.query.RelayState = req.params.RelayState;
      next();
    },
    passport.authenticate('saml',
      {
        successRedirect: '/',
        failureRedirect: '/login'
      })
);

router.get('/metadata',
    function(req, res) {
        console.log('PassportAuth:/login/callback ... ');
        res.type('application/xml');
        res.status(200).send(samlStrategy.generateServiceProviderMetadata(myCert));
        //res.status(200).send(fs.readFileSync('./metadata.xml'));
});

//PATCH per compatibilità registrazione PHP
router.get('/saml/sp/metadata.php/default-sp', function(req, res) {  
        console.log('PassportAuth: /saml/sp/metadata.php/default-sp');
        res.type('application/xml');
        res.status(200).send(samlStrategy.generateServiceProviderMetadata(myCertStringFormat));
        //res.status(200).send(fs.readFileSync('./metadata.xml'));
    }
);

// esegue il logout dal sistema
router.post('/logout',  utilityModule.ensureAuthenticated, function(req, res){
    console.log('PASSPORT:/logout ... ');
    console.log(req.csrfToken());
    req.logout();
    res.status(200).send({ token: '', status : 'Logged out!' });
});

// esegue il logout da FEDERA
router.get('/logout',  utilityModule.ensureAuthenticated, function(req, res){
    var logoutUrl = 'https://federatest.lepida.it/logout?spid=https%3A%2F%2Fpmlab.comune.rimini.it%2Fsimplesaml&spurl=NOMOVE';
    console.log('PASSPORT:/logout ... ', logoutUrl);
    var r = request.defaults({'proxy':'http://proxy1.comune.rimini.it:8080'});
    
    r.get(logoutUrl, function (error, response, body) {
      console.log('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      console.log('body:', body); // Print the HTML for the Google homepage.
      res.status(200).send({ token: '', status : 'Logged out!' });
    });

});

/*
https://federatest.lepida.it/logout?
spid=https%3A%2F%2Ffederatest.lepida.it%2Fidm%2Fmetadata&
spurl=NOMOVE
*/

/* SAML2 LOGIN ------------------------------------------------------------------------------------------------- */
/* SAML2 LOGIN ------------------------------------------------------------------------------------------------- */
/* SAML2 LOGIN ------------------------------------------------------------------------------------------------- */
/* SAML2 LOGIN ------------------------------------------------------------------------------------------------- */
/* SAML2 LOGIN ------------------------------------------------------------------------------------------------- */
/* SAML2 LOGIN ------------------------------------------------------------------------------------------------- */
/*
  var sp_options = {
    entity_id: "PMLAB-TEST-SAML2-JS-SPID",
    private_key: fs.readFileSync("./certs/saml.pem").toString(),
    certificate: fs.readFileSync("./certs/saml.crt").toString(),
    assert_endpoint: "https://sp.example.com/assert1",
    auth_context: { comparison: "exact", class_refs: ["urn:oasis:names:tc:SAML:1.0:am:password"] },
    nameid_format: "urn:oasis:names:tc:SAML:2.0:nameid-format:transient",
    sign_get_request: false,
    allow_unencrypted_assertion: true
  };

  var sp = new saml2.ServiceProvider(sp_options);

// Endpoint to retrieve metadata 
  router.get("/metadata2", function(req, res) {
    res.type('application/xml');
    res.send(sp.create_metadata());
  });

*/


	return router;
}

