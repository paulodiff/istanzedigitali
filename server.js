var express = require('express');
var passport = require('passport');
var fs = require('fs');
//var Strategy = require('passport-local').Strategy;
var SamlStrategy = require('passport-saml').Strategy;
var db = require('./db');


// http://stackoverflow.com/questions/24092211/passport-saml-implementation
// rruggeri
// openidp.feide.no


//https://idp.ssocircle.com/sso/hos/SelfCare.jsp
//rruggeri
//ssocircle.com

// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.

var samlStrategy = new SamlStrategy(
  {
    path: '/login/callback',
    entryPoint: 'https://federatest.lepida.it/gw/SSOProxy/SAML2',
    issuer: 'passport-saml',
    cert: fs.readFileSync('./certs/saml.pem', 'utf-8'),
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
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});




// Create a new Express application.
var app = express();

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


var cert = fs.readFileSync('./certs/saml.crt', 'utf-8');

// Define routes.
app.get('/',
  function(req, res) {
    res.render('login', { user: req.user });
  });

app.get('/login',
  function(req, res){
    res.render('login');
  });

app.post('/login',
  passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
  function(req, res) {
      console.log('get /login');
        res.redirect('/profile');
        }
);

app.get('/metadata', 
    function(req, res) {
        res.type('application/xml');
        res.send(200, samlStrategy.generateServiceProviderMetadata(cert));
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
   passport.authenticate('saml', { failureRedirect: '/login', failureFlash: true }),
  function(req, res) {
        console.log('POST /login');
        res.redirect('/');
  });
  
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

app.listen(3000);