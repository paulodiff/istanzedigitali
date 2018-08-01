// log test!!!
// require('longjohn');

// var express = require('express');
// var app = express();
// var server = require('http').Server(app);
// var io = require('socket.io')(server);

var http = require('http');
var express = require('express'),
    app = module.exports.app = express();

var server = http.createServer(app);
var io = require('socket.io').listen(server);  //pass a http.Server instance
module.exports.io = io; 

// set up our socket server
require('./models/socketModule')(io);

// server.listen(80);  //listen on port 80

// var passport = require('passport');
var fs = require('fs');
//var Strategy = require('passport-local').Strategy;
//var SamlStrategy = require('passport-saml').Strategy;
// var db = require('./db');
// var saml2 = require('saml2-js');


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
// var cors  = require('cors');
//app.use(cors({
//      origin: 'https://idp.ssocircle.com',
//      methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
//  }));
 
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
var ENV   = require('./config/config-RACCOMANDATE.js'); // load configuration data

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

// app.use(passport.initialize());
// app.use(passport.session());



// var PassportAuth = require('./routes/PassportAuth')();
// app.use('/passportauth', PassportAuth);
// app.use('/module.php', PassportAuth);


// var Protocollo = require('./routes/Protocollo')();
// app.use('/segnalazioni', Protocollo);

// var IstanzeMgr = require('./routes/IstanzeMgr')();
// app.use('/istanzemgr', IstanzeMgr);

// var GatewayProtocollo = require('./routes/GatewayProtocollo')();
// app.use('/gatewayprotocollo', GatewayProtocollo);

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
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE');
    res.set('Access-Control-Max-Age', '3600');
    res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  }
}


app.use(function(req, res, next) {
  console.log('ROOT: CORS management ...');

  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  //intercepts OPTIONS method
  if ('OPTIONS' === req.method) {
    //respond with 200
    console.log('ROOT: CORS management OPTIONS patch ok!');
    res.sendStatus(200);
  }
  else {
  //move on
  console.log('ROOT: CORS management NEXT');
    next();
  }
});



var log4js = require('log4js');
log4js.configure(ENV.log4jsConfig);
var log = log4js.getLogger("raccomandate");

var RaccomandateMgr = require('./routes/RaccomandateMgr')();
app.use('/raccomandatemgr', RaccomandateMgr);

// var Sse = require('./routes/SseMgr')();
// app.use('/sse', Sse);


/*
var PostaMgr = require('./routes/PostaMgr')();
app.use('/postamgr', PostaMgr);

var ProfileMgr = require('./routes/ProfileMgr')();
app.use('/profilemgr', ProfileMgr);

*/

var LoginLDAPMgr = require('./routes/LoginLDAPMgr')();
app.use('/loginldap', LoginLDAPMgr);


// Define routes.

/*
app.get('/',
  function(req, res) {
    res.render('login');
	  //res.redirect('home/');
});
*/



// app.use('/swagger', express.static(__dirname + '/swagger'));
// app.use('/home', express.static(__dirname + '/home'));


app.use('/cli',  express.static(__dirname + '/client-raccomandate', options));
// app.use('/draw',  express.static(__dirname + '/draw.io', options));
// app.use('/dist', express.static(__dirname + '/client/dist', options));

// Sequelize START Bootstrap
var models = require("./modelsSequelizeRaccomandate");

log.info('Sequelize START');

// log.info('Server started at:' + ENV.nodejs.NODEJSport);
// log.info('Server started at:' + ENV.nodejs.NODEJSport);
// app.listen(ENV.nodejs.NODEJSport);


models.sequelize.sync().then(function() {
  // models.rAtti.sync({f11orce:true});
  // models.logSequelize.sync({11force:true});
  // models.AttiConsegnatari.sync({11force:true});
  /**
   * Listen on provided port, on all network interfaces.
   */
  // var port = ENV.nodejs.NODEJSport;
  
  var port = 8010;
  

  server.listen(port);
  log.info('Express server listening on port ' + port);

  /*
  app.listen(port, function() {
    log.info('Express server listening on port ' + port);
  });
  app.on('error', function(error) { log.info(error); });
  app.on('listening', function() { log.info('listening'); });
  */

  /*
  io.on('connection', function (socket) {
    
    socket.emit('news', { hello: 'world' });

    socket.on('my other event', function (data) {
      console.log(data);
    });

    socket.on('add-message', function(message) {
      console.log('add-message');
      socket.emit('message', {type:'new-message', text: message + new Date()});    
    });

    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
    

  });

  */


});