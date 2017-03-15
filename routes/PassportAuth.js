var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var utilityModule  = require('../models/utilityModule.js'); // load configuration data
var request = require('request');
var qs = require('querystring');
var path = require('path');
var passport = require('passport');
var fs = require('fs');


// http://mherman.org/blog/2015/07/02/handling-user-authentication-with-the-mean-stack/#.WKxfkG_hBpg

LocalStrategy = require('passport-local').Strategy;
var SamlStrategy = require('passport-saml').Strategy;

/*
passport.use(new LocalStrategy(
  function(username, password, done) {

      console.log('PASSPORT checking local strategy ... ',username,password);
        var jsonFile = './data/users.json';
        var data = JSON.parse(fs.readFileSync(jsonFile));
        console.log(data[username]);
        if (data[username]){
            console.log(data[username].password);
            if (data[username].password == password) {
                return done(null, username);
            } 
        }
        return done(null, false, { message: 'Incorrect username or password.' });
      
  }
));
*/

var myCert = fs.readFileSync('./certs/saml.crt', 'utf-8');

var samlStrategy = new SamlStrategy(
  {
    callbackUrl: 'https://pmlab.comune.rimini.it/federa/passportAuth/login/callback',
    entryPoint:  'https://idp.ssocircle.com:443/sso/SSORedirect/metaAlias/ssocircle',
    // entryPoint: 'https://idp.testshib.org/idp/profile/SAML2/POST/SSO',

    // SSOCIRCLE

    issuer: 'PASSPORTSAMLSSOCIRCLE',
    // Authentication requests sent by Passport-SAML can be signed using RSA-SHA1. To sign them you need to provide a private key in the PEM format via the privateCert configuration key. For example:

    // privateCert: myCert,
    /* FEDERA
    cert: 'MIIDJDCCAgygAwIBAgIVAIq/MUgxPKO0cuX/GtD7YUvk87GtMA0GCSqGSIb3DQEBBQUAMBkxFzAVBgNVBAMTDmlkcC5tYWNoaW5lLml0MB4XDTA5MDMyNTEwNTM1OFoXDTI5MDMyNTA5NTM1OFowGTEXMBUGA1UEAxMOaWRwLm1hY2hpbmUuaXQwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQClXV18x0/yhZ+D3pHlmhrK4paA+xdJKAT7U7R9DeaTQygwtCjKmCrJbzdohckLz5pax7eaGeA53pPCY+JdiU0Uq4ES8nG2DCZgCtl4QGLUcTuUtJdPq+DbYD1cWBwEeeffsiClVyuhgLRPO1OQLl/TJp4slfoYTi0aONgQp03uG+ixL48myL7GrINHYXtDUDqo2BimyU0yrOe6ZmvxJchZ8nBuWKy0J8wsO/Mnasbvo79/c8gcn0HTst0QDlHXQlzwZ4Suq2os9qKjXAYOzA1VqmTyzJIge/ynHiJ0Fkw0HNxBaVFTJRNL8RvwJsMuBT7YZKRoNK7gjT5/6bGagYM/AgMBAAGjYzBhMEAGA1UdEQQ5MDeCDmlkcC5tYWNoaW5lLml0hiVodHRwczovL2lkcC5tYWNoaW5lLml0L2lkcC9zaGliYm9sZXRoMB0GA1UdDgQWBBSBOsPZiWZRXFqNINIguHfv7jnidDANBgkqhkiG9w0BAQUFAAOCAQEAeVLN9jczRINuPUvpXbgibL2c99dUReMcl47nSVtYeYEBkPPZrSz0h3AyVZyar2Vo+/fC3fRNmaOJvfiVSm+bo1069iROI1+dGGq2gAwWuQI1q0F7PNPX4zooY+LbZI0oUhuoyH81xed0WtMlpJ1aRSBMpR6oV3rguAkH6pdr725yv6m5WxKcOM/LzdD5Xt9fQRL7ino4HfiPPJNDG3UOKhoAWkVn/Y/CuMLcBPWh/3LxIv4A1bQbnkpdty+Qtwfp4QUKkisv7gufQP91aLqUvvRE6Uz8r51VH13e4mEJjJGxLKXWzlP50gp7b27AXCTKSS6fW6iBpfA14PGcWvDiPQ==',
    */

    // cert: fs.readFileSync('./certs/federa-test.pem', 'utf-8'),
    /*
    cert : 'MIIEYzCCAkugAwIBAgIDIAZmMA0GCSqGSIb3DQEBCwUAMC4xCzAJBgNVBAYTAkRFMRIwEAYDVQQKDAlTU09DaXJjbGUxCzAJBgNVBAMMAkNBMB4XDTE2MDgwMzE1MDMyM1oXDTI2MDMwNDE1MDMyM1owPTELMAkGA1UEBhMCREUxEjAQBgNVBAoTCVNTT0NpcmNsZTEaMBgGA1UEAxMRaWRwLnNzb2NpcmNsZS5jb20wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCAwWJyOYhYmWZF2TJvm1VyZccs3ZJ0TsNcoazr2pTWcY8WTRbIV9d06zYjngvWibyiylewGXcYONB106ZNUdNgrmFd5194Wsyx6bPvnjZEERny9LOfuwQaqDYeKhI6c+veXApnOfsY26u9Lqb9sga9JnCkUGRaoVrAVM3yfghv/Cg/QEg+I6SVES75tKdcLDTt/FwmAYDEBV8l52bcMDNF+JWtAuetI9/dWCBe9VTCasAr2Fxw1ZYTAiqGI9sW4kWS2ApedbqsgH3qqMlPA7tg9iKy8Yw/deEn0qQIx8GlVnQFpDgzG9k+jwBoebAYfGvMcO/BDXD2pbWTN+DvbURlAgMBAAGjezB5MAkGA1UdEwQCMAAwLAYJYIZIAYb4QgENBB8WHU9wZW5TU0wgR2VuZXJhdGVkIENlcnRpZmljYXRlMB0GA1UdDgQWBBQhAmCewE7aonAvyJfjImCRZDtccTAfBgNVHSMEGDAWgBTA1nEA+0za6ppLItkOX5yEp8cQaTANBgkqhkiG9w0BAQsFAAOCAgEAAhC5/WsF9ztJHgo+x9KV9bqVS0MmsgpG26yOAqFYwOSPmUuYmJmHgmKGjKrj1fdCINtzcBHFFBC1maGJ33lMk2bM2THx22/O93f4RFnFab7t23jRFcF0amQUOsDvltfJw7XCal8JdgPUg6TNC4Fy9XYv0OAHc3oDp3vl1Yj8/1qBg6Rc39kehmD5v8SKYmpE7yFKxDF1ol9DKDG/LvClSvnuVP0b4BWdBAA9aJSFtdNGgEvpEUqGkJ1osLVqCMvSYsUtHmapaX3hiM9RbX38jsSgsl44Rar5Ioc7KXOOZFGfEKyyUqucYpjWCOXJELAVAzp7XTvA2q55u31hO0w8Yx4uEQKlmxDuZmxpMz4EWARyjHSAuDKEW1RJvUr6+5uA9qeOKxLiKN1jo6eWAcl6Wr9MreXR9kFpS6kHllfdVSrJES4ST0uh1Jp4EYgmiyMmFCbUpKXifpsNWCLDenE3hllF0+q3wIdu+4P82RIM71n7qVgnDnK29wnLhHDat9rkC62CIbonpkVYmnReX0jze+7twRanJOMCJ+lFg16BDvBcG8u0n/wIDkHHitBI7bU1k6c6DydLQ+69h8SCo6sO9YuD+/3xAGKad4ImZ6vTwlB4zDCpu6YgQWocWRXE+VkOb+RBfvP755PUaLfL63AFVlpOnEpIio5++UjNJRuPuAA=',
    */


    // decryptionPvk: myCert,
    logoutUrl: 'https://pmlab.comune.rimini.it/federa/passportAuth/logout',
    logoutCallbackUrl: 'https://idp.ssocircle.com:443/sso/IDPSloRedirect/metaAlias/ssocircle',

    identifierFormat : 'urn:oasis:names:tc:SAML:2.0:nameid-format:transient',
    validateInResponseTo: true,
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
      console.log("PassportAuth with:", profile);
      return done(null, profile);

      /*
    findByEmail(profile.email, function(err, user) {
      if (err) {
          console.log(err);
        return done(err);
      }
     if (!user) {
          // "Auto-registration"
          users.push(profile);
          return done(null, profile);
        }
        return done(null, user);
    });

    */

  });

