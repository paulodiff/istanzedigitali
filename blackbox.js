var express = require('express');
var app = express();

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
var ENV   = require('./config/config.js'); // load configuration data


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

var log = require('./models/loggerModule.js');
log.log2console('Starting ...');

// var PassportAuth = require('./routes/PassportAuth')();
// app.use('/passportauth', PassportAuth);
// app.use('/module.php', PassportAuth);

// var ProfileMgr = require('./routes/ProfileMgr')();
// app.use('/profilemgr', ProfileMgr);

// var Protocollo = require('./routes/Protocollo')();
// app.use('/segnalazioni', Protocollo);

// var IstanzeMgr = require('./routes/IstanzeMgr')();
// app.use('/istanzemgr', IstanzeMgr);

var GatewayProtocollo = require('./routes/GatewayProtocollo')();
app.use('/api', GatewayProtocollo);

app.use('/swagger', express.static(__dirname + '/swagger'));

/*
// Define routes.
app.get('/',
  function(req, res) {
    res.render('login');
	  //res.redirect('home/');
});
app.use('/home', express.static(__dirname + '/home'));
*/


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

// app.use('/cli',  express.static(__dirname + '/client', options));
// app.use('/draw',  express.static(__dirname + '/draw.io', options));
// app.use('/dist', express.static(__dirname + '/client/dist', options));

// Sequelize START Bootstrap
var models = require("./modelsSequelize");

log.log2console('Sequelize START');

log.log2console('Server started at:' + ENV.nodejs.NODEJSport);
log.log2file('Server started at:' + ENV.nodejs.NODEJSport);
//app.listen(ENV.nodejs.NODEJSport);


models.sequelize.sync().then(function() {
  // models.Istanze.sync({force:false});
  /**
   * Listen on provided port, on all network interfaces.
   */
  var port = ENV.nodejs.NODEJSport;
  app.listen(port, function() {
    log.log2console('Express server listening on port ' + port);
  });
  app.on('error', function(error) { log.log2console(error); });
  app.on('listening', function() { log.log2console('listening'); });
});