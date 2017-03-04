var express = require('express');
var app = express();

var passport = require('passport');
var fs = require('fs');
//var Strategy = require('passport-local').Strategy;
var SamlStrategy = require('passport-saml').Strategy;
var db = require('./db');

var uuid = require('node-uuid');


// The X-Frame-Options HTTP header restricts who can put your site in a frame which can help mitigate things like clickjacking 
var frameguard = require('frameguard');
// Help secure Express apps with various HTTP headers https://helmetjs.github.io/
var helmet = require('helmet');
app.use(helmet.xssFilter({ setOnOldIE: true }));
app.use(frameguard({ action: 'deny' }));
app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }));
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());

// CORS is a node.js package for providing a Connect/Express middleware 
// that can be used to enable CORS with various options.
var cors         = require('cors');
app.use(cors());

// logger http to console.
var morgan       = require('morgan');
app.use(morgan('dev'));


// Parse incoming request bodies in a middleware before your handlers, 
// available under the req.body property
var bodyParser   = require('body-parser');
var jsonParser = bodyParser.json({
                              limit:1024*1024*35, 
                              type:'application/json'
                            });
var urlencodedParser = bodyParser.urlencoded({ 
                              extended:true,
                              limit:1024*1024*35,
                              type:'application/x-www-form-urlencoding' 
                            });

app.use(bodyParser.json({
  type: ['json', 'application/csp-report'],
  limit: 1024 //50mb
}));

app.use(bodyParser.urlencoded({ 
  limit:1024, 
  extended: true 
}));

// Parse Cookie header and populate req.cookies 
// with an object keyed by the cookie names. 
// Optionally you may enable signed cookie support by passing a secret 
// string, which assigns req.secret so it may be used by other middleware.
var cookieParser = require('cookie-parser');
app.use(cookieParser('secretPassword'));

/* START ------------- CSRF security --------------------------- */
/* all routes after this point are secured!   ------------------- */
// CSRF security

var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });
app.use(csrf({ cookie: true }))
// error handler CSRF

app.use(function (err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);

  return next();
  
  // handle CSRF token errors here
  // res.status(403)
  // res.send('CSRF: ERROR!');
})




// load configuration data
var ENV   = require('./config.js'); // load configuration data


var myCert = fs.readFileSync('./certs/saml.crt', 'utf-8');

var samlStrategy = new SamlStrategy(
  {
    callbackUrl: 'https://pmlab.comune.rimini.it/federa/login/callback',
    entryPoint: 'https://federatest.lepida.it/gw/SSOProxy/SAML2',
    // entryPoint: 'https://idp.testshib.org/idp/profile/SAML2/POST/SSO',

    // ---- FOR Shibboleth START
    // identifierFormat: null, 
    // validateInResponseTo: false,
    // disableRequestedAuthnContext: true,
    // ----- FOR Shibboleth END



    issuer: 'https://pmlab.comune.rimini.it/federa',
    // Authentication requests sent by Passport-SAML can be signed using RSA-SHA1. To sign them you need to provide a private key in the PEM format via the privateCert configuration key. For example:
    privateCert: myCert,
    /* FEDERA
    cert: 'MIIDJDCCAgygAwIBAgIVAIq/MUgxPKO0cuX/GtD7YUvk87GtMA0GCSqGSIb3DQEBBQUAMBkxFzAVBgNVBAMTDmlkcC5tYWNoaW5lLml0MB4XDTA5MDMyNTEwNTM1OFoXDTI5MDMyNTA5NTM1OFowGTEXMBUGA1UEAxMOaWRwLm1hY2hpbmUuaXQwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQClXV18x0/yhZ+D3pHlmhrK4paA+xdJKAT7U7R9DeaTQygwtCjKmCrJbzdohckLz5pax7eaGeA53pPCY+JdiU0Uq4ES8nG2DCZgCtl4QGLUcTuUtJdPq+DbYD1cWBwEeeffsiClVyuhgLRPO1OQLl/TJp4slfoYTi0aONgQp03uG+ixL48myL7GrINHYXtDUDqo2BimyU0yrOe6ZmvxJchZ8nBuWKy0J8wsO/Mnasbvo79/c8gcn0HTst0QDlHXQlzwZ4Suq2os9qKjXAYOzA1VqmTyzJIge/ynHiJ0Fkw0HNxBaVFTJRNL8RvwJsMuBT7YZKRoNK7gjT5/6bGagYM/AgMBAAGjYzBhMEAGA1UdEQQ5MDeCDmlkcC5tYWNoaW5lLml0hiVodHRwczovL2lkcC5tYWNoaW5lLml0L2lkcC9zaGliYm9sZXRoMB0GA1UdDgQWBBSBOsPZiWZRXFqNINIguHfv7jnidDANBgkqhkiG9w0BAQUFAAOCAQEAeVLN9jczRINuPUvpXbgibL2c99dUReMcl47nSVtYeYEBkPPZrSz0h3AyVZyar2Vo+/fC3fRNmaOJvfiVSm+bo1069iROI1+dGGq2gAwWuQI1q0F7PNPX4zooY+LbZI0oUhuoyH81xed0WtMlpJ1aRSBMpR6oV3rguAkH6pdr725yv6m5WxKcOM/LzdD5Xt9fQRL7ino4HfiPPJNDG3UOKhoAWkVn/Y/CuMLcBPWh/3LxIv4A1bQbnkpdty+Qtwfp4QUKkisv7gufQP91aLqUvvRE6Uz8r51VH13e4mEJjJGxLKXWzlP50gp7b27AXCTKSS6fW6iBpfA14PGcWvDiPQ==',
    */

    cert: fs.readFileSync('./certs/federa-test.pem', 'utf-8'), 

    decryptionPvk: myCert,
    logoutCallbackUrl: 'https://pmlab.comune.rimini.it/federa/logout',
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
      console.log("Auth with", profile);
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
  });

