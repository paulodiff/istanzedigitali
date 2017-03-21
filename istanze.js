var express = require('express');
var app = express();

var passport = require('passport');
var fs = require('fs');
//var Strategy = require('passport-local').Strategy;
//var SamlStrategy = require('passport-saml').Strategy;
// var db = require('./db');
var saml2 = require('saml2-js');


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
var cors  = require('cors');
app.use(cors({
      origin: 'https://idp.ssocircle.com',
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
  }));
 
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
  limit: '50mb'
}));

app.use(bodyParser.urlencoded({ 
  limit: '50mb', 
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

/*
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

    cert: fs.readFileSync('./certs/federa-test.pem', 'utf-8'), 

    decryptionPvk: myCert,
    logoutCallbackUrl: 'https://pmlab.comune.rimini.it/simplesaml/logout',
    identifierFormat : 'urn:oasis:names:tc:SAML:2.0:nameid-format:transient',
    validateInResponseTo: true

    // additionalParams: {'RelayState' : 'passportSAML', 'myPar' : '1'}
    // skipRequestCompression: true

    //
    //  authnContext: [
    //      'urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport',	// autenticazione tramite username e password
    //      // 'urn:oasis:names:tc:SAML:2.0:ac:classes:SecureRemotePassword',
    //      'urn:oasis:names:tc:SAML:2.0:ac:classes:Smartcard'			// autenticazione tramite smartcard
    //  ]
    
    // privateCert: fs.readFileSync('./cert.pem', 'utf-8')
  },
  function(profile, done) {
      console.log("Authorization!!!! with", profile);
      return done(null, profile);
  });

  passport.use(samlStrategy);
*/

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.


// passport.serializeUser(function(user, done){    done(null, user); });
// passport.deserializeUser(function(user, done){     done(null, user); });

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
app.use('/module.php', PassportAuth);

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


/*
app.get("/FEDERAlogin", 
    function(req, res, next) {
      console.log('Setting RelayState');
      req.query.RelayState = 'TOKEN123454566';
      next();
    },
    passport.authenticate('saml',
      {
        successRedirect: '/',
        failureRedirect: '/login'
      })
);

app.get('/module.php/saml/sp/metadata.php/default-sp', function(req, res) {  
        console.log('/metadata');
        res.type('application/xml');
        res.status(200).send(samlStrategy.generateServiceProviderMetadata(myCertStringFormat));
        //res.status(200).send(fs.readFileSync('./metadata.xml'));
    }
);

  
app.post("/module.php/saml/sp/saml2-acs.php/default-sp", 
   passport.authenticate('saml', { failureRedirect: '/login/fail', failureFlash: true }),
  function(req, res) {
        console.log('root post /login/callback');
        console.log(req.user);
        res.render('home', { user: req.user} );
  });
*/


// ##################################################################################
// express-saml2 --------------------------------------------------------------- TEST 

// var saml = require('express-saml2');



// FAKE SIMPLESAMLPHP -------------------------------------------------------------------- SIMPLESAMLPHP
// FAKE SIMPLESAMLPHP -------------------------------------------------------------------- SIMPLESAMLPHP
// FAKE SIMPLESAMLPHP -------------------------------------------------------------------- SIMPLESAMLPHP
// FAKE SIMPLESAMLPHP -------------------------------------------------------------------- SIMPLESAMLPHP

/***


  var sp_options = {
      entity_id: "https://pmlab.comune.rimini.it/simplesaml",
      private_key: fs.readFileSync("./certs/saml.pem").toString(),
      certificate: fs.readFileSync("./certs/saml.crt").toString(),
      assert_endpoint: "https://pmlab.comune.rimini.it/simplesaml/module.php/saml/sp/saml2-acs.php/default-sp",
      single_logout_service: "https://pmlab.comune.rimini.it/simplesaml/module.php/saml/sp/saml2-logout.php/default-sp",
      auth_context: { class_refs: ["urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport","urn:oasis:names:tc:SAML:2.0:ac:classes:Smartcard"] },
      nameid_format: "urn:oasis:names:tc:SAML:2.0:nameid-format:transient",
      sign_get_request: false,
      relay_state: 'SAML2JS',
      sign_get_request: true,
      allow_unencrypted_assertion: true
  };
       
      
  var sp = new saml2.ServiceProvider(sp_options);

  // Create identity provider 
  var idp_options = {
    sso_login_url: 'https://federatest.lepida.it/gw/SSOProxy/SAML2',
    sso_logout_url: 'https://federatest.lepida.it/gw/SSOProxy/SAML2',
    relay_state: 'SAML2JS',
    certificates: [fs.readFileSync("./certs/federa-test.pem").toString()]
  };
  var idp = new saml2.IdentityProvider(idp_options);


  app.get('/module.php/saml/sp/metadata.php/default-sp', function(req, res) {
      res.type('application/xml');
      res.send(sp.create_metadata());
      //res.status(200).send(fs.readFileSync('./metadata.xml'));
  });


  app.get("/FEDERAlogin", function(req, res) {
    sp.create_login_request_url(idp, {relay_state: 'SAML2JS'}, function(err, login_url, request_id) {
      if (err != null)
        return res.send(500);
      res.redirect(login_url);
    });
  });

      
  // Assert endpoint for when login completes 
  app.post("/module.php/saml/sp/saml2-acs.php/default-sp", function(req, res) {
    console.log("ASSERT POST.....................");
    var options = {request_body: req.body};
    sp.post_assert(idp, options, function(err, saml_response) {

      console.log(saml_response);

      if (err != null) {
        console.log(err);
        return res.send(500);
      }
  
      

      // Save name_id and session_index for logout 
      // Note:  In practice these should be saved in the user session, not globally. 
      name_id = saml_response.user.name_id;
      session_index = saml_response.user.session_index;
  
      res.send("Hello #{saml_response.user.name_id}!");
    });
  });

  // Starting point for logout 
  app.get("/module.php/saml/sp/saml2-logout.php/default-sp", function(req, res) {
  var options = {
    name_id: name_id,
    session_index: session_index
  };
 
  sp.create_logout_request_url(idp, options, function(err, logout_url) {
    if (err != null)
      return res.send(500);
    res.redirect(logout_url);
  });
});

****/

// FAKE SIMPLESAMLPHP -------------------------------------------------------------------- SIMPLESAMLPHP
// FAKE SIMPLESAMLPHP -------------------------------------------------------------------- SIMPLESAMLPHP
// FAKE SIMPLESAMLPHP -------------------------------------------------------------------- SIMPLESAMLPHP
// FAKE SIMPLESAMLPHP -------------------------------------------------------------------- SIMPLESAMLPHP


app.use('/home', express.static(__dirname + '/home'));

var options = {
  // dotfiles: 'ignore',
  // etag: false,
  // extensions: ['htm', 'html'],
  // index: false,
  // maxAge: '1d',
  // redirect: false,
  setHeaders: function (res, path, stat) {
    //console.log(path);
    //console.log(stat);
    //console.log(res);
    res.set('x-timestamp', Date.now());
    res.set('Access-Control-Allow-Origin', 'https://idp.ssocircle.com');
    res.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE');
    res.set('Access-Control-Max-Age', '3600');
    res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  }
}

app.use('/cli',  express.static(__dirname + '/client', options));
app.use('/dist', express.static(__dirname + '/client/dist', options));

log.log2console('Server started at:' + ENV.nodejs.NODEJSport);
log.log2file('Server started at:' + ENV.nodejs.NODEJSport);
app.listen(ENV.nodejs.NODEJSport);