passport.use(samlStrategy);
passport.serializeUser(function (user, done) {  done(null, user); });
passport.deserializeUser(function (user, done) {  done(null, user); });



//https://idp.ssocircle.com/sso/idpssoinit?metaAlias=%2Fpublicidp&spEntityID=PASSPORTSAMLSSOCIRCLE


// Passport authentication

module.exports = function(){


router.post('/login/callback', function(req, res, next) { console.log('PassportAuth:/login/callback'); next(); },
  passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
  function(req, res) {
    console.log(req.user);
    console.log('PassportAuth:/login/callback CREATE AUTH TOKEN');
    var token = utilityModule.createJWT(req.user);
    res.redirect('/federa/cli/#!/landingSAML/' + token);
});


router.get('/login', function(req, res, next) { console.log('PassportAuth:/login'); next(); },
  passport.authenticate('saml'),  
  function(err, user, info) {
    console.log('PassportAuth:/login  _ PASS');
    console.log(err);
    console.log(req);
    console.log(info);
    res.redirect('/');
  });

router.get('/landingSAML',
function(req, res) {
    console.log(req.user);
    console.log('JWT?????');
    res.redirect('/federa/cli/#!/landingSAML/46544asdgjòtigjòsdtigjòsdtilgjsòdtgijsòldtgijsòldtigjslgsijdtg');
});

router.get('/metadata',
    function(req, res) {
        console.log('PassportAuth:/login/callback ... ');
        res.type('application/xml');
        res.status(200).send(samlStrategy.generateServiceProviderMetadata(myCert));
        //res.status(200).send(fs.readFileSync('./metadata.xml'));
});


// esegue una chiamata alla strategy "local" con req.logIn e se ok invia un token JWT

router.post('/LOCALlogin', function(req, res, next) {

  console.log('PASSPORT:/login ... ');
  passport.authenticate('local', function(err, user, info) {

    if (err) {
        console.log('PASSPORT:/login',err);
      return next(err);
    }
    if (!user) {
        console.log('PASSPORT:/login NOT USER');
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({  err: 'Could not log in user'  });
      }
      console.log(user);
      res.status(200).send({ token: utilityModule.createJWT(user), status : 'Login succesful!' });
      // res.status(200).json({ status: 'Login successful!'   });
    });
  })(req, res, next);
});


// esegue il logout dal sistema
router.post('/logout',  utilityModule.ensureAuthenticated, function(req, res){
    console.log('PASSPORT:/logout ... ');
    console.log(req.csrfToken());
    req.logout();
    res.status(200).send({ token: '', status : 'Logged out!' });
});


	return router;
}