passport.use(samlStrategy);

/*
passport.use(new Strategy(
  function(username, password, cb) {
    db.users.findByUsername(username, function(err, user) {
      if (err) {
          console.log('ERRORE');
          console.log(err); 
          return cb(err); 
        }
      if (!user) {
            console.log('USER NOT FOUND');
          return cb(null, false); 
        }
      if (user.password != password) { 
            console.log('USER PASSWORD ERROR');    
            return  cb(null, false); 
        
       }

      console.log('FOUND');
      return cb(null, user);
    });
  }));
*/

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.

/*
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});
*/

passport.serializeUser(function(user, done){
    done(null, user);
});

passport.deserializeUser(function(user, done){
    done(null, user);
});



// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

// Initialize Passport and restore authentication state, if any, from the
// session.

app.use(passport.initialize());
app.use(passport.session());

var log = require('./models/loggerModule.js');
log.log2console('Starting ...');

var PassportAuth = require('./routes/PassportAuth')();
app.use('/passportauth', PassportAuth);

var ProfileMgr = require('./routes/ProfileMgr')();
app.use('/profilemgr', ProfileMgr);

var Protocollo = require('./routes/Protocollo')();
app.use('/segnalazioni', Protocollo);

// Define routes.
app.get('/',
  function(req, res) {
    res.render('login');
	  //res.redirect('home/');
});

 app.get('/login',
    passport.authenticate('saml',
      {
        successRedirect: '/',
        failureRedirect: '/login'
      })
  );

app.post('/login',
  passport.authenticate('saml', { failureRedirect: '/login/fail', failureFlash: true }),
  function(req, res) {
      console.log('get /login');
        res.redirect('/profile');
        }
);

app.get('/metadata', 
    function(req, res) {
        console.log('/metadata');
        res.type('application/xml');
        res.status(200).send(samlStrategy.generateServiceProviderMetadata(myCert));
        //res.status(200).send(fs.readFileSync('./metadata.xml'));
    }
);

app.get('/login',
  passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
  function(req, res) {
      console.log('get /login');
        res.redirect('/profile');
        }
);
  
app.post('/login/callback',
   passport.authenticate('saml', { failureRedirect: '/login/fail', failureFlash: true }),
  function(req, res) {
        console.log('POST o/login/callback');
        console.log(req.user);
        res.redirect('/profile');
  });

app.get('/login/fail', 
    function(req, res) {
        console.log('/login/fail');
        res.send(401, 'Login failed');
    }
);  

app.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('profile', { user: req.user });
  });

app.use('/home', express.static(__dirname + '/home'));
app.use('/cli', express.static(__dirname + '/client'));
app.use('/dist', express.static(__dirname + '/client/dist'));

log.log2console('Server started at:' + ENV.nodejs.NODEJSport);
log.log2file('Server started at:' + ENV.nodejs.NODEJSport);
app.listen(ENV.nodejs.NODEJSport);